import sbpIcon from '../../assets/sbp.svg';
import alfaIcon from '../../assets/alfa.svg';
import sberIcon from '../../assets/sber.svg';
import raifIcon from '../../assets/raif.svg';
import tbankIcon from '../../assets/tbank.svg';

function SBP() {
  return (
    <div className="relative w-[100%] h-screen overflow-hidden">
      <div className="relative w-[100%] mt-[4.66%]">
        {/* <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Способы оплаты</div> */}
        <img src={sbpIcon} alt="" className="w-[46.3%] mx-auto" />
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[rgba(255,255,255,.5)] mt-[4.66%]">
            Выберите банк для<br/>подтверждения оплаты
        </div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex items-center" style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="flex-shrink-0 my-auto">
                <img src={alfaIcon} alt="" className="w-[32px]" />
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[5.128%]">Альфа банк</div>
        </div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex items-center" style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="flex-shrink-0 my-auto">
                <img src={sberIcon} alt="" className="w-[32px]" />
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[5.128%]">Сбербанк</div>
        </div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex items-center" style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="flex-shrink-0 my-auto">
                <img src={raifIcon} alt="" className="w-[32px]" />
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[5.128%]">Райффазен банк</div>
        </div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex items-center" style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="flex-shrink-0 my-auto">
                <img src={tbankIcon} alt="" className="w-[32px]" />
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[5.128%]">т-банк</div>
        </div>
      </div>
    </div>
  );
}

export default SBP;