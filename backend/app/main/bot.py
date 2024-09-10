import os
import django
import sys
sys.path.append('/home/creatxr/cyber-mafia/backend/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton
from aiogram.dispatcher.middlewares import BaseMiddleware
from aiogram.utils.exceptions import InvalidQueryID
import re

from main.models import CustomUser, City, Game, Participant, Peculiarity
from django.conf import settings
from django.db import close_old_connections, connections
from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from main.utils import update_messages
import io

API_TOKEN = '7485718014:AAHGbSQCgY7bM1FTLw8SUw-9NWTK7o3CJMo'

# Инициализация бота и диспетчера
bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

# Состояния для машины состояний
class Form(StatesGroup):
    choosing_city = State()
    entering_name = State()
    entering_phone = State()
    uploading_avatar = State()
    editing_profile = State()
    editing_name = State()
    editing_game_name = State()
    editing_city = State()
    editing_phone = State()
    editing_avatar = State()
    afisha_editing_city = State()

@dp.callback_query_handler(lambda c: c.data == 'go_main')
async def return_to_main_menu(callback_query: types.CallbackQuery, state: FSMContext):
    await state.finish()
    msg = await bot.send_message(callback_query.message.chat.id, "Хорошо, возвращаемся в главное меню", reply_markup=types.ReplyKeyboardRemove())\
    # Обновляем сообщения
    await update_messages(bot, callback_query.message.chat.id, [msg.message_id])

@dp.callback_query_handler(lambda c: c.data == 'go_poster')
async def return_to_main_menu(callback_query: types.CallbackQuery, state: FSMContext):
    await send_afisha(callback_query.message)

# Обработчик команды /home
@dp.message_handler(commands=['webapp'])
async def return_to_home(message: types.Message, state: FSMContext):
    await state.finish()
    markup = InlineKeyboardMarkup(row_width=1)
    markup.insert(InlineKeyboardButton("Запустить приложение", url=f'https://t.me/cyber_mafia_dev_bot/dev'))
    msg = await bot.send_message(message.chat.id, "Добро пожаловать в приложение", reply_markup=markup)
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик команды /home
@dp.message_handler(commands=['home'])
async def return_to_home(message: types.Message, state: FSMContext):
    await state.finish()
    msg = await bot.send_message(message.chat.id, "Хорошо, возвращаемся в главное меню")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик команды /start
@dp.message_handler(commands=['start'], state='*')
async def send_welcome(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    
    # Закрытие старых соединений
    await sync_to_async(close_old_connections)()
    
    try:
        user, created = await sync_to_async(CustomUser.objects.get_or_create)(username=str(user_id))
    except Exception as e:
        # Обработка ошибки соединения
        await bot.send_message(message.chat.id, "Произошла ошибка соединения. Повторное подключение...")
        await sync_to_async(connections['default'].connect)()
        user, created = await sync_to_async(CustomUser.objects.get_or_create)(username=str(user_id))
    
    if created or not user.is_registered:
        await Form.choosing_city.set()
        markup = InlineKeyboardMarkup(row_width=2)
        cities = await sync_to_async(City.objects.all)()
        cities = await sync_to_async(list)(cities)
        for city in cities:
            markup.insert(InlineKeyboardButton(city.name, callback_data=f'city_{city.id}'))
        msg = await bot.send_message(message.chat.id, """
🌆Главный город нашего клана !
                               
🖥️ <b>Хотите открыть Cyber Mafia в своем городе?</b>
                               
У нас есть отличная возможность для тебя! Оформи франшизу и стань частью нашего кибер-клана. Узнай больше на нашем сайте:
                               
cyberpunkmafia.ru
                               
🔗 Жми на ссылку и узнай, как открыть Cyber Mafia в твоем городе! 🚀
""", reply_markup=markup, parse_mode="HTML")
    else:
        msg = await bot.send_message(message.chat.id, "Привет! Добро пожаловать обратно!")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик выбора города
@dp.callback_query_handler(lambda c: c.data.startswith('city_'), state=Form.choosing_city)
async def process_city(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    city_id = int(callback_query.data.split('_')[1])
    city = await sync_to_async(City.objects.get)(id=city_id)
    msg1 = await bot.edit_message_text(chat_id=callback_query.message.chat.id, message_id=callback_query.message.message_id, text=f"{city.name}, отличный выбор! 🎉")
    msg2 = await bot.send_message(callback_query.from_user.id, """
Теперь ты в шаге от того, чтобы стать частью увлекательной игры Cyber Mafia! 🤖

🖋️ <b>Следующий шаг:</b> введи свое имя, чтобы мы познакомились. Пора погрузиться в мир киберпанка и почувствовать адреналин настоящей мафии будущего! ⚡
                           
✍️ Напиши свое имя в ответном сообщении, и мы подготовим всё для твоего участия.
""", parse_mode="HTML")
    await Form.entering_name.set()
    async with state.proxy() as data:
        data['city_id'] = city_id
        data['main_city_id'] = city_id
        data['user_id'] = callback_query.from_user.id
    # Обновляем сообщения
    await update_messages(bot, callback_query.message.chat.id, [msg1.message_id, msg2.message_id])

# Обработчик ввода имени
@dp.message_handler(state=Form.entering_name)
async def process_name(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['name'] = message.text
    await Form.entering_phone.set()
    markup = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    markup.add(KeyboardButton("Отправить номер📱", request_contact=True))
    msg = await bot.send_message(message.chat.id, """
🔍 <b>Почти готово!</b>
                           
Теперь нам нужен твой номер телефона, чтобы завершить регистрацию и держать тебя в курсе всех обновлений! 📲
                           
📞 <b>Следующий шаг:</b> отправь свой номер телефона или нажми на кнопку ниже, чтобы поделиться контактом.
                           
👉 Нажми на кнопку "Отправить номер" или просто введи его в чат.                           
""", reply_markup=markup, parse_mode="HTML")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик ввода номера телефона
@dp.message_handler(content_types=['contact', 'text'], state=Form.entering_phone)
async def process_phone(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        if message.contact:
            data['phone'] = message.contact.phone_number
        else:
            phone_pattern = re.compile(r'^\+?\d{10,15}$')
            if not phone_pattern.match(message.text):
                msg = await bot.send_message(message.chat.id, "Неверный формат. Пожалуйста, введите номер телефона.")
                # Обновляем сообщения
                await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])
                return
            data['phone'] = message.text
    await Form.uploading_avatar.set()
    markup = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    markup.add(KeyboardButton("Позже"))
    msg = await bot.send_message(message.chat.id, """
🖼️ <b>Отлично! Теперь выбери аватар!</b>
                           
Для полной регистрации и чтобы другие игроки могли узнать тебя, выбери свой аватар. Это будет твоё лицо в мире Cyber Mafia! 😎
                           
📸 <b>Следующий шаг:</b> отправь фото или выбери из галереи, чтобы установить свой аватар.
""", reply_markup=markup, parse_mode="HTML")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик загрузки аватара
@dp.message_handler(content_types=['photo', 'text'], state=Form.uploading_avatar)
async def process_avatar(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        if message.photo:
            data['avatar'] = message.photo[-1].file_id
            
            # Скачиваем аватар и сохраняем его в файловую систему
            file_info = await bot.get_file(data['avatar'])
            file_path = file_info.file_path
            downloaded_file = await bot.download_file(file_path)
            
            # Сохраняем файл в директорию media/avatars/
            with open(f"media/avatars/{data['avatar']}.jpg", 'wb') as new_file:
                new_file.write(downloaded_file.getvalue())
            
            # Сохраняем путь к файлу в базе данных
            user_id = data['user_id']
            city_id = data['city_id']
            main_city_id = data['main_city_id']
            user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
            user.avatar = f"avatars/{data['avatar']}.jpg"
            user.city = await sync_to_async(City.objects.get)(id=city_id)
            user.main_city = await sync_to_async(City.objects.get)(id=main_city_id)
            user.phone = data['phone']
            user.first_name = data['name']
            user.is_registered = True
            await sync_to_async(user.save)()
            msg = "✅ Аватар загружен, регистрация завершена!"
        else:
            data['avatar'] = None
            user_id = data['user_id']
            city_id = data['city_id']
            main_city_id = data['main_city_id']
            user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
            user.avatar = None
            user.city = await sync_to_async(City.objects.get)(id=city_id)
            user.main_city = await sync_to_async(City.objects.get)(id=main_city_id)
            user.phone = data['phone']
            user.first_name = data['name']
            user.is_registered = True
            await sync_to_async(user.save)()
            msg = "✅ Регистрация завершена!"
    await state.finish()
    msg1 = await bot.send_message(message.chat.id, "Отлично!")
    msg2 = await bot.send_message(message.chat.id, f"""
<b>{msg}</b>

Добро пожаловать в мир Cyber Mafia! 🎉 Ты успешно завершил регистрацию и готов к игре в стиле киберпанка. Теперь ты можешь выбрать, что делать дальше:

🌐 <b>Перейти в веб-приложение</b> — для более удобного доступа ко всем возможностям игры и персонализации твоего профиля.

/webapp - открыть веб-приложение

или

🤖 <b>Оставаться в боте</b> — смотреть афиши предстоящих игр, регистрироваться на новые события и быть в курсе всех новостей прямо здесь!

/poster - посмотреть афишу игр

🎮 <b>Выбор за тобой! Готовься к игре и будь начеку — мир Cyber Mafia полон неожиданных поворотов и вызовов!</b>
""", reply_markup=types.ReplyKeyboardRemove(), parse_mode="HTML")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg1.message_id, msg2.message_id])

# Обработчик команды /profile
@dp.message_handler(commands=['profile'], state='*')
async def show_profile(message: types.Message):
    user_id = message.from_user.id
    user_queryset = await sync_to_async(CustomUser.objects.filter)(username=str(user_id))
    user = await sync_to_async(lambda: user_queryset.first())()
    
    if user:
        city = await sync_to_async(getattr)(user, 'city')
        district = await sync_to_async(getattr)(user, 'district')
        level = await sync_to_async(getattr)(user, 'level')

        # Отправка аватара, если он есть
        if user.avatar:
            with open(user.avatar.path, 'rb') as photo:
                msg = await bot.send_photo(message.from_user.id, photo)

        # Второе сообщение с информацией о профиле
        profile_info = f"""
🧑‍💻 <b>Твой профиль в Cyber Mafia</b>

Здесь ты можешь управлять своим профилем и настроить всё так, как тебе удобно! 🔧
    Аватар: {f'[выше] 🖼️' if user.avatar else ''}
    Пол: {user.sex or ''}
    Имя: {f'{user.first_name} 🏷️' or ''}
    Телефон: {f'{user.phone} 📞' or ''}
    Город: {f'{city} 🌆' or ''}
    Район: {district or ''}
    Никнейм: {user.nickname or ''}
    Уровень игрока: {level or ''}

👉 Выбери нужный пункт, чтобы изменить информацию в профиле.
"""
        inline_markup = InlineKeyboardMarkup(row_width=1)
        inline_markup.add(
            InlineKeyboardButton("Изменить имя ✏️", callback_data='edit_name'),
            InlineKeyboardButton("Изменить Никнейм", callback_data='edit_game_name'),
            InlineKeyboardButton("Изменить город 🏙️", callback_data='edit_city'),
            InlineKeyboardButton("Обновить номер телефона📱", callback_data='edit_phone'),
            InlineKeyboardButton("Загрузить новый аватар 📷", callback_data='edit_avatar')
        )
        msg1 = await bot.send_message(message.from_user.id, profile_info, parse_mode='HTML', reply_markup=inline_markup)

        inline_markup = InlineKeyboardMarkup(row_width=1)
        inline_markup.add(InlineKeyboardButton("Главное меню 🔙", callback_data='go_main'))
        msg2 = await bot.send_message(message.from_user.id, "<b>🔙 Вернуться в главное меню</b>", reply_markup=inline_markup, parse_mode='HTML')
        # Обновляем сообщения
        await update_messages(bot, message.chat.id, [message.message_id, msg.message_id, msg1.message_id, msg2.message_id])
    else:
        msg = await bot.send_message(message.from_user.id, "Профиль не найден. Пожалуйста, зарегистрируйтесь /start.")
        # Обновляем сообщения
        await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик инлайн кнопок
@dp.callback_query_handler(lambda c: c.data in ['edit_profile', 'profile_ok', 'edit_name', 'edit_game_name', 'edit_city', 'edit_phone', 'edit_avatar', 'afisha_edit_city'])
async def process_callback_profile(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    async with dp.current_state(chat=callback_query.message.chat.id, user=callback_query.from_user.id).proxy() as data:
        if callback_query.data == 'edit_name':
            await Form.editing_name.set()
            msg = await bot.send_message(callback_query.message.chat.id, "Введите новое имя:")
        elif callback_query.data == 'edit_game_name':
            await Form.editing_game_name.set()
            msg = await bot.send_message(callback_query.message.chat.id, "Введите новый игровой ник:")
        elif callback_query.data == 'edit_city':
            await Form.editing_city.set()
            markup = InlineKeyboardMarkup(row_width=2)
            cities = await sync_to_async(City.objects.all)()
            cities = await sync_to_async(list)(cities)
            for city in cities:
                markup.insert(InlineKeyboardButton(city.name, callback_data=f'city_{city.id}'))
            msg = await bot.send_message(callback_query.message.chat.id, "Выберите новый город:", reply_markup=markup)
        elif callback_query.data == 'edit_phone':
            await Form.editing_phone.set()
            msg = await bot.send_message(callback_query.message.chat.id, "Введите новый номер телефона:")
        elif callback_query.data == 'edit_avatar':
            await Form.editing_avatar.set()
            msg = await bot.send_message(callback_query.message.chat.id, "Отправьте новый аватар:")
        elif callback_query.data == 'afisha_edit_city':
            await Form.afisha_editing_city.set()
            markup = InlineKeyboardMarkup(row_width=2)
            cities = await sync_to_async(City.objects.all)()
            cities = await sync_to_async(list)(cities)
            for city in cities:
                markup.insert(InlineKeyboardButton(city.name, callback_data=f'city_{city.id}'))
            msg = await bot.send_message(callback_query.message.chat.id, "Выберите город для просмотра афиши", reply_markup=markup)
        await update_messages(bot, callback_query.message.chat.id, [msg.message_id])

# Обработчики для изменения данных в профиле
@dp.message_handler(state=Form.editing_name)
async def process_edit_name(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.first_name = message.text
    await sync_to_async(user.save)()
    await state.finish()
    await update_messages(bot, message.chat.id, [message.message_id])
    await show_profile(message)

@dp.message_handler(state=Form.editing_game_name)
async def process_edit_game_name(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.nickname = message.text
    await sync_to_async(user.save)()
    await state.finish()
    await update_messages(bot, message.chat.id, [message.message_id])
    await show_profile(message)

@dp.callback_query_handler(lambda c: c.data.startswith('city_'), state=Form.editing_city)
async def process_edit_city(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    city_id = int(callback_query.data.split('_')[1])
    city = await sync_to_async(City.objects.get)(id=city_id)
    user_id = callback_query.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.city = city
    await sync_to_async(user.save)()
    await state.finish()
    await update_messages(bot, callback_query.message.chat.id, [callback_query.message.message_id])
    await show_profile(callback_query)

@dp.callback_query_handler(lambda c: c.data.startswith('city_'), state=Form.afisha_editing_city)
async def process_afisha_edit_city(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    city_id = int(callback_query.data.split('_')[1])
    city = await sync_to_async(City.objects.get)(id=city_id)
    await state.finish()
    await update_messages(bot, callback_query.message.chat.id, [callback_query.message.message_id])
    await send_afisha(callback_query.message, city=city)

# Обработчик для изменения номера телефона в профиле
@dp.message_handler(state=Form.editing_phone)
async def process_edit_phone(message: types.Message, state: FSMContext):
    phone_pattern = re.compile(r'^\+?\d{10,15}$')
    if not phone_pattern.match(message.text):
        msg = await bot.send_message(message.chat.id, "Неверный формат номера телефона. Пожалуйста, введите номер в формате +1234567890 или 1234567890.")
        await update_messages(bot, message.chat.id, [msg.message_id])
        return
    
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.phone = message.text
    await sync_to_async(user.save)()
    await state.finish()
    await update_messages(bot, message.chat.id, [message.message_id])
    await show_profile(message)

@dp.message_handler(content_types=['photo'], state=Form.editing_avatar)
async def process_edit_avatar(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    # Скачиваем аватар и сохраняем его в файловую систему
    file_info = await bot.get_file(message.photo[-1].file_id)
    file_path = file_info.file_path
    downloaded_file = await bot.download_file(file_path)
    
    # Сохраняем файл в директорию media/avatars/
    with open(f"media/avatars/{message.photo[-1].file_id}.jpg", 'wb') as new_file:
        new_file.write(downloaded_file.getvalue())
    
    # Сохраняем путь к файлу в базе данных
    user.avatar = f"avatars/{message.photo[-1].file_id}.jpg"
    await sync_to_async(user.save)()
    await state.finish()
    await update_messages(bot, message.chat.id, [message.message_id])
    await show_profile(message)

# Обработчик команды /poster
@dp.message_handler(commands=['poster'])
async def send_afisha(message: types.Message, city=None):
    user_id = message.chat.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    # Получение мероприятий в текущем городе пользователя
    if city is None:
        city = await sync_to_async(getattr)(user, 'city')
    else:
        await bot.delete_message(message.chat.id, message.message_id)
    games = await sync_to_async(Game.objects.filter)(city=city)
    games = await sync_to_async(list)(games)
    if len(games) == 0:
        msg = await bot.send_message(message.chat.id, f"К сожалению, на данный момент доступных игр нет.\nПопробуй позже")
        # Обновляем сообщения
        await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])
        return
    games_str = "\n\n"
    for game in games:
        games_str += f"Дата: {game.datetime.strftime('%d %B %Y')} | Время: {game.datetime.strftime('%H:%M')} | Место: {game.small_address}\n"
    game_buttons = [types.InlineKeyboardButton(f'Регистрация "{game.small_address} {game.datetime.date()}"', callback_data=f'game_{game.id}') for game in games]
    # Отправка трех локальных фотографий разом
    photo_paths = [
        os.path.join(settings.BASE_DIR, 'path_to_photo1.png'),
    ]
    media = [types.InputMediaPhoto(open(photo_path, 'rb')) for photo_path in photo_paths]
    msg1 = await bot.send_media_group(message.chat.id, media)
    # Сообщение с информацией о пользователе
    afisha_message = f"""
🎬 <b>Афиша игр Cyber Mafia</b>

Здесь ты можешь увидеть все предстоящие игры и мероприятия в {city.name_in_prepositional_case}! 📅 Выбери удобную дату и время, чтобы присоединиться к игре и испытать свои навыки в киберпанковом мире⚡

📍 Выбери игру:{games_str}
👉 Нажми на нужную игру, чтобы зарегистрироваться!
"""
    # Сообщение с кнопками
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(*game_buttons)
    msg2 = await bot.send_message(message.chat.id, afisha_message, parse_mode="HTML", reply_markup=markup)
    msg3 = await bot.send_message(message.chat.id, "✨ Следи за афишей, чтобы не пропустить новые игры и мероприятия!")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, *[msg.message_id for msg in msg1], msg2.message_id, msg3.message_id])

# Обработчик клика на мероприятие
@dp.callback_query_handler(lambda c: c.data.startswith('game_'))
async def show_game(callback_query: types.CallbackQuery):
    game_id = int(callback_query.data.split('_')[1])
    game = await sync_to_async(Game.objects.get)(id=game_id)

    # Проверка наличия записи Participant для текущего пользователя
    user = await sync_to_async(CustomUser.objects.get)(username=callback_query.message.chat.id)
    participant = await sync_to_async(Participant.objects.filter)(user=user, game=game)
    participant = await sync_to_async(lambda qs: qs.first())(participant)

    peculiarities = await sync_to_async(Peculiarity.objects.filter)(game=game)
    peculiarities = await sync_to_async(list)(peculiarities)

    peculiarities_str = ""
    for peculiarity in peculiarities:
        peculiarities_str += f"{peculiarity.label}: {peculiarity.value}\n"

    # Создание сообщения с информацией о мероприятии
    game_message = f"""
🎮 <b>Описание игры</b>

🗓️ <b>Дата:</b> {game.datetime.strftime('%d %B %Y')}
🕒 <b>Время:</b> {game.datetime.strftime('%H:%M')}
📍 <b>Место проведения:</b> {game.address}

🔍 <b>Детали игры:</b>
Тема: {game.theme}
Уровень сложности: {game.difficulty_level}
Продолжительность: {game.duration}
Максимальное количество участников: {game.max_players} человек 👥

🌟 <b>Особенности:</b>
{peculiarities_str}
💬 <b>Дополнительная информация:</b>
Перед началом игры всем участникам будет проведён краткий инструктаж и объяснены роли🌆

👉 <b>Готов присоединиться?</b> Нажми на кнопку ниже, чтобы зарегистрироваться на игру и получить свой билет!
"""
    current_players = await sync_to_async(game.participants.count)()
    current_players = await sync_to_async(int)(current_players)

    # Создание инлайн кнопок
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton(f"Игроки {current_players}/{game.max_players}", callback_data=f'players_{game_id}')
    )
    if participant:
        markup.add(
            types.InlineKeyboardButton("Убрать бронь 📞", callback_data=f'remove_booking_{game_id}'),
        )
    else:
        markup.add(
            types.InlineKeyboardButton("Зарегистрироваться на игру 🎟️", callback_data=f'signup_{game_id}')
        )

    # Отправка сообщения с картинкой и текстом мероприятия
    if game.image:
        with open(game.image.path, 'rb') as photo:
            msg1 = await bot.send_photo(callback_query.message.chat.id, photo, caption=game_message, reply_markup=markup, parse_mode='HTML')
    else:
        msg1 = await bot.send_message(callback_query.message.chat.id, game_message, reply_markup=markup, parse_mode='HTML')

    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton(f"Назад к датам 🔄", callback_data=f'go_poster'),
        types.InlineKeyboardButton(f"Главное меню 🔙", callback_data=f'go_main')
    )
    msg2 = await bot.send_message(callback_query.message.chat.id, f"""🔙 <b>Вернуться к выбору даты</b>""", reply_markup=markup, parse_mode="HTML")

    # Обработка исключения для InvalidQueryID
    try:
        await bot.answer_callback_query(callback_query.id)
    except InvalidQueryID:
        pass

    # Обновляем сообщения
    await update_messages(bot, callback_query.message.chat.id, [msg1.message_id, msg2.message_id])

@dp.callback_query_handler(lambda c: c.data.startswith('players_'))
async def show_players(callback_query: types.CallbackQuery):
    game_id = int(callback_query.data.split('_')[1])
    game = await sync_to_async(Game.objects.get)(id=game_id)
    current_players = await sync_to_async(game.participants.count)()
    current_players = await sync_to_async(int)(current_players)
    if current_players == 0:
        msg = await bot.send_message(callback_query.message.chat.id, "На данный момент никого не записано")
        # Обновляем сообщения
        await update_messages(bot, callback_query.message.chat.id, [msg.message_id])
    else:
        participants = await sync_to_async(game.participants.all)()
        participants = await sync_to_async(list)(participants)

        media = []
        players_message = f"""
👥 <b>Список зарегистрированных участников на игру Cyber Mafia</b>

🗓️ <b>Дата игры:</b> {game.datetime.strftime('%d %B %Y')}
🕒 <b>Время:</b> {game.datetime.strftime('%H:%M')}
📍 <b>Место проведения:</b> {game.address}

<b>Текущие участники:</b>\n"""
        for participant in participants:
            user = await sync_to_async(getattr)(participant, 'user')
        
            players_message += f"<b>{participant.user.first_name}</b>{f' — уровень: {participant.user.level.name}' if participant.user.level else ''}\n"
            if user.avatar:
                with open(user.avatar.path, 'rb') as photo:
                    photo_data = io.BytesIO(photo.read())
                    media.append(types.InputMediaPhoto(media=photo_data))
        
        user = await sync_to_async(CustomUser.objects.get)(username=callback_query.message.chat.id)
        participant = await sync_to_async(Participant.objects.filter)(user=user, game=game)
        participant = await sync_to_async(lambda qs: qs.first())(participant)
        
        # Отправка аватарок участников группой
        if media:
            msg = await bot.send_media_group(callback_query.message.chat.id, media)
        else:
            msg = {"message_id": None}
        
        markup = types.InlineKeyboardMarkup(row_width=1)
        if participant:
            players_message += f"""\n📈 Свободных мест: 10 из 15

📲 <b>Если тебе нужно изменить или отменить регистрацию, свяжись с нами по кнопке ниже.</b>
"""
            markup.add(
                types.InlineKeyboardButton("Убрать бронь 📞", callback_data=f'remove_booking_{game_id}'),
                types.InlineKeyboardButton("Назад к игре 🔄", callback_data=f'game_{game_id}'),
            )
        else:
            players_message += f"""\n📈 Свободных мест: 10 из 15

✨ <b>Ещё не зарегистрировался? Присоединяйся к нам и стань частью киберпанк-игры!</b>
"""
            markup.add(
                types.InlineKeyboardButton("Зарегистрироваться на игру 🎟️", callback_data=f'signup_{game_id}'),
                types.InlineKeyboardButton("Назад к игре 🔄", callback_data=f'game_{game_id}'),
            )

        msg1 = await bot.send_message(callback_query.message.chat.id, players_message, parse_mode='HTML', reply_markup=markup)

        markup = types.InlineKeyboardMarkup(row_width=2)
        markup.add(
            types.InlineKeyboardButton(f"Афиша игр 🎟️", callback_data=f'go_poster'),
            types.InlineKeyboardButton(f"Главное меню 🔙", callback_data=f'go_main')
        )
        msg2 = await bot.send_message(callback_query.message.chat.id, f"""🔙 <b>Вернуться к афише игр</b>""", reply_markup=markup, parse_mode="HTML")

        # Обновляем сообщения
        await update_messages(bot, callback_query.message.chat.id, [*[m.message_id for m in msg], msg1.message_id, msg2.message_id])

    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data.startswith('signup_'))
async def signup_for_game(callback_query: types.CallbackQuery, state: FSMContext):
    game_id = int(callback_query.data.split('_')[1])
    game = await sync_to_async(Game.objects.get)(id=game_id)
    current_players = await sync_to_async(game.participants.count)()
    current_players = await sync_to_async(int)(current_players)
    if current_players < game.max_players:
        game = await sync_to_async(Game.objects.get)(id=game_id)
        user = await sync_to_async(CustomUser.objects.get)(username=callback_query.from_user.id)
        await sync_to_async(Participant.objects.create)(user=user, game=game)

        markup = types.InlineKeyboardMarkup(row_width=1)
        markup.add(
            types.InlineKeyboardButton("Убрать бронь 📞", callback_data=f'remove_booking_{game_id}'),
            types.InlineKeyboardButton("Назад к игре 🔄", callback_data=f'game_{game_id}'),
        )

        msg = await bot.send_message(callback_query.message.chat.id, f"""
<b>🎉 Поздравляем! Ты успешно зарегистрировался на игру!</b>
                               
🗓️ <b>Дата игры:</b> {game.datetime.strftime('%d %B %Y')}
🕒 <b>Время:</b> {game.datetime.strftime('%H:%M')}
📍 <b>Место проведения:</b> {game.address}

🔔 <b>Что дальше?</b>
    <b>Приходи вовремя!</b> Пожалуйста, будь на месте за 20 минут до начала игры, чтобы пройти инструктаж и подготовиться. ⏰
    <b>Помни про атмосферу!</b> Одевайся для создания правильного настроения. 🌌
    <b>Возьми с собой:</b> хорошее настроение и боевой дух! 💪
📲 <b>Если тебе нужно изменить или отменить регистрацию, свяжись с нами по кнопке ниже.</b>
""", parse_mode='HTML', reply_markup=markup)
        await bot.answer_callback_query(callback_query.id)
        await state.finish()
        # Обновляем сообщения
        await update_messages(bot, callback_query.message.chat.id, [msg.message_id])
    else:
        msg = await bot.send_message(callback_query.message.chat.id, "Извините, все места на игру уже заняты.")
        # Обновляем сообщения
        await update_messages(bot, callback_query.message.chat.id, [msg.message_id])

    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data.startswith('remove_booking_'))
async def remove_booking(callback_query: types.CallbackQuery, state: FSMContext):
    game_id = int(callback_query.data.split('_')[2])
    game = await sync_to_async(Game.objects.get)(id=game_id)
    user = await sync_to_async(CustomUser.objects.get)(username=callback_query.message.chat.id)

    # Проверка наличия записи Participant для текущего пользователя
    participant = await sync_to_async(Participant.objects.filter)(user=user, game=game)
    participant = await sync_to_async(lambda qs: qs.first())(participant)

    if participant:
        # # Уменьшаем количество участников на количество друзей и самого пользователя
        # game.current_players -= (participant.friends_count + 1)
        # await sync_to_async(game.save)()

        # Удаляем запись Participant
        await sync_to_async(participant.delete)()

        msg = await bot.send_message(callback_query.message.chat.id, "Бронь снята.")
        # Обновляем сообщения
        await update_messages(bot, callback_query.message.chat.id, [msg.message_id])
    else:
        msg = await bot.send_message(callback_query.message.chat.id, "У вас нет брони на это мероприятие.")
        # Обновляем сообщения
        await update_messages(bot, callback_query.message.chat.id, [msg.message_id])

    await bot.answer_callback_query(callback_query.id)

    await state.finish()
    await show_game(types.CallbackQuery(data=f'game_{game.id}', message=callback_query.message))

# Обработчик команды /statistic
@dp.message_handler(commands=['statistic'])
async def send_statistic_link(message: types.Message):
    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton(f"Афиша игр 🎟️", callback_data=f'go_poster'),
        types.InlineKeyboardButton(f"Главное меню 🔙", callback_data=f'go_main')
    )
    msg = await bot.send_message(message.chat.id, f"""
📊 <b>Твоя личная статистика:</b>
                           
Вот твои достижения и статистика за всё время участия в играх Cyber Mafia! 🎮
                                 
        <b>Всего игр:</b> 15 🎲
        <b>Побед:</b> 8 🏆
        <b>Лучшие роли:</b>
                Хакер (3 победы) 💻
                Кибердетектив (2 победы) 🔍
                Корпоративный шпион (3 победы) 🕵️‍♂️
        <b>Уровень доверия:</b> 85% 🔒
        <b>Активность:</b> 7 игр за последний месяц 📅
                           
🔥 <b>Продолжай в том же духе и повышай свои навыки в Cyber Mafia!</b>

📝 <b>Хочешь улучшить свою статистику? Присоединяйся к предстоящим играм и становись лучшим!</b>
""", reply_markup=markup, parse_mode='HTML')
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg.message_id])

# Обработчик команды /myclub
@dp.message_handler(commands=['myclub'])
async def send_myclub_link(message: types.Message, state=FSMContext):
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Написать участнику ✉️", callback_data="chat_participant"))
    msg1 = await bot.send_message(message.chat.id, f"""
👥 <b>Члены клуба Cyber Mafia</b>
                           
Здесь ты можешь увидеть список активных участников клуба Cyber Mafia в Санкт-Петербурге. Найди новых друзей, союзников или потенциальных соперников! 🤝
                           
🔍 <b>Топ игроков:</b>
                           
        <b>Алексей Смирнов</b> — Уровень: Эксперт 🌟 | Побед: 20 🏆
        <b>Мария Петрова</b> — Уровень: Ветеран 🏅 | Побед: 18 🏆
        <b>Дмитрий Иванов</b> — Уровень: Продвинутый 🌟 | Побед: 15 🏆
        <b>Анна Козлова</b> — Уровень: Новичок 🥉 | Побед: 5 🏆
                           
👥 <b>Другие участники:</b>
                           
        <b>Ольга Федорова</b> — Уровень: Продвинутый 🌟
        <b>Виктор Крылов</b> — Уровень: Новичок 🥉
        <b>Ирина Соколова</b> — Уровень: Эксперт 🌟
                           
✨ <b>Свяжись с участниками и укрепляй свои связи в клубе!</b>
""", reply_markup=markup, parse_mode='HTML')
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Главное меню 🔙", callback_data="go_main"))
    msg2 = await bot.send_message(message.chat.id, f"""
🔙 <b>Вернуться в главное меню</b>
""", reply_markup=markup, parse_mode='HTML')
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg1.message_id, msg2.message_id])

# Обработчик команды /rules
@dp.message_handler(commands=['rules'])
async def send_rules_link(message: types.Message):
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(
        types.InlineKeyboardButton("Ссылка", url='https://google.com'),
    )
    msg1 = await bot.send_message(message.chat.id, """
📜 <b>Правила игры Cyber Mafia</b>
                           
Добро пожаловать в мир Cyber Mafia! Здесь каждый ход может стать решающим, а каждая роль — уникальной. Ознакомься с правилами, чтобы быть готовым к любым поворотам событий. 🔄
                           
<b>Цель игры:</b> Выявить всех участников, которые являются "Мафией", или, если ты на стороне "Мафии", устранить всех мирных жителей. 🕵️‍♂️🔪
                           
<b>Роли игроков:</b>
                           
        <b>Мирные жители</b> 🏘️ — должны вычислить "Мафию" и выжить.
        <b>Мафия</b> 💀 — действует в тени, устраняя мирных жителей.
        <b>Хакеры</b> 💻 — могут получить информацию о других игроках.
        <b>Кибердетективы</b> 🔍 — расследуют и защищают город от киберугроз.
        <b>Корпоративные шпионы</b> 🕵️‍♀️ — играют двойную игру, помогая обеим сторонам.
                           
<b>Этапы игры:</b>
                           
        <b>День</b> ☀️ — обсуждение и голосование, кто из игроков подозрителен.
        <b>Ночь</b> 🌙 — активные роли (Мафия, Хакеры, Детективы) делают свои ходы.
                            
<b>Голосование и исключение:</b> Каждый день игроки голосуют, кого из подозреваемых исключить из игры. 🚫
                           
<b>Победа:</b> Игра заканчивается, когда все "Мафия" обнаружены и исключены или если "Мафия" численно превосходит мирных жителей. 🏆

📖 Подробнее о правилах и стратегиях можешь узнать на нашем сайте или в игре!
""", reply_markup=markup, parse_mode="HTML")
    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton("Главное меню 🔙", callback_data='go_main')
    )
    msg2 = await bot.send_message(message.chat.id, """
🔙 <b>Вернуться в главное меню</b>
""", reply_markup=markup, parse_mode="HTML")
    # Обновляем сообщения
    await update_messages(bot, message.chat.id, [message.message_id, msg1.message_id, msg2.message_id])

# Запуск бота
if __name__ == '__main__':
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)