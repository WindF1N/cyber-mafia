import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';
import frameIcon from '../assets/frame.svg';
import shareIcon from '../assets/share.svg';
import hackerIcon from '../assets/hacker.svg';
import cyberdetectivIcon from '../assets/cyberdetectiv.svg';
import corporatespyIcon from '../assets/corporatespy.svg';
import useAccount from '../hooks/useAccount';

function Profile() {
  const navigate = useNavigate();
  useEffect(() => {
        var BackButton = window.Telegram.WebApp.BackButton;
        if (window.location.pathname === "/profile") {
            BackButton.show();
            BackButton.onClick(function() {
                navigate("/")
                BackButton.hide();
            });
        } else {
            BackButton.hide();
        }
  }, [window.location.pathname])
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const account = useAccount((state) => state.account);
  return (
    <div className="relative w-[100%] min-h-screen bg-[#000614] overflow-hidden pb-[200px]">
      <div className="relative flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]">
        <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
          <img className="w-[100%] h-[100%] object-cover" src={account.user.avatar ? apiUrl+account.user.avatar : avatarImage} />
          <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
        </div>
        <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
          <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">{account.user.first_name || account.user.nickname}</div>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">{account.city.name}</div>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">Sample заглушка</div>
          <img src={shareIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
        </div>
      </div>
      <div className="flex items-center space-between gap-[2.564%] px-[5.128%] mt-[2.66%]">
        <div className="relative bg-[#1B1F28] w-[100%] flex flex-col items-center pt-[5px] pb-[12px]" style={{clipPath: 'polygon(0% 0%, 90.91% 0%, 100% 22.17%, 100% 89.13%, 95% 100%, 5% 100%, 0% 89.13%)'}}>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)]">Всего игр</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white mt-[3px]">15</div>
          <div className="h-[5px] w-[100%] absolute bottom-0 left-0 bg-[#25E9FF]"></div>
        </div>
        <div className="relative bg-[#1B1F28] w-[100%] flex flex-col items-center pt-[5px] pb-[12px]" style={{clipPath: 'polygon(0% 0%, 90.91% 0%, 100% 22.17%, 100% 89.13%, 95% 100%, 5% 100%, 0% 89.13%)'}}>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)]">Побед</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white mt-[3px]">8</div>
          <div className="h-[5px] w-[100%] absolute bottom-0 left-0 bg-[#25E9FF]"></div>
        </div>
        <div className="relative bg-[#1B1F28] w-[100%] flex flex-col items-center pt-[5px] pb-[12px]" style={{clipPath: 'polygon(0% 0%, 90.91% 0%, 100% 22.17%, 100% 89.13%, 95% 100%, 5% 100%, 0% 89.13%)'}}>
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)]">ур. Доверия</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white mt-[3px]">85%</div>
          <div className="h-[5px] w-[100%] absolute bottom-0 left-0 bg-[#25E9FF]"></div>
        </div>
      </div>
      <div className="relative bg-[#1B1F28] w-[89.744%] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%]" style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 10.98%, 100% 100%, 0% 100%)'}}>
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">лучшие роли:</div>
        <div className="flex items-center mt-[2.66%]">
          <img src={hackerIcon} alt="" className="w-[23.3px] mr-[2.564%]" />
          <div className="uppercase text-[12px] leading-[14.4px] text-white white-space-nowrap">Хакер</div>
          <div className="uppercase text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] ml-[1.282%] white-space-nowrap">3 победы</div>
        </div>
        <div className="flex items-center mt-[2.66%]">
          <img src={cyberdetectivIcon} alt="" className="w-[23.3px] mr-[2.564%]" />
          <div className="uppercase text-[12px] leading-[14.4px] text-white white-space-nowrap">Кибердетектив</div>
          <div className="uppercase text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] ml-[1.282%] white-space-nowrap">2 победы</div>
        </div>
        <div className="flex items-center mt-[2.66%]">
          <img src={corporatespyIcon} alt="" className="w-[23.3px] mr-[2.564%]" />
          <div className="uppercase text-[12px] leading-[14.4px] text-white white-space-nowrap">Корпоративный шпион</div>
          <div className="uppercase text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] ml-[1.282%] white-space-nowrap">3 победы</div>
        </div>
      </div>
      <div className="relative w-[89.744%] mx-[5.128%] mt-[4%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Завершенные игры</div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Мафия</div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden rounded-tr-[10px] rounded-br-[10px]" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#0050E4] w-[50%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
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
              <div className="font-[700] text-[12px] leading-[14.4px] text-white">48</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Мирный</div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden rounded-tr-[10px] rounded-br-[10px]" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#9000E4] w-[50%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
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
              <div className="font-[700] text-[12px] leading-[14.4px] text-white">48</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Оборотень</div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden rounded-tr-[10px] rounded-br-[10px]" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#0098E4] w-[50%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
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
              <div className="font-[700] text-[12px] leading-[14.4px] text-white">48</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-white" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-[89.744%] mx-[5.128%] mt-[4%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Победы</div>
        <div className="flex items-center justify-between mt-[4.66%] w-[100%]">
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 100% 100%, 0% 100%)'}}>
            <div className="relative bg-[#00E45F] w-[100%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="absolute inset-0 m-auto w-[100%] h-[100%] flex items-center justify-center font-[700] text-[10px] leading-[12px] text-[rgba(127,241,175,1)]">58</div>
            </div>
          </div>
          <div className="absolute right-0 left-0 mx-auto w-[46px] h-[32px] bg-[#1B1F28] flex items-center justify-center z-[2]" style={{clipPath: 'polygon(6.8px 0%, 39.2px 0%, 100% 5px, 100% 19px, 39.2px 100%, 6.8px 100%, 0% 19px, 0% 5px)'}}>
            <div className="flex items-center justify-center">
              <div className="absolute top-0 h-[2px] w-[26px] bg-[#00E45F]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 24px 100%, 2px 100%)'}}></div>
              <div className="font-[700] text-[12px] leading-[14.4px] text-[#00E45F]">45%</div>
              <div className="absolute bottom-0 h-[2px] w-[26px] bg-[#00E45F]" style={{clipPath: 'polygon(2px 0%, 24px 0%, 100% 100%, 0% 100%)'}}></div>
            </div>
          </div>
          <div className="relative bg-[#1B1F28] w-[65.64%] h-[16px] overflow-hidden" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
            <div className="relative bg-[#FF070C] w-[100%] h-[16px] flex items-center" style={{clipPath: 'polygon(3.91% 0%, 100% 0%, 96.09% 100%, 0% 100%)'}}>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(255,234,0,1)] w-[25px] h-[16px] flex-shrink-0 text-black text-[10px] leading-[12px] font-[700] text-center flex items-center justify-center" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}>
                1
              </div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="relative bg-[rgba(0,0,0,.2)] w-[25px] h-[16px] flex-shrink-0" style={{clipPath: 'polygon(9px 0%, 100% 0%, 16px 100%, 0% 100%)'}}></div>
              <div className="absolute inset-0 m-auto w-[100%] h-[100%] flex items-center justify-center font-[700] text-[10px] leading-[12px] text-[rgba(229,130,132,1)]">58</div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-[100%] mt-[4.66%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">баллы</div>
        <div className="relative flex items-center justify-between mt-[4.66%] w-[100%] h-[100%] gap-[3px]">
          <div className="h-[17px] w-[100%] bg-gradient-to-r from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
          <div className="text-center font-[600] text-[14px] leading-[16.8px] text-[#FFEA00]">3167</div>
          <div className="h-[17px] w-[100%] bg-gradient-to-l from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
        </div>
        <div className="relative w-[89.744%] mx-[5.128%] flex items-center justify-center mt-[4.66%]">
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)] mr-[15px]">За все игры:</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white">0</div>
        </div>
        <div className="relative w-[89.744%] mx-[5.128%] flex items-center justify-center mt-[2.33%]">
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)] mr-[45px]">за месяц:</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white">18</div>
        </div>
        <div className="relative w-[89.744%] mx-[5.128%] flex items-center justify-center mt-[2.33%]">
          <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.7)] mr-[15px]">в среднем за игру:</div>
          <div className="font-[600] text-[12px] leading-[14.4px] text-white">25</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;