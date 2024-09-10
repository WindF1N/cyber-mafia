import tonIcon from '../../assets/ton.svg';
import tonWalletImage from '../../assets/ton-wallet.png';
import buttonForCopyImage from '../../assets/button-for-copy.svg';
import buttonForShareImage from '../../assets/button-for-share.svg';
import shareIonIcon from '../../assets/share-ion.svg';

function Ton() {
  return (
    <div className="relative w-[100%] min-h-screen overflow-hidden pb-[200px]">
      <div className="relative w-[100%] mt-[4.66%]">
        <div className="flex gap-[5.128%] items-center justify-center">
          <div className="uppercase font-[600] text-[24px] leading-[28.8px] text-white">оплата в TON</div>
          <img src={tonIcon} alt="" className="w-[48px] h-[48px]" />
        </div>
        <div className="w-[89.74%] mx-auto font-[400] text-[14px] leading-[16.8px] text-[rgba(255,255,255,.5)] text-center mt-[4.66%]">Отправляйте на этот адрес только TON и токены в сети TON, иначе вы можете потерять свои средства</div>
        <img src={tonWalletImage} alt="" className="w-[75.43%] mx-auto mt-[4.66%]" />
      </div>
      <div className="fixed bottom-[18.33%] left-[5.13%] cursor-pointer w-[89.74%] max-w-[380px] flex items-center justify-around">
        <div className="relative w-[70.05%]">
          <img src={buttonForCopyImage} alt="" className="w-[100%]" />
          <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-center text-[#00D5FF] absolute w-[100%] h-[100%] inset-0 flex items-center justify-center">скопировать</div>
        </div>
        <div className="relative w-[23.45%]">
          <img src={buttonForShareImage} alt="" className="w-[100%]" />
          <div className="uppercase absolute w-[100%] h-[100%] inset-0 flex items-center justify-center">
            <img src={shareIonIcon} alt="" className="w-[24px] h-[24px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ton;