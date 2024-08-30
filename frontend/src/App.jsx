import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import Loading from './components/Loading';
import OnboardingSlider from './components/OnboardingSlider';

function App() {
  useEffect(() => {
    if (window.Telegram && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Отключаем вертикальные свайпы
      tg.disableVerticalSwipes(true);
      tg.setHeaderColor("#000000");
      tg.setBackgroundColor("#000000")
    }
  }, [window.Telegram, window.Telegram?.WebApp])
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('onboardingComplete'));
  const [currentPage, setCurrentPage] = useState('profile');
  const location = useLocation();
  
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
      <Outlet />
      {currentPage !== "signup" &&
      <Menu currentPage={currentPage} />}
      </div>
    )}
    </div>
  );
}

export default App;