import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import slide1Image from '../assets/slide1.png';
import slide2Image from '../assets/slide2.png';
import slide3Image from '../assets/slide3.png';
import bttnYellowImage from '../assets/bttn-bg-yellow.svg';
import bttnBlueImage from '../assets/bttn-bg-blue.svg';

const OnboardingSlider = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
        title: (
            <>
                <div className="absolute top-[4%] left-0 font-[600] text-[18px] leading-[21.6px] text-center text-white uppercase w-[100%]">Добро<br/>пожаловать!</div>
            </>
        ),
        description: (
            <div className="absolute left-[5.13%] top-[51.47%] flex flex-col items-center w-[89.74%] mx-auto">
                <div className="font-[400] text-[12px] leading-[15.6px] text-[rgba(255, 255, 255, 0.75)] px-[15px] py-[10px] bg-[rgba(87,87,87,.1)] backdrop-blur-[40px]" style={{clipPath: 'polygon(10.5px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 11.5px)'}}>
                    Вам предстоит погрузиться в захватывающий мир криминальных интриг, где ваши ум и стратегическое мышление станут вашими главными союзниками
                </div>
                <div className="mt-[4%] font-[400] text-[12px] leading-[15.6px] text-[rgba(255, 255, 255, 0.75)] px-[15px] py-[10px] bg-[rgba(87,87,87,.1)] backdrop-blur-[40px]" style={{clipPath: 'polygon(10.5px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 11.5px)'}}>
                    Готовы ли вы стать самым влиятельным мафиози? Начните свое приключение прямо сейчас!
                </div>
            </div>
        ),
        image: slide1Image,
    },
    {
        title: (
            <>
                <div className="absolute top-[5.13%] left-0 font-[600] text-[18px] leading-[21.6px] text-center text-white uppercase w-[100%]">Присоединяйтесь к<br/>кланам и завоевывайте<br/>районы!</div>
            </>
        ),
        description: (
            <div className="absolute left-[5.13%] top-[48.8%] flex flex-col items-center w-[89.74%] mx-auto">
                <div className="font-[400] text-[12px] leading-[15.6px] text-[rgba(255, 255, 255, 0.75)] px-[15px] py-[10px] bg-[rgba(87,87,87,.1)] backdrop-blur-[40px]" style={{clipPath: 'polygon(10.5px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 11.5px)'}}>
                    В Кибер Мафии вы можете создавать и присоединяться к кланам, чтобы захватывать районы и расширять свое влияние. Пригласите своих друзей, чтобы создать непобедимую команду
                </div>
                <div className="mt-[4%] font-[400] text-[12px] leading-[15.6px] text-[rgba(255, 255, 255, 0.75)] px-[15px] py-[10px] bg-[rgba(87,87,87,.1)] backdrop-blur-[40px]" style={{clipPath: 'polygon(10.5px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 11.5px)'}}>
                    За каждого приглашенного друга вы получаете ценные бонусы, которые помогут вам стать еще сильнее!
                </div>
            </div>
        ),
        image: slide2Image,
    },
    {
        title: (
            <>
                <div className="absolute top-[1%] left-0 font-[600] text-[18px] leading-[21.6px] text-center text-white uppercase w-[100%]">Поднимайтесь по<br/>рейтингам и вступайте в<br/>лиги!</div>
            </>
        ),
        description: (
            <div className="absolute left-[5.13%] top-[53.07%] flex flex-col items-center w-[89.74%] mx-auto">
                <div className="font-[400] text-[12px] leading-[15.6px] text-[rgba(255, 255, 255, 0.75)] px-[15px] py-[10px] bg-[rgba(87,87,87,.1)] backdrop-blur-[40px]" style={{clipPath: 'polygon(10.5px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 11.5px)'}}>
                    Каждое ваше действие в игре будет оцениваться, и вы сможете подняться по рейтинговой таблице, чтобы доказать свое превосходство
                </div>
                <div className="mt-[4%] font-[400] text-[12px] leading-[15.6px] text-[rgba(255, 255, 255, 0.75)] px-[15px] py-[10px] bg-[rgba(87,87,87,.1)] backdrop-blur-[40px]" style={{clipPath: 'polygon(10.5px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 11.5px)'}}>
                    Сражайтесь за место в лучших лигах и получайте эксклюзивные награды. Ваше имя должно быть на вершине!
                </div>
            </div>
        ),
        image: slide3Image,
    },
  ];

  const handleClick = (event) => {
    const buttonContainer = event.currentTarget;
    buttonContainer.classList.add('clicked');
    setTimeout(() => {
      buttonContainer.classList.remove('clicked');
    }, 200); // Длительность анимации
  };

  const handleDotClick = (event, index) => {
    handleClick(event);
    if (index < slides.length) {
        setCurrentSlide(index);
    } else {
        onComplete();
    }
  };

  const handleComplete = (event) => {
    handleClick(event);
    // localStorage.setItem('onboardingComplete', 'true');
    onComplete();
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    },
    onSwipedRight: () => {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (currentSlide < slides.length - 1) {
//         setCurrentSlide(currentSlide + 1);
//       }
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [currentSlide]);

  return (
    <div className="relative w-[100%] h-screen" {...handlers}>
      <div className="relative">
        <div className="relative flex transition-transform duration-300 ease-in-out h-screen" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={index} className="bg-black relative w-[100%] h-screen flex-shrink-0 px-[20px] overflow-hidden">
              <img src={slide.image} className="absolute left-0 top-0 w-screen" />
              {slide.title}
              {slide.description}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-[2.67%] left-[5.13%] w-[89.74%] flex ">
        <div className="button-container relative cursor-pointer w-[100%]" onClick={handleComplete}>
            <img src={bttnYellowImage} alt="" className="w-[100%]" />
            <div className="absolute top-0 left-0 flex items-center justify-center w-[100%] h-[100%] font-[600] text-[14px] leading-[16.8px] text-[rgba(255,234,0,1)]">
                ПРОПУСТИТЬ
            </div>
        </div>
        <div className="button-container relative cursor-pointer w-[100%] ml-[2.56%]" onClick={(e) => handleDotClick(e, currentSlide + 1)}>
            <img src={bttnBlueImage} alt="" className="w-[100%]" />
            <div className="absolute top-0 left-0 flex items-center justify-center w-[100%] h-[100%] font-[600] text-[14px] leading-[16.8px] text-[#00D5FF]">
                ДАЛЕЕ
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlider;