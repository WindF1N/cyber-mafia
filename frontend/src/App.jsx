import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import Loading from './components/Loading';
import OnboardingSlider from './components/OnboardingSlider';
import useAuthStore from './hooks/useAuthStore';
import useAccount from './hooks/useAccount';
import SignUp from './pages/SignUp';

function App() {
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
      fetch(apiUrl+'/me/', {
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
    // localStorage.setItem('onboardingComplete', 'true');
  };
  
  return (
    <div className="relative flex flex-col h-[100%] overflow-x-hidden">
    {isLoading ? (
      <Loading />
    ) : showOnboarding ? (
      <OnboardingSlider onComplete={handleOnboardingComplete} />
    ) : (
      <div className="relative flex-1 overflow-auto">
        {(account.user && account.user.is_registered) ?
        <>
          <Outlet />
          <Menu currentPage={currentPage} />
        </>
        : <SignUp />}
      </div>
    )}
    </div>
  );
}

export default App;