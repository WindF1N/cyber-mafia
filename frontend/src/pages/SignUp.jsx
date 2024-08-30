import { useNavigate } from 'react-router-dom';
import signUpImage from '../assets/signup-bg.png';
import warnFrameIcon from '../assets/warn-frame.svg';
import checkboxIcon from '../assets/checkbox.svg';
import checkboxActiveIcon from '../assets/checkbox-active.svg';
import inputBGIcon from '../assets/input-bg.svg';
import buttonIcon from '../assets/button.svg';

function SignUp() {
    const navigate = useNavigate();
    return (
        <div className="relative w-[100%] min-h-screen bg-black">
        <img src={signUpImage} 
            alt=""
            className="w-[100%]"
            />
        <div className="absolute w-[100%] h-[100%] inset-0 flex flex-col">
            <div className="uppercase text-white w-[100%] text-center font-[600] text-[18px] leading-[21.6px] mt-[7px]">Создайте свою<br/>легенду!</div>
            <div className="relative mt-[32px]">
                <img src={warnFrameIcon} alt="" className="w-[100%] px-[2.564%]" />
                <div className="absolute top-[33.39%] px-[7.69%] w-[100%] text-center text-[12px] leading-[15.6px] font-[400]">Перед тем как начать свой путь к вершине кибер мира, расскажите нам немного о себе. Эти данные помогут нам сделать вашу игру еще более увлекательной.</div>
            </div>
            <div className="px-[5.128%] mt-[5.33%]">
                <div className="uppercase font-[600] text-white text-[18px] leading-[21.6px] mb-[4%]">Выберите пол:</div>
                <div className="w-[100%] flex gap-[30px]">
                    <div className="flex items-center">
                        <img src={checkboxActiveIcon} alt="" />
                        <div className="uppercase text-white font-[600] text-[12px] leading-[14.4px] ml-[10.128%]">Мужской</div>
                    </div>
                    <div className="flex items-center">
                        <img src={checkboxIcon} alt="" />
                        <div className="uppercase text-white font-[600] text-[12px] leading-[14.4px] ml-[10.128%]">Женский</div>
                    </div>
                </div>
            </div>
            <div className="px-[5.128%] mt-[5.33%]">
                <div className="uppercase font-[600] text-white text-[18px] leading-[21.6px] mb-[4%]">Имя:</div>
                <div className="flex gap-[30px]">
                    <div className="w-[100%] relative">
                        <img src={inputBGIcon} alt="" className="backdrop-blur-[40px] w-[100%]" />
                        <div className="absolute inset-0 w-[100%] h-[100%]">
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Чтобы мы знали, как к вам обращаться</div>
                            <input type="text" className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[5.128%] mt-[5.33%]">
                <div className="uppercase font-[600] text-white text-[18px] leading-[21.6px] mb-[4%]">Телефон:</div>
                <div className="flex gap-[30px]">
                    <div className="w-[100%] relative">
                        <img src={inputBGIcon} alt="" className="backdrop-blur-[40px] w-[100%]" />
                        <div className="absolute inset-0 w-[100%] h-[100%]">
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Для связи с вами по вопросам безопасности и эксклюзивных предложений.</div>
                            <input type="text" className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[5.128%] mt-[5.33%]">
                <div className="uppercase font-[600] text-white text-[18px] leading-[21.6px] mb-[4%]">Город:</div>
                <div className="flex gap-[30px]">
                    <div className="w-[100%] relative">
                        <img src={inputBGIcon} alt="" className="backdrop-blur-[40px] w-[100%]" />
                        <div className="absolute inset-0 w-[100%] h-[100%]">
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Ваш родной город, чтобы вы чувствовали себя как дома</div>
                            <input type="text" className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[5.128%] mt-[5.33%]">
                <div className="uppercase font-[600] text-white text-[18px] leading-[21.6px] mb-[4%]">Район:</div>
                <div className="flex gap-[30px]">
                    <div className="w-[100%] relative">
                        <img src={inputBGIcon} alt="" className="backdrop-blur-[40px] w-[100%]" />
                        <div className="absolute inset-0 w-[100%] h-[100%]">
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Выберите район, который будете защищать и расширять</div>
                            <input type="text" className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[5.128%] mt-[5.33%]">
                <div className="uppercase font-[600] text-white text-[18px] leading-[21.6px] mb-[4%]">Никнейм:</div>
                <div className="flex gap-[30px]">
                    <div className="w-[100%] relative">
                        <img src={inputBGIcon} alt="" className="backdrop-blur-[40px] w-[100%]" />
                        <div className="absolute inset-0 w-[100%] h-[100%]">
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Как будут знать вас в мире Кибер Мафии?</div>
                            <input type="text" className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-[5.128%] w-[100%] mt-[8.33%] flex">
                <div className="w-[3.85%] h-[100%] bg-[#25E9FF]"></div>
                <div className="w-[100%] h-[100%] bg-[rgba(87,87,87,0.1)] backdrop-blur-[40px] p-[10px] font-[400] text-[12px] leading-[15.6px] text-center text-[rgba(255,255,255,0.75)]">
                    Вперед, к созданию своей кибер империи! <span className="text-[#00D5FF]">Ваша история начинается здесь и сейчас</span>
                </div>
                <div className="w-[3.85%] h-[100%] bg-[#25E9FF]"></div>
            </div>
            <div className="relative px-[5.128%] w-[100%] mt-[8.33%]" onClick={() => navigate("/")}>
                <img src={buttonIcon} alt="" className="w-[100%]" />
                <div className="absolute inset-0 w-[100%] h-[100%] flex items-center justify-center text-[#E40048] text-center text-[14px] leading-[16.8px] font-[600] uppercase">
                    Начать игру
                </div>
            </div>
        </div>
        </div>
    );
}

export default SignUp;