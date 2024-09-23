import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import usePosters from '../hooks/usePosters';
import useCities from '../hooks/useCities';
import useAuthStore from '../hooks/useAuthStore';
import useMessages from '../hooks/useMessages';
import LoadingSpinner from '../components/LoadingSpinner';
import frameIcon from '../assets/frame.svg';
import starGrayIcon from '../assets/star-gray.svg';
import starGoldIcon from '../assets/star-gold.svg';
import chevronIcon from '../assets/chevron.svg';
import image from '../assets/image.jpg';
import calendarIcon from '../assets/calendar.svg';
import timeIcon from '../assets/time.svg';
import locationIcon from '../assets/location.svg';
import buttonBlueIcon from '../assets/button-blue.svg';

function Rules() {
  const navigate = useNavigate();
  const citiesRef = useRef();
  const { setPosters, setIsLoading, setOffset, setTotal, setCity } = usePosters();
  const posters = usePosters((state) => state.posters);
  const isLoading = usePosters((state) => state.isLoading);
  const limit = usePosters((state) => state.limit);
  const offset = usePosters((state) => state.offset);
  const total = usePosters((state) => state.total);
  const city = usePosters((state) => state.city);
  const token = useAuthStore((state) => state.token);
  const cities = useCities((state) => state.cities);
  const { setCities } = useCities();
  const { addMessage } = useMessages();
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.hide();
  }, []);

  useEffect(() => {
    if (city && token && isLoading && (offset === 0 || total > posters.length)) {
      fetch(`${apiUrl}/posters/?limit=${limit}&offset=${offset}&city_id=${city.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        setPosters([...posters, ...data.posters]);
        setIsLoading(false);
        setOffset(offset + limit);
        setTotal(data.total);
      })
      .catch(error => console.error('Error:', error));
    } else if (token && isLoading && !(offset === 0 || total > posters.length)) {
      setIsLoading(false);
    } else if (cities.length === 0 && token && isLoading && !city) {
      fetch(`${apiUrl}/cities/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        setCities(data.cities);
        if (data.cities?.length > 0) {
            setCity(data.cities[0]);
        };
      })
      .catch(error => console.error('Error:', error));
    }
  }, [cities, city, token, isLoading]);

  const handleScroll = () => {
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
      setIsLoading(true);
    }
  };

  const handleChange = (e) => {
    setCity(cities.filter((city) => city.id === Number(e.target.value))[0]);
    setOffset(0);
    setTotal(0);
    setPosters([]);
    setIsLoading(true);
  }

  useEffect(() => {
    const container = window;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const getFormattedDate = (dateString, time = false) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth(); // Получаем месяц в виде числа (0-11)
    const year = date.getFullYear();

    // Массив с названиями месяцев
    const monthNames = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    if (!time) {
        // Форматируем дату
        return `${day} ${monthNames[month]} ${year}`;
    } else {
        // Получаем часы и минуты
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        // Форматируем дату и время
        return `${hours}:${minutes}`;
    }
  };

  const handleClick = (posterId) => {
    fetch(`${apiUrl}/posters/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ 
            poster_id: posterId,
        })
      })
      .then(response => response.json())
      .then(data => {
        setPosters([...posters.filter(poster => poster.id !== posterId), {...posters.filter(poster => poster.id === posterId)[0], is_booking: data.is_booking}]);
        addMessage({
            type: 'success',
            text: data.is_booking ? 'Вы зарегистрированы на игру' : 'Ваша бронь на игру снята',
            name: 'Успех:'
          })
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <div className="relative w-[100%] min-h-screen overflow-hidden pb-[200px]">
      <div className="relative mt-[4.66%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Афиши</div>
      </div>
      <div className="relative cursor-pointer w-[89.74%] mx-auto mt-[4.66%] bg-[#1B1F28] h-[62px] w-[100%] flex items-center justify-center px-[20px]" 
           style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 17px 100%, 0% 47.5px)"}}>
        <select className="cursor-pointer h-[100%] w-[100%] uppercase text-[#6F6F6F] font-[600] text-[16px] leading-[19.2px] text-center bg-inherit focus:outline-0 active:outline-0" id="selectCities" name="selectCities" onChange={handleChange}>
            {cities.map((city) => (
                <option value={city.id} key={city.id}>{city.name}</option>
            ))}
        </select>
      </div>
      <div className="relative mt-[4.66%] w-[89.74%] mx-auto">
        {posters.map((poster) => (
            <div className="pb-[30px]" key={poster.id}>
                <div className="relative bg-[#1B1F28] p-[10px] mb-[10px]" style={{clipPath: "polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)"}}>
                    <div className="w-[100%] h-[180px]" style={{clipPath: "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)"}}>
                        <img src={apiUrl+poster.image} alt="" className="w-[100%] h-[100%] object-cover" />
                    </div>
                    <div className="uppercase text-center font-[600] text-[16px] leading-[19.2px] text-[#00D5FF] pt-[10px] pb-[5px]">
                        вечер мафии
                    </div>
                    <div className="flex flex-wrap justify-center mt-[10px] gap-x-[20px] gap-y-[10px]">
                        <div className="flex items-center gap-[10px] uppercase font-[600] text-[12px] leading-[14.4px] text-[#EFEFEF] whitespace-nowrap">
                            <img src={calendarIcon} alt="" className="w-[24px] h-[24px]" />
                            {getFormattedDate(poster.datetime)}
                        </div>
                        <div className="flex items-center gap-[10px] uppercase font-[600] text-[12px] leading-[14.4px] text-[#EFEFEF] whitespace-nowrap">
                            <img src={timeIcon} alt="" className="w-[24px] h-[24px]" />
                            {getFormattedDate(poster.datetime, true)}
                        </div>
                        <div className="flex gap-[10px] uppercase font-[600] text-[10px] leading-[12px] text-[#EFEFEF]">
                            <img src={locationIcon} alt="" className="w-[24px] h-[24px]" />
                            <span className="mt-[5px]">
                                {poster.small_address}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative px-[4px] cursor-pointer w-[100%]" onClick={() => handleClick(poster.id)}>
                    <img src={buttonBlueIcon} alt="" className="w-[100%]" />
                    <div className="absolute inset-0 w-[100%] h-[100%] flex items-center justify-center uppercase font-[600] text-[#00D5FF] text-[14px] leading-[16.8px]">
                        {!poster.is_booking ? "Записаться" : "Убрать бронь" }
                    </div>
                </div>
            </div>
        ))}
      </div>
      {isLoading &&
      <div className="w-[100%] flex justify-center items-center h-[100px] scale-[0.7]">
        <LoadingSpinner />
      </div>}
    </div>
  );
}

export default Rules;