import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Menu from './components/Menu';
import Loading from './components/Loading';
import OnboardingSlider from './components/OnboardingSlider';
import useAuthStore from './hooks/useAuthStore';
import useAccount from './hooks/useAccount';
import useMessages from './hooks/useMessages';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [loading, setLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0)
  useEffect(() => {
    if (loadedImagesCount >= 4 && loading) {
      setLoading(false);
    }
  }, [loadedImagesCount, loading])
  useEffect(() => {
    if (window.Telegram && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Отключаем вертикальные свайпы
      tg.disableVerticalSwipes(true);
      tg.setHeaderColor("#000614");
      tg.setBackgroundColor("#000614")
    }
  }, [window.Telegram, window.Telegram?.WebApp])
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('onboardingComplete'));
  const [currentPage, setCurrentPage] = useState('profile');
  const location = useLocation();
  const { setToken } = useAuthStore();
  const token = useAuthStore((state) => state.token);
  const { setAccount } = useAccount();
  const account = useAccount((state) => state.account);
  const { messages, removeMessage, addMessage } = useMessages();

  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (isLoading) {
      const initData = window.Telegram?.WebApp?.initData;
      if (initData) {
        fetch(apiUrl + '/auth/telegram/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ initData })
        })
        .then(response => response.json())
        .then(data => {
            setToken(data.token);
        })
        .catch(error => console.error('Error:', error));
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (token) {
      fetch(apiUrl+'/user/', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      })
      .then(response => response.json())
      .then(data => {
        setAccount(data);
      })
      .catch(error => console.error('Error:', error));
    }
  }, [token]);
  
  useEffect(() => {
    switch (location.pathname) {
      case '/':
      setCurrentPage('profile');
      break;
      case '/rating':
      setCurrentPage('rating');
      break;
      case '/rules':
      setCurrentPage('rules');
      break;
      case '/friends':
      setCurrentPage('friends');
      break;
      case '/signup':
      setCurrentPage('signup');
      break;
      default:
      setCurrentPage('profile');
    }
  }, [location]);
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 4500);
  }, [])
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingComplete', 'true');
  };

  useEffect(() => {
    const getMessages = async () => {
      if (token && account) {
        try {
          const response = await fetch(apiUrl+'/get_messages/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
          });
          const data = await response.json();
          if (response.ok) {
            if ('messages' in data) {
              data.messages.forEach(message => {
                addMessage(message);
              });
            }
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error('Server error', error);
        }
      }
    };
    const interval = setInterval(getMessages, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [account, token]);
  
  return (
    <div className="relative flex flex-col h-[100%] overflow-x-hidden">
      <TransitionGroup className="fixed z-[5] top-[20px] left-[20px] w-[calc(100%-40px)] pointer-events-none">
        {messages.map((msg) => (
          <CSSTransition key={msg.id} timeout={300} classNames="message" onEntered={() => setTimeout(() => removeMessage(msg.id), 5000)}>
            <div className="flex items-center p-[10px] mb-[10px] text-sm rounded-lg bg-[#282828] border" style={msg.type === "error" ? {borderColor: "#9b1c1c", color: "#f98080"} : {borderColor: "green", color: "#31c48d"}} role="alert">
              {msg.type === "error" ? 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-[1.25rem] h-[1.25rem]">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"></path>
              </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-[1.25rem] h-[1.25rem]">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"></path>
              </svg>}
              <div className="ml-[10px]">
                {msg.name && <span className="font-medium">{msg.name}</span>} {msg.text}
              </div>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <div style={loading ? { display: "none"} : null}>
          <div style={isLoading ? null : { display: "none"}} >
            <Loading loading={loading} setLoadedImagesCount={setLoadedImagesCount} />
          </div>
          <div style={isLoading || !showOnboarding ? {display: "none"} : null}>
            <OnboardingSlider onComplete={handleOnboardingComplete} setLoadedImagesCount={setLoadedImagesCount} loading={loading} />
          </div>
          <div style={isLoading || showOnboarding ? {display: "none"} : null}>
            <Outlet />
            <Menu currentPage={currentPage} setLoadedImagesCount={setLoadedImagesCount} />
          </div>
      </div>
      <div className="relative w-[100%] h-[100%] overflow-hidden flex items-center justify-center" style={loading ? null : { display: "none"}}>
        <LoadingSpinner />
      </div>
    </div>
  );
}

export default App;