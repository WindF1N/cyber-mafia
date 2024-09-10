import cardsIcon from '../../assets/cards.svg';
import buttonGreenImage from '../../assets/button-green.svg';
import copyIcon from '../../assets/copy.svg';

function Cards() {
  return (
    <div className="relative w-[100%] h-screen overflow-hidden">
      <div className="relative w-[100%] mt-[4.66%]">
        <img src={cardsIcon} alt="" className="w-[68.72%] mx-auto" />
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[rgba(255,255,255,.5)] mt-[4.33%]">
            Оплата по номеру карты<br/>или номеру телефона
        </div>
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[rgba(255,255,255,.5)] mt-[8.32%]">
            номер телефона
        </div>
        <div className="flex items-center justify-center gap-[5.128%] bg-[#1B1F28] h-[62px] w-[89.74%] mx-auto mt-[4.66%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 66.13%, 94.29% 100%, 5.71% 100%, 0% 66.13%)'}}>
            <div className="font-[400] text-[16px] leading-[19.2px] text-center text-[#00D5FF]">+7(911) 298-75-08</div>
            <img src={copyIcon} alt="" className="w-[24px] h-[24px]" />
        </div>
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[rgba(255,255,255,.5)] mt-[4.66%]">
            номер Карты
        </div>
        <div className="flex items-center justify-center gap-[5.128%] bg-[#1B1F28] h-[62px] w-[89.74%] mx-auto mt-[4.66%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 66.13%, 94.29% 100%, 5.71% 100%, 0% 66.13%)'}}>
            <div className="font-[400] text-[16px] leading-[19.2px] text-center text-[#00D5FF]">4264 8726 2212 0076</div>
            <img src={copyIcon} alt="" className="w-[24px] h-[24px]" />
        </div>
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[rgba(255,255,255,.5)] mt-[4.66%] w-[89.74%] mx-auto">
            нажмите “готово” после перевода средств
        </div>
      </div>
      <div className="absolute bottom-[18.33%] left-[5.13%] cursor-pointer w-[89.74%] max-w-[380px]">
        <img src={buttonGreenImage} alt="" className="w-[100%]" />
        <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[#00E45F] absolute w-[100%] h-[100%] inset-0 flex items-center justify-center">готово</div>
      </div>
    </div>
  );
}

export default Cards;