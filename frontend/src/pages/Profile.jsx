import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import frameIcon from '../assets/frame.svg';
import shareIcon from '../assets/share.svg';
import hackerIcon from '../assets/hacker.svg';
import cyberdetectivIcon from '../assets/cyberdetectiv.svg';
import corporatespyIcon from '../assets/corporatespy.svg';
import useAuthStore from '../hooks/useAuthStore';
import useAccount from '../hooks/useAccount';

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = useAuthStore((state) => state.token);
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const [ account, setAccount ] = useState();
  const authUser = useAccount((state) => state.account);
  useEffect(() => {
    if (token && userId && authUser.user.id !== userId) {
      fetch(apiUrl+'/user/?userId='+userId, {
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
  }, [token, userId])
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    if (window.location.pathname.includes("/profile/")) {
        BackButton.show();
        BackButton.onClick(function() {
            navigate("/");
            BackButton.hide();
        });
    } else {
        BackButton.hide();
    }
  }, [window.location.pathname])
  return (
    <div className="relative w-[100%] min-h-screen bg-[#000614] overflow-hidden pb-[200px]">
      <div className="relative flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]">
        <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
          {account?.user?.avatar ? 
            <img className="w-[100%] h-[100%] object-cover" src={apiUrl+account?.user?.avatar} />
          :
            <div className="w-[100%] h-[100%] bg-[#1B1F28] flex items-center justify-center font-[700] text-[28px] uppercase">{!account?.user.nickname ? account?.user.first_name.slice(0, 1) : account?.user.nickname.slice(0, 1)}</div>
          }
          <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
        </div>
        <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
          <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">{!account?.user.nickname ? account?.user.first_name : account?.user.nickname}</div>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">{account?.level?.name}</div>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">{account?.city.name}</div>
          <img src={shareIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
        </div>
      </div>
      <div className="flex items-center space-between gap-[2.564%] px-[5.128%] mt-[2.66%]">
        <div className="relative bg-[#1B1F28] w-[100%] flex flex-col items-center pt-[5px] pb-[12px]" style={{clipPath: 'polygon(0% 0%, 90.91% 0%, 100% 22.17%, 100% 89.13%, 95% 100%, 5% 100%, 0% 89.13%)'}}>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)]">Всего игр</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white mt-[3px]">{account?.user?.number_of_games}</div>
          <div className="h-[5px] w-[100%] absolute bottom-0 left-0 bg-[#25E9FF]"></div>
        </div>
        <div className="relative bg-[#1B1F28] w-[100%] flex flex-col items-center pt-[5px] pb-[12px]" style={{clipPath: 'polygon(0% 0%, 90.91% 0%, 100% 22.17%, 100% 89.13%, 95% 100%, 5% 100%, 0% 89.13%)'}}>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)]">Побед</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white mt-[3px]">{account?.user?.number_of_victories}</div>
          <div className="h-[5px] w-[100%] absolute bottom-0 left-0 bg-[#25E9FF]"></div>
        </div>
        <div className="relative bg-[#1B1F28] w-[100%] flex flex-col items-center pt-[5px] pb-[12px]" style={{clipPath: 'polygon(0% 0%, 90.91% 0%, 100% 22.17%, 100% 89.13%, 95% 100%, 5% 100%, 0% 89.13%)'}}>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)]">ур. Доверия</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white mt-[3px]">{account?.user?.trust_level}%</div>
          <div className="h-[5px] w-[100%] absolute bottom-0 left-0 bg-[#25E9FF]"></div>
        </div>
      </div>
      <div className="relative bg-[#1B1F28] w-[89.744%] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%]" style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 10.98%, 100% 100%, 0% 100%)'}}>
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">лучшие роли:</div>
        {account?.user?.best_roles ? 
          <>
            {account?.user?.best_roles?.map((best_role, index) => (
              <div className="flex items-center mt-[2.66%]" key={"bet_role_" + index}>
                <img src={hackerIcon} alt="" className="w-[23.3px] mr-[2.564%]" />
                <div className="uppercase text-[12px] leading-[14.4px] text-white white-space-nowrap">{best_role[0]}</div>
                <div className="uppercase text-[10px] leading-[12px] text-[rgba(255,255,255,0.1)] ml-[1.282%] white-space-nowrap">{best_role[1]}</div>
              </div>
            ))}
          </>
        :
          <>
            <div className="uppercase text-[12px] leading-[14.4px] text-white white-space-nowrap mt-[2.66%] text-center">Данные отсутствуют</div>
          </>}
      </div>
      <div className="relative w-[89.744%] mx-[5.128%] mt-[4%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Завершенные игры</div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Мафия</div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden rounded-tr-[10px] rounded-br-[10px]" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#0050E4] w-[100%] h-[16px] flex items-center" style={{transform: account?.user?.completed_games_for_mafia === 0 ? "translateX(-100%)" : "translateX(-50%)", clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
            </div>
          </div>
          <div className="absolute right-0 w-[46px] h-[24px] bg-[#0050E4] flex items-center justify-center" style={{clipPath: 'polygon(6.8px 0%, 39.2px 0%, 100% 5px, 100% 19px, 39.2px 100%, 6.8px 100%, 0% 19px, 0% 5px)'}}>
            <div className="flex items-center justify-center">
              <div className="absolute top-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(0% 0%, 100% 0%, 24px 100%, 2px 100%)'}}></div>
              <div className="font-[700] text-[12px] leading-[14.4px] text-white">{account?.user?.completed_games_for_mafia}</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Мирный</div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden rounded-tr-[10px] rounded-br-[10px]" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#9000E4] w-[100%] h-[16px] flex items-center" style={{transform: account?.user?.completed_games_for_civilian === 0 ? "translateX(-100%)" : "translateX(-50%)", clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
            </div>
          </div>
          <div className="absolute right-0 w-[46px] h-[24px] bg-[#9000E4] flex items-center justify-center" style={{clipPath: 'polygon(6.8px 0%, 39.2px 0%, 100% 5px, 100% 19px, 39.2px 100%, 6.8px 100%, 0% 19px, 0% 5px)'}}>
            <div className="flex items-center justify-center">
              <div className="absolute top-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(0% 0%, 100% 0%, 24px 100%, 2px 100%)'}}></div>
              <div className="font-[700] text-[12px] leading-[14.4px] text-white">{account?.user?.completed_games_for_civilian}</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Оборотень</div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden rounded-tr-[10px] rounded-br-[10px]" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#0098E4] w-[100%] h-[16px] flex items-center" style={{transform: account?.user?.completed_games_for_werewolf === 0 ? "translateX(-100%)" : "translateX(-50%)", clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
            </div>
          </div>
          <div className="absolute right-0 w-[46px] h-[24px] bg-[#0098E4] flex items-center justify-center" style={{clipPath: 'polygon(6.8px 0%, 39.2px 0%, 100% 5px, 100% 19px, 39.2px 100%, 6.8px 100%, 0% 19px, 0% 5px)'}}>
            <div className="flex items-center justify-center">
              <div className="absolute top-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(0% 0%, 100% 0%, 24px 100%, 2px 100%)'}}></div>
              <div className="font-[700] text-[12px] leading-[14.4px] text-white">{account?.user?.completed_games_for_werewolf}</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-[89.744%] mx-[5.128%] mt-[4%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Победы</div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
            <div className="relative bg-[#00E45F] w-[100%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="absolute inset-0 m-auto w-[100%] h-[100%] flex items-center justify-center font-[700] text-[10px] leading-[12px] text-[rgba(127,241,175,1)]">{account?.user?.number_of_victories}</div>
            </div>
          </div>
          <div className="absolute right-0 left-0 mx-auto w-[46px] h-[32px] bg-[#1B1F28] flex items-center justify-center z-[2]" style={{clipPath: 'polygon(6.8px 0%, 39.2px 0%, 100% 5px, 100% 25.2px, 39.2px 100%, 6.8px 100%, 0% 25.2px, 0% 6.8px)'}}>
            <div className="flex items-center justify-center">
              <div className="absolute top-0 h-[2px] w-[26px] bg-[#00E45F]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 24px 100%, 2px 100%)'}}></div>
              <div className="font-[700] text-[12px] leading-[14.4px] text-[#00E45F]">{account?.user?.number_of_games > 0 ? account?.user?.number_of_victories / account?.user?.number_of_games * 100 : 0}%</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-[#00E45F]" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
            <div className="relative bg-[#FF070C] w-[100%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="absolute inset-0 m-auto w-[100%] h-[100%] flex items-center justify-center font-[700] text-[10px] leading-[12px] text-[rgba(229,130,132,1)]">{account?.user?.number_of_games - account?.user?.number_of_victories}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-[100%] mt-[4.66%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">баллы</div>
        <div className="relative flex items-center justify-between mt-[4.66%] w-[100%] h-[100%] gap-[3px]">
          <div className="h-[17px] w-[100%] bg-gradient-to-r from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
          <div className="text-center font-[600] text-[14px] leading-[16.8px] text-[#FFEA00]">{account?.user?.points}</div>
          <div className="h-[17px] w-[100%] bg-gradient-to-l from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
        </div>
        <div className="relative w-[89.744%] mx-[5.128%] flex items-center justify-center mt-[4.66%]">
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)] mr-[45px]">за месяц:</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white">{account?.user?.points_per_month}</div>
        </div>
        <div className="relative w-[89.744%] mx-[5.128%] flex items-center justify-center mt-[2.33%]">
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)] mr-[15px]">в среднем за игру:</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white">{account?.user?.points_per_game_on_average}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;