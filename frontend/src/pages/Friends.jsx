import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import frameIcon from '../assets/frame.svg';
import starGrayIcon from '../assets/star-gray.svg';
import starGoldIcon from '../assets/star-gold.svg';
import copyWhiteIcon from '../assets/copy-white.svg';
import buttonForReflinkImage from '../assets/button-for-reflink.svg';
import ratingImage from '../assets/image.png';
import useFriends from '../hooks/useFriends';
import useAuthStore from '../hooks/useAuthStore';
import useMessages from '../hooks/useMessages';
import useAccount from '../hooks/useAccount';
import LoadingSpinner from '../components/LoadingSpinner';

function Friends() {
  const navigate = useNavigate();
  const { setUsers, setIsLoading, setOffset, setTotal } = useFriends();
  const users = useFriends((state) => state.users);
  const isLoading = useFriends((state) => state.isLoading);
  const limit = useFriends((state) => state.limit);
  const offset = useFriends((state) => state.offset);
  const total = useFriends((state) => state.total);
  const token = useAuthStore((state) => state.token);
  const account = useAccount((state) => state.account);
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.hide();
  }, [])
  useEffect(() => {
    if (token && isLoading && (offset === 0 || total > users.length)) {
      fetch(`${apiUrl}/friends/?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => {
        setUsers([...users, ...data.users]);
        setIsLoading(false);
        setOffset(offset + limit);
        setTotal(data.total);
      })
      .catch(error => console.error('Error:', error));
    } else if (token && isLoading && !(offset === 0 || total > users.length)) {
      setIsLoading(false);
    }
  }, [token, isLoading]);
  const handleScroll = () => {
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    const container = window;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const { addMessage } = useMessages();
  const handleCopyClick = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log("Текст скопирован в буфер обмена");
      addMessage({
        type: 'success',
        text: '',
        name: 'Скопировано'
      })
    }).catch((err) => {
      console.error("Не удалось скопировать текст: ", err);
    });
  };
  return (
    <div className="relative w-[100%] min-h-screen overflow-hidden pb-[200px]">
      <div className="relative w-[100%] mt-[4.66%]">
        <div className="w-[28.72%] h-[63.67%] bg-[#00D5FF] rounded-[100%] absolute left-0 right-0 top-[12.11%] blur-[100px] mx-auto z-[-1]"></div>
        <img src={ratingImage} alt="" className="w-[100%]" />
        <div className="uppercase font-[600] text-[18px] leading-[21.6px] text-center text-white absolute left-0 right-0 mx-auto bottom-[22.49%]">Приглашай друзей,<br/>зарабатывай баллы</div>
        <div className="font-[400] text-[12px] leading-[15.6px] text-center text-white absolute left-0 right-0 mx-auto bottom-[7.96%]">Получайте по <span className="text-[#FFEA00]">50 баллов</span> за<br/>каждого друга!</div>
      </div>
      <div className="relative w-[89.74%] mt-[4.66%] mx-[5.13%]" onClick={() => handleCopyClick("https://t.me/cyber_mafia_dev_bot/dev?startapp="+account?.user?.referral_code)}>
        <img src={buttonForReflinkImage} alt="" className="w-[100%]" />
        <div className="cursor-pointer absolute inset-0 m-auto flex items-center justify-center gap-[2.564%]">
          <div className="uppercase font-[600] text-[12px] leading-[14.4px] text-center">ваша реферальная ссылка</div>
          <div>
            <img src={copyWhiteIcon} alt="" className="w-[20px] h-[20px]" />
          </div>
        </div>
      </div>
      {users.length > 0 &&
      <div className="relative w-[89.74%] mt-[4.66%] mx-[5.13%] flex items-center justify-center">
        <div className="relative cursor-pointer">
          <div className="uppercase font-[600] text-[18px] leading-[21.6px] text-white text-center">Мои друзья</div>
        </div>
      </div>}
      <div className="relative mt-[4.66%]">
        {users.map((user) => (
          <div className="relative cursor-pointer flex items-center justify-center w-[100%] h-[70px] mt-[2.66%] px-[5.128%]" key={user.id} onClick={() => navigate("/profile/"+user.id)}>
            <div className="relative w-[18.35%] min-w-[71.58px] h-[100%] flex-shrink-0 bg-white" style={{clipPath: 'polygon(0% 0%, 93.6% 0%, 93.6% 21.43%, 100% 27.14%, 100% 58.57%, 93.6% 63.43%, 93.6% 100%, 24.03% 100%, 0% 78.57%)'}}>
              {user?.avatar ? 
                <img className="w-[100%] h-[100%] object-cover" src={apiUrl+user?.avatar} alt='' />
              :
                <div className="w-[100%] h-[100%] bg-[#1B1F28] flex items-center justify-center font-[700] text-[28px] uppercase">{!user.nickname ? user.first_name.slice(0, 1) : user.nickname.slice(0, 1)}</div>
              }
              <img className="w-[89.41%] absolute inset-0 left-[4.19%]" src={frameIcon} />
            </div>
            <div className="relative w-[100%] h-[100%] bg-[#1B1F28] py-[10px] px-[3.91%]" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 79.71%, 93.53% 100%, 0% 100%, 0% 63.43%, 1.799% 58.57%, 1.799% 27.14%, 0% 21.43%)'}}>
              <div className="uppercase font-[600] text-[14px] leading-[16.8px] text-[#fff]">{!user.nickname ? user.first_name : user.nickname}</div>
              <div className="uppercase font-[400] text-[10px] leading-[12px] text-[#25E9FF] mt-[5px]">{user.level}</div>
              <div className="uppercase font-[400] text-[10px] leading-[12px] text-[rgba(255,255,255,0.5)] mt-[5px]">В игре с {getFormattedDate(user.date_joined)}</div>
              <img src={starGoldIcon} alt="" className="w-[24px] h-[24px] absolute right-[10px] top-[10px] cursor-pointer" />
              <div className="absolute right-[15.42%] top-0 bottom-0 h-[100%] min-w-[50px] flex flex-col justify-between">
                <div className="w-[100%] h-[10px] bg-gradient-to-b from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
                <div className="font-[700] text-[14px] leading-[16.8px] text-center text-white">{user.points}</div>
                <div className="w-[100%] h-[10px] bg-gradient-to-t from-[#FFEA00] from-[0%] to-[rgba(153,140,0,0)] to-[100%]"></div>
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

export default Friends;