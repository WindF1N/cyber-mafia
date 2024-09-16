import loadingImage from '../assets/loading.png'

import vkIcon from '../assets/vk.svg'
import instIcon from '../assets/inst.svg'
import tgIcon from '../assets/tg.svg'

function Loading({loading, setLoadedImagesCount}) {
  return (
    <div className="relative flex flex-col overflow-hidden max-h-[866px] h-[100vh] bg-black">
      <img 
        className="absolute bottom-[5.33%] left-0 w-[100%] object-cover loading-image"
        src={loadingImage} 
        alt=""
        onLoad={() => loading && setLoadedImagesCount(prevState => prevState + 1)} 
        />
      <div className="beta absolute right-[5.13%] bottom-[39.6%] font-[600] text-[#D6D6D6] text-[14px] leading-[16.8px]">
        BETA VERSION
      </div>
      <div className="percents absolute bottom-[19.07%] font-[600] text-[#fff] text-[14px] leading-[16.8px] text-center w-[100%]"></div>
      <div className="bar absolute right-0 left-0 bottom-[15.73%] mx-auto bg-[rgba(87,87,87,0.3)] w-[89.74%] h-[15px]"
           style={{clipPath: 'polygon(0% 0%, 102% 0%, 98% 100%, 2% 100%, 0% 50%, 0% 25%)'}}>
        <div className="w-[70%] h-[100%] bg-[#F9114B] flex items-end justify-center gap-[3px] pl-[10px] overflow-hidden" style={{clipPath: 'polygon(0% 0%, 103% 0%, 97% 100%, 0% 100%, 0% 50%, 0% 25%)'}}>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
            <div className="w-[17px] h-[12px] bg-[#D00034] flex-shrink-0" style={{clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'}}></div>
        </div>
      </div>
      <div className="absolute bottom-[5.33%] w-[100%] flex items-center justify-center">
        <div className="h-[58px] w-[66px] bg-[#FFEA00] flex items-center justify-center cursor-pointer" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 24.14%, 92.42% 31.03%, 92.42% 67.24%, 100% 74.14%, 100% 100%, 25.76% 100%, 0% 75.9%)'}}>
            <img src={vkIcon} alt="" className="w-[24px]" onLoad={() => loading && setLoadedImagesCount(prevState => prevState + 1)} />
        </div>
        <div className="h-[58px] w-[66px] bg-[#FFEA00] flex items-center justify-center cursor-pointer" style={{clipPath: 'polygon(7.58% 0%, 100% 0%, 100% 24.14%, 92.42% 31.03%, 92.42% 67.24%, 100% 74.14%, 100% 100%, 7.58% 100%, 7.58% 74.14%, 0% 67.24%, 0% 31.03%, 7.58% 24.14%)'}}>
            <img src={instIcon} alt="" className="w-[24px]" onLoad={() => loading && setLoadedImagesCount(prevState => prevState + 1)} />
        </div>
        <div className="h-[58px] w-[66px] bg-[#FFEA00] flex items-center justify-center cursor-pointer" style={{clipPath: 'polygon(7.58% 0%, 100% 0%, 100% 74.14%, 74.24% 100%, 7.58% 100%, 7.58% 74.14%, 0% 67.24%, 0% 31.03%, 7.58% 24.14%)'}}>
            <img src={tgIcon} alt="" className="w-[24px]" onLoad={() => loading && setLoadedImagesCount(prevState => prevState + 1)} />
        </div>
      </div>
    </div>
  );
}

export default Loading;