import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buttonGreenImage from '../assets/button-green.svg';
import sbpIcon from '../assets/sbp.svg';
import cardsIcon from '../assets/cards.svg';
import tonIcon from '../assets/ton.svg';

function Payments() {
  const navigate = useNavigate();
  const [ paymentType, setPaymentType ] = useState('sbp');
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    if (window.location.pathname === "/payments") {
        BackButton.show();
        BackButton.onClick(function() {
            navigate("/")
            BackButton.hide();
        });
    } else {
        BackButton.hide();
    }
  }, [window.location.pathname])
  return (
    <div className="relative w-[100%] h-screen overflow-hidden">
      <div className="relative w-[100%] mt-[4.66%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Способы оплаты</div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex" onClick={() => setPaymentType("sbp")} style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="w-[20px] h-[20px] rounded-[100%] border border-[rgba(255,255,255,.5)] flex items-center justify-center flex-shrink-0">
                <div className="w-[14px] h-[14px] rounded-[100%]" style={paymentType === "sbp" ? {background: "white"} : null}></div>
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[2.564%]">Система быстрых платежей</div>
            <div className="flex-shrink-0 my-auto ml-auto">
                <img src={sbpIcon} alt="" className="w-[65px]" />
            </div>
        </div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex" onClick={() => setPaymentType("cards")} style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="w-[20px] h-[20px] rounded-[100%] border border-[rgba(255,255,255,.5)] flex items-center justify-center flex-shrink-0">
                <div className="w-[14px] h-[14px] rounded-[100%]" style={paymentType === "cards" ? {background: "white"} : null}></div>
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[2.564%]">по номеру карты или телефона</div>
            <div className="flex-shrink-0 my-auto ml-auto">
                <img src={cardsIcon} alt="" className="w-[100px]" />
            </div>
        </div>
        <div className="relative cursor-pointer bg-[#1B1F28] w-[89.744%] h-[62px] mx-[5.128%] mt-[4%] px-[2.564%] py-[2.66%] flex" onClick={() => setPaymentType("ton")} style={{clipPath: 'polygon(0% 0%, 95.14% 0%, 100% 23.39%, 100% 100%, 0% 100%)'}}>
            <div className="w-[20px] h-[20px] rounded-[100%] border border-[rgba(255,255,255,.5)] flex items-center justify-center flex-shrink-0">
                <div className="w-[14px] h-[14px] rounded-[100%]" style={paymentType === "ton" ? {background: "white"} : null}></div>
            </div>
            <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-white ml-[2.564%]">TON coins</div>
            <div className="flex-shrink-0 my-auto ml-auto pr-[2.564%]">
                <img src={tonIcon} alt="" className="w-[24px]" />
            </div>
        </div>
      </div>
      <div className="absolute bottom-[18.33%] left-[5.13%] cursor-pointer w-[89.74%] max-w-[380px]" onClick={() => navigate("/payments/" + paymentType)}>
        <img src={buttonGreenImage} alt="" className="w-[100%]" />
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[#00E45F] absolute w-[100%] h-[100%] inset-0 flex items-center justify-center">оплатить</div>
      </div>
    </div>
  );
}

export default Payments;