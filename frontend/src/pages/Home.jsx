import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/profile.png';
import avatarImage from '../assets/avatar.png';
import rectangle1Icon from '../assets/rectangle1.svg';
import rectangle2Icon from '../assets/rectangle2.svg';
import warnIcon from '../assets/warn.svg';
import frameIcon from '../assets/frame_.svg';
import goPlayImage from '../assets/go_play.png';
import useAccount from '../hooks/useAccount';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.hide();
  }, [])
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const account = useAccount((state) => state.account);
  return (
    <div className="relative w-[100%] h-screen bg-black overflow-hidden">
      <img src={profileImage} 
           alt=""
           className="absolute inset-0 w-[100%]"
        />
      <div className="absolute top-[2.67%] left-[5.13%] w-[89.74%] flex ">
        <div className="relative cursor-pointer w-[69.571%]" onClick={() => navigate("/profile/"+account?.user?.id)}>
            <img src={rectangle1Icon} alt="" className="w-[100%] backdrop-blur-[40px]" style={{clipPath: 'polygon(0% 0%, 91.5% 0%, 100% 26%, 100% 100%, 8.2% 100%, -24.5% 0%)'}} />
            <div className="absolute inset-0 w-[100%] h-[100%] flex items-center gap-[2.05%]">
              <div className="relative h-[58px] w-[58px] my-[12.5%] mx-[4.11%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 80%)'}}>
                {account?.user?.avatar ? 
                  <img className="w-[100%] h-[100%] object-cover" src={apiUrl+account?.user?.avatar} alt="" />
                :
                  <div className="w-[100%] h-[100%] bg-[#1B1F28] flex items-center justify-center font-[700] text-[28px] uppercase">{!account?.user.nickname ? account?.user.first_name.slice(0, 1) : account?.user.nickname.slice(0, 1)}</div>
                }
                <img src={frameIcon} alt="" className="absolute inset-0 w-[100%] h-[100%] object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white">{!account?.user.nickname ? account?.user.first_name : account?.user.nickname}</div>
                <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">{account?.level?.name}</div>
                <div className="uppercase font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)] mt-[5px]">{account?.city.name}</div>
              </div>
            </div>
        </div>
        <div className="relative cursor-pointer w-[27.43%] ml-[2.56%]" onClick={() => navigate("/payments")}>
            <img src={rectangle2Icon} alt="" className="w-[100%] backdrop-blur-[40px]" style={{clipPath: 'polygon(21% 0%, 100% 0%, 100% 75.2%, 79.5% 100%, 0% 100%, 0% 25.4%)'}} />
            <div className="absolute inset-0 w-[100%] h-[100%] flex flex-col items-center justify-center">
              <img src={warnIcon} alt="" className="w-[42.48%]" />
              <div className="uppercase text-[12px] leading-[14.4px] font-[400] mt-[7.5%]">Оплата</div>
            </div>
        </div>
      </div>
      {/* <div className="absolute bottom-[15.33%] left-0 w-[100%]">
        <img src={goPlayImage} alt="" className="w-[100%]" />
        <div className="uppercase absolute left-0 top-[17.925%] font-[600] text-[24px] leading-[28.8px] w-[100%] text-center text-white">Войти в игру</div>
        <div className="uppercase absolute left-0 top-[71.698%] font-[600] text-[16px] leading-[19.2px] w-[100%] text-center text-[rgba(255,234,0,1)]">( вы в игре )</div>
      </div> */}
    </div>
  );
}

export default Home;