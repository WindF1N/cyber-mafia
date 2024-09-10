import React from 'react';
import { Link } from 'react-router-dom';
import menuBGImage from '../assets/menu-bg.svg';
import userIcon from '../assets/user.svg';
import userBlueIcon from '../assets/user-blue.svg';
import starIcon from '../assets/star.svg';
import starBlueIcon from '../assets/star-blue.svg';
import shieldIcon from '../assets/shield.svg';
import shieldBlueIcon from '../assets/shield-blue.svg';
import friendsIcon from '../assets/friends.svg';
import friendsBlueIcon from '../assets/friends-blue.svg';

function Menu({ currentPage }) {
  const menuItems = [
    { page: 'profile', icon: userIcon, activeIcon: userBlueIcon, label: 'Профиль', path: '/' },
    { page: 'rating', icon: starIcon, activeIcon: starBlueIcon, label: 'Рейтинг', path: '/rating' },
    { page: 'rules', icon: shieldIcon, activeIcon: shieldBlueIcon, label: 'Правила', path: '/rules' },
    { page: 'friends', icon: friendsIcon, activeIcon: friendsBlueIcon, label: 'Друзья', path: '/friends' },
  ];

  return (
    <div className="fixed bottom-[2.67%] left-[5.13%] right-[5.13%] bg-[rgba(87,87,87,0.1)] backdrop-blur-[40px] w-[89.74%] z-[3] max-w-[380px] mx-auto" style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 76.6%, 94.4% 100%, 5.6% 100%, 0% 76.6%)"}}>
      <img src={menuBGImage} alt="" className="w-[100%]" />
      <div className="absolute inset-0 w-[100%] h-[100%] flex justify-around overflow-hidden">
        {menuItems.map((item) => (
            <Link key={item.page} to={item.path} className="relative flex flex-col justify-center items-center">
                <img
                    className="w-[24px] h-[24px] mb-[8px]"
                    src={currentPage === item.page ? item.activeIcon : item.icon}
                    alt={item.label}
                />
                <div className={`uppercase font-[400] leading-[9.6px] text-[8px] ${currentPage === item.page ? 'text-[#25E9FF]' : 'text-[#FFFFFF]'}`}>
                    {item.label}
                </div>
                {currentPage === item.page &&
                <>
                    <div className="active-menu absolute top-0 h-[5px] w-[100%] bg-[#25E9FF]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)'}}></div>
                    <div className="active-menu absolute top-0 h-[50%] scale-[0.9] blur-[15px]" style={{background: "linear-gradient(180deg, #00D5FF -19.54%, rgba(115, 115, 115, 0) 37.58%)"}}></div>
                    <div className="active-menu absolute bottom-0 h-[50%] scale-[0.9] blur-[15px]" style={{background: "linear-gradient(0deg, #00D5FF -19.54%, rgba(115, 115, 115, 0) 37.58%)"}}></div>
                    <div className="active-menu absolute bottom-0 h-[5px] w-[100%] bg-[#25E9FF]" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)'}}></div>
                </>}
            </Link>
        ))}
      </div>
    </div>
  );
}

export default Menu;