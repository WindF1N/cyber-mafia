import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signUpImage from '../assets/signup-bg.png';
import warnFrameIcon from '../assets/warn-frame.svg';
import checkboxIcon from '../assets/checkbox.svg';
import checkboxActiveIcon from '../assets/checkbox-active.svg';
import inputBGIcon from '../assets/input-bg.svg';
import buttonIcon from '../assets/button.svg';
import useAuthStore from '../hooks/useAuthStore';
import useAccount from '../hooks/useAccount';

function SignUp() {
    const navigate = useNavigate();
    const [ sex, setSex ] = useState("male");
    const [ firstName, setFirstName ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ cities, setCities ] = useState([]);
    const [ selectedCity, setSelectedCity ] = useState(cities[0])
    const [ districts, setDistricts ] = useState(["Чертаново"]);
    const [ selectedDistrict, setSelectedDistrict ] = useState(districts[0])
    const [ nickname, setNickname ] = useState("");
    const token = useAuthStore((state) => state.token);
    const { setAccount } = useAccount();
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    useEffect(() => {
        if (token) {
          fetch(apiUrl+'/cities/', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
              }
          })
          .then(response => response.json())
          .then(data => {
            setCities(data.cities);
            setSelectedCity(data.cities[0]?.id || null)
          })
          .catch(error => console.error('Error:', error));
        }
    }, [token]);
    useEffect(() => {
        if (token && selectedCity) {
          fetch(apiUrl+'/districts/?city_id='+selectedCity, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
              }
          })
          .then(response => response.json())
          .then(data => {
            if ('error' in data) {} else {
                setDistricts(data.districts);
                setSelectedDistrict(data.districts[0]?.id || null)
            }
          })
          .catch(error => console.error('Error:', error));
        }
    }, [token, selectedCity]);
    const handleSubmit = (e) => {
        fetch(apiUrl+'/me/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ 
                sex: sex,
                first_name: firstName,
                phone: phone,
                nickname: nickname,
                city_id: selectedCity,
                district_id: selectedDistrict
            })
        })
        .then(response => response.json())
        .then(data => {
            if ('error' in data) {
                alert(data.error)
            } else {
                setAccount(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
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
                    <div className="cursor-pointer flex items-center" onClick={() => setSex("male")}>
                        {sex === "male" ? 
                            <img src={checkboxActiveIcon} alt="" />
                        : <img src={checkboxIcon} alt="" /> }
                        <div className="uppercase text-white font-[600] text-[12px] leading-[14.4px] ml-[10.128%]">Мужской</div>
                    </div>

                    <div className="cursor-pointer flex items-center" onClick={() => setSex("female")}>
                        {sex === "female" ? 
                            <img src={checkboxActiveIcon} alt="" />
                        : <img src={checkboxIcon} alt="" /> }
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
                            {firstName.length === 0 &&
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Чтобы мы знали, как к вам обращаться</div>}
                            <input type="text" name="first_name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 focus:outline-0 z-2" />
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
                            {phone.length === 0 &&
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Для связи с вами по вопросам безопасности и эксклюзивных предложений.</div>}
                            <input type="text" name="phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 focus:outline-0 z-2" />
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
                            <select name="city" onChange={(event) => setSelectedCity(event.target.value)} className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] text-center hover:outline-0 active:outline-0 focus:outline-0 z-2 bg-inherit">
                                {cities.map((city) => (
                                    <option key={"city_" + city.id} value={city.id} className="bg-black" selected={city.id === selectedCity}>{city.name}</option>
                                ))}
                            </select>
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
                            <select name="district" onChange={(event) => setSelectedDistrict(event.target.value)} className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] text-center hover:outline-0 active:outline-0 focus:outline-0 z-2 bg-inherit">
                                {districts.map((district) => (
                                    <option key={"district_" + district.id} value={district.id} className="bg-black" selected={district.id === selectedDistrict}>{district.name}</option>
                                ))}
                            </select>
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
                            {nickname.length === 0 &&
                            <div className="absolute inset-0 w-[100%] h-[100%] text-center text-[rgba(255,255,255,0.3)] text-[10px] leading-[13px] font-[400] flex items-center justify-center">Как будут знать вас в мире Кибер Мафии?</div>}
                            <input type="text" name="nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 focus:outline-0 z-2" />
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
            <div className="cursor-pointer relative px-[5.128%] w-[100%] mt-[8.33%]" onClick={handleSubmit}>
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