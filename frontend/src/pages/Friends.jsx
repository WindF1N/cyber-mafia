import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';
import frameIcon from '../assets/frame.svg';
import starGrayIcon from '../assets/star-gray.svg';
import starGoldIcon from '../assets/star-gold.svg';
import copyWhiteIcon from '../assets/copy-white.svg';
import buttonForReflinkImage from '../assets/button-for-reflink.svg';
import ratingImage from '../assets/image.png';

function Friends() {
  const navigate = useNavigate();
  const [ listType, setListType] = useState('friends');
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.hide();
  }, [])
  return (
    <div className="relative w-[100%] min-h-screen overflow-hidden pb-[200px]">
      <div className="relative w-[100%] mt-[4.66%]">
        <div className="w-[28.72%] h-[63.67%] bg-[#00D5FF] rounded-[100%] absolute left-0 right-0 top-[12.11%] blur-[100px] mx-auto z-[-1]"></div>
        <img src={ratingImage} alt="" className="w-[100%]" />
        <div className="uppercase font-[600] text-[18px] leading-[21.6px] text-center text-white absolute left-0 right-0 mx-auto bottom-[22.49%]">Приглашай друзей,<br/>зарабатывай баллы</div>
        <div className="font-[400] text-[12px] leading-[15.6px] text-center text-white absolute left-0 right-0 mx-auto bottom-[7.96%]">Получайте по <span className="text-[#FFEA00]">50 баллов</span> за<br/>каждого друга!</div>
      </div>
      <div className="relative w-[89.74%] mt-[4.66%] mx-[5.13%]">
        <img src={buttonForReflinkImage} alt="" className="w-[100%]" />
        <div className="cursor-pointer absolute inset-0 m-auto flex items-center justify-center gap-[2.564%]">
          <div className="uppercase font-[600] text-[12px] leading-[14.4px] text-center">ваша реферальная ссылка</div>
          <div>
            <img src={copyWhiteIcon} alt="" className="w-[20px] h-[20px]" />
          </div>
        </div>
      </div>
      <div className="relative w-[89.74%] mt-[4.66%] mx-[5.13%] flex items-center justify-center">
        <div className="relative cursor-pointer">
          <div className="uppercase font-[600] text-[18px] leading-[21.6px] text-white text-center">Мои друзья</div>
          {/* <div className="absolute bottom-[-4px] h-[2px] w-[100%] bg-[#25E9FF]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 98.113% 100%, 1.887% 100%)'}}></div> */}
        </div>
        {/* <div className="relative cursor-pointer" onClick={() => setListType("participants")}>
          <div className="uppercase font-[600] text-[18px] leading-[21.6px] text-[rgba(255,255,255,.3)] text-center">Участники</div>
        </div> */}
      </div>
      <div className="relative mt-[4.66%]">
        <div className="relative flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]">
          <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
            <img className="w-[100%] h-[100%] object-cover" src={avatarImage} />
            <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
          </div>
          <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">Никнейм</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">Какая лига</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">В игре с 9.10.2023</div>
            <img src={starGoldIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
            <div className="absolute right-[15.42%] top-0 bottom-0 h-[100%] flex flex-col justify-between">
              <div className="w-[100%] h-[10px] bg-gradient-to-b from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
              <div className="font-[700] text-[14px] leading-[16.8px] text-center text-white">12576</div>
              <div className="w-[100%] h-[10px] bg-gradient-to-t from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]">
          <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
            <img className="w-[100%] h-[100%] object-cover" src={avatarImage} />
            <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
          </div>
          <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">Никнейм</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">Какая лига</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">В игре с 9.10.2023</div>
            <img src={starGoldIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
            <div className="absolute right-[15.42%] top-0 bottom-0 h-[100%] flex flex-col justify-between">
              <div className="w-[100%] h-[10px] bg-gradient-to-b from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
              <div className="font-[700] text-[14px] leading-[16.8px] text-center text-white">12576</div>
              <div className="w-[100%] h-[10px] bg-gradient-to-t from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]">
          <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
            <img className="w-[100%] h-[100%] object-cover" src={avatarImage} />
            <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
          </div>
          <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">Никнейм</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">Какая лига</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">В игре с 9.10.2023</div>
            <img src={starGoldIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
            <div className="absolute right-[15.42%] top-0 bottom-0 h-[100%] flex flex-col justify-between">
              <div className="w-[100%] h-[10px] bg-gradient-to-b from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
              <div className="font-[700] text-[14px] leading-[16.8px] text-center text-white">12576</div>
              <div className="w-[100%] h-[10px] bg-gradient-to-t from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]">
          <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
            <img className="w-[100%] h-[100%] object-cover" src={avatarImage} />
            <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
          </div>
          <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">Никнейм</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">Какая лига</div>
            <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">В игре с 9.10.2023</div>
            <img src={starGrayIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
            <div className="absolute right-[15.42%] top-0 bottom-0 h-[100%] flex flex-col justify-between">
              <div className="w-[100%] h-[10px] bg-gradient-to-b from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
              <div className="font-[700] text-[14px] leading-[16.8px] text-center text-white">12576</div>
              <div className="w-[100%] h-[10px] bg-gradient-to-t from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends;