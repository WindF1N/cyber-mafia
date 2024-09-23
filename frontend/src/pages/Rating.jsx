import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsers from '../hooks/useUsers';
import useAuthStore from '../hooks/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';
import frameIcon from '../assets/frame.svg';
import starGrayIcon from '../assets/star-gray.svg';
import starGoldIcon from '../assets/star-gold.svg';
import searchIcon from '../assets/search.svg';
import filterIcon from '../assets/filter.svg';

function Rating() {
  const navigate = useNavigate();
  const { setUsers, setIsLoading, setOffset, setTotal, setSearch } = useUsers();
  const users = useUsers((state) => state.users);
  const isLoading = useUsers((state) => state.isLoading);
  const limit = useUsers((state) => state.limit);
  const offset = useUsers((state) => state.offset);
  const total = useUsers((state) => state.total);
  const search = useUsers((state) => state.search);
  const token = useAuthStore((state) => state.token);
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    var BackButton = window.Telegram.WebApp.BackButton;
    BackButton.hide();
  }, []);

  useEffect(() => {
    if (token && isLoading && (offset === 0 || total > users.length)) {
      fetch(`${apiUrl}/users/?limit=${limit}&offset=${offset}&search=${search}`, {
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

  useEffect(() => {
    if (!isLoading) {
      setOffset(0);
      setUsers([]);
      setIsLoading(true);
    }
  }, [search])

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

  return (
    <div className="relative w-[100%] min-h-screen overflow-hidden pb-[200px]">
      <div className="relative mt-[4.66%]">
        <div className="uppercase text-center font-[600] text-[18px] leading-[21.6px] text-white">Участники клуба</div>
      </div>
      <div className="relative w-[89.74%] mx-auto mt-[4.66%] bg-[#1B1F28] h-[62px] w-[100%] flex items-center p-[20px]" style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 17px 100%, 0% 47.5px)"}}>
        <div>
          <img src={searchIcon} alt="" className="w-[24px] h-[24px]" />
        </div>
        <div className="w-[100%]">
          <input type="text" name="search" value={search} onChange={(event) => setSearch(event.target.value)} onBlur={() => offset === 0 && setIsLoading(true)} className="relative w-[100%] p-0 px-[10px] m-0 h-[100%] bg-inherit text-center hover:outline-0 active:outline-0 z-2 outline-0 focus:outline-0" />
        </div>
        <div>
          <img src={filterIcon} alt="" className="w-[24px] h-[24px]" />
        </div>
      </div>
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

export default Rating;