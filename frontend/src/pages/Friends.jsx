import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';
import frameIcon from '../assets/frame.svg';
import starGrayIcon from '../assets/star-gray.svg';
import starGoldIcon from '../assets/star-gold.svg';
import searchIcon from '../assets/search.svg';
import filterIcon from '../assets/filter.svg';

function Friends() {
  const navigate = useNavigate();
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.hide();
  }, [])
  return (
    <div className="relative w-[100%] min-h-screen overflow-hidden pb-[200px]">
      <div className="relative mt-[4.66%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Участники клуба</div>
      </div>
      <div className="relative w-[89.74%] mx-auto mt-[4.66%] bg-[#1B1F28] h-[62px] w-[100%] flex items-center p-[20px]" style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 17px 100%, 0% 47.5px)"}}>
        <div>
          <img src={searchIcon} alt="" className="w-[24px] h-[24px]" />
        </div>
        <div>
          <input type="text" className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2 outline-0 focus:outline-0" />
        </div>
        <div>
          <img src={filterIcon} alt="" className="w-[24px] h-[24px]" />
        </div>
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