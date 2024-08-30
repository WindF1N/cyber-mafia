import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/profile.png';
import avatarImage from '../assets/avatar.png';
import rectangle1Icon from '../assets/rectangle1.svg';
import rectangle2Icon from '../assets/rectangle2.svg';
import warnIcon from '../assets/warn.svg';
import frameIcon from '../assets/frame.svg';
import goPlayImage from '../assets/go_play.png';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative w-[100%] h-screen bg-black overflow-hidden">
      <img src={profileImage} 
           alt=""
           className="absolute inset-0 w-[100%]"
        />
      <div className="absolute top-[2.67%] left-[5.13%] w-[89.74%] flex ">
        <div className="relative cursor-pointer w-[69.571%]">
            <img src={rectangle1Icon} alt="" className="w-[100%] backdrop-blur-[40px]" style={{clipPath: 'polygon(0% 0%, 91.5% 0%, 100% 26%, 100% 100%, 8.2% 100%, -24.5% 0%)'}} />
            <div className="absolute inset-0 w-[100%] h-[100%] flex items-center gap-[2.05%]">
              <div className="relative h-[72.5%] my-[12.5%] mx-[4.11%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 80%)'}}>
                <img src={avatarImage} alt="" className="w-[100%] h-[100%] object-cover" />
                <img src={frameIcon} alt="" className="absolute inset-0 w-[100%] h-[100%] object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white mb-[14.5%]">Никнейм</div>
                <div className="uppercase font-[400] text-[12px] leading-[14.4px] text-[rgba(255,255,255,0.7)]">Какая лига</div>
              </div>
            </div>
        </div>
        <div className="relative cursor-pointer w-[27.43%] ml-[2.56%]">
            <img src={rectangle2Icon} alt="" className="w-[100%] backdrop-blur-[40px]" style={{clipPath: 'polygon(21% 0%, 100% 0%, 100% 75.2%, 79.5% 100%, 0% 100%, 0% 25.4%)'}} />
            <div className="absolute inset-0 w-[100%] h-[100%] flex flex-col items-center justify-center">
              <img src={warnIcon} alt="" className="w-[42.48%]" />
              <div className="uppercase text-[12px] leading-[14.4px] font-[400] mt-[7.5%]">Оплата</div>
            </div>
        </div>
      </div>
      <div className="absolute bottom-[15.33%] left-0 w-[100%]" onClick={() => navigate("/signup")}>
        <img src={goPlayImage} alt="" className="w-[100%]" />
        <div className="uppercase absolute left-0 top-[17.925%] font-[600] text-[24px] leading-[28.8px] w-[100%] text-center text-white">Войти в игру</div>
        <div className="uppercase absolute left-0 top-[71.698%] font-[600] text-[16px] leading-[19.2px] w-[100%] text-center text-[rgba(255,234,0,1)]">( вы в игре )</div>
      </div>
    </div>
  );
}

export default Home;