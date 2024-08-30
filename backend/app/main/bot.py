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

from main.models import CustomUser, City, Event, Participant, Order, OrderTable
from django.conf import settings
from django.db import close_old_connections, connections
from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist
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
    waiting_for_friends_count = State()

class EditFriendsStates(StatesGroup):
    waiting_for_friends_count = State()

class OrderEventStates(StatesGroup):
    confirm_order = State()
    select_event_type = State()
    enter_date = State()
    add_comment = State()

class OrderTableState(StatesGroup):
    confirm_order = State()
    enter_game_name = State()
    enter_real_name = State()
    upload_photo = State()

# Обработчик команды /home
@dp.message_handler(commands=['app'])
async def return_to_home(message: types.Message, state: FSMContext):
    await state.finish()
    markup = InlineKeyboardMarkup(row_width=1)
    markup.insert(InlineKeyboardButton("Запустить приложение", url=f'https://t.me/cyber_mafia_dev_bot/dev'))
    await bot.send_message(message.chat.id, "Добро пожаловать в приложение", reply_markup=markup)

# Обработчик команды /home
@dp.message_handler(commands=['home'])
async def return_to_home(message: types.Message, state: FSMContext):
    await state.finish()
    await bot.send_message(message.chat.id, "Хорошо, возвращаемся в главное меню")

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
        await bot.send_message(message.chat.id, "Привет! Здесь играют в мафию. Наши клубы есть в этих городах, пожалуйста, выбери свой.", reply_markup=markup)
    else:
        await bot.send_message(message.chat.id, "Привет! Добро пожаловать обратно!")

# Обработчик выбора города
@dp.callback_query_handler(lambda c: c.data.startswith('city_'), state=Form.choosing_city)
async def process_city(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    city_id = int(callback_query.data.split('_')[1])
    city = await sync_to_async(City.objects.get)(id=city_id)
    await bot.edit_message_text(chat_id=callback_query.message.chat.id, message_id=callback_query.message.message_id, text=f"{city.name}, отлично!")
    await bot.send_message(callback_query.from_user.id, "С городом разобрались, теперь подскажи, как тебя зовут?")
    await Form.entering_name.set()
    async with state.proxy() as data:
        data['city_id'] = city_id
        data['main_city_id'] = city_id
        data['user_id'] = callback_query.from_user.id

# Обработчик ввода имени
@dp.message_handler(state=Form.entering_name)
async def process_name(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['name'] = message.text
    await Form.entering_phone.set()
    markup = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    markup.add(KeyboardButton("Хочу использовать текущий номер телефона", request_contact=True))
    await bot.send_message(message.chat.id, "Нажми на кнопку, или введи номер телефона", reply_markup=markup)

# Обработчик ввода номера телефона
@dp.message_handler(content_types=['contact', 'text'], state=Form.entering_phone)
async def process_phone(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        if message.contact:
            data['phone'] = message.contact.phone_number
        else:
            phone_pattern = re.compile(r'^\+?\d{10,15}$')
            if not phone_pattern.match(message.text):
                await bot.send_message(message.chat.id, "Неверный формат. Пожалуйста, введите номер телефона.")
                return
            data['phone'] = message.text
    await Form.uploading_avatar.set()
    markup = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    markup.add(KeyboardButton("Загружу позже в профиле"))
    await bot.send_message(message.chat.id, "Все, осталось только загрузить аватар", reply_markup=markup)

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
    await state.finish()
    await bot.send_message(message.chat.id, "Отлично!")
    await bot.send_message(message.chat.id, "Хорошо, в таком случае регистрация завершена 🔥🔥🔥 Выбери в меню пункт \"Афиши\" чтобы посмотреть запланированные игры", reply_markup=types.ReplyKeyboardRemove())

# Обработчик команды /profile
@dp.message_handler(commands=['profile'], state='*')
async def show_profile(message: types.Message):
    user_id = message.from_user.id
    user_queryset = await sync_to_async(CustomUser.objects.filter)(username=str(user_id))
    user = await sync_to_async(lambda: user_queryset.first())()
    
    if user:
        # Первое сообщение с кнопкой "Вернуться в главное меню"
        markup = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
        markup.add(KeyboardButton("Вернуться в главное меню"))
        msg1 = await bot.send_message(message.from_user.id, "Можешь посмотреть и отредактировать профиль здесь", reply_markup=markup)

        city = await sync_to_async(getattr)(user, 'city')
        main_city = await sync_to_async(getattr)(user, 'main_city')

        # Отправка аватара, если он есть
        if user.avatar:
            with open(user.avatar.path, 'rb') as photo:
                await bot.send_photo(message.from_user.id, photo)

        # Второе сообщение с информацией о профиле
        profile_info = f"""
Профиль

Имя: {user.first_name or '❌'}
Игровое имя: {user.game_name or '❌'}
Текущий клуб: {city or '❌'}
Основной клуб: {main_city or '❌'}
Номер телефона: {user.phone or '❌'}
{'Аватар: ❌' if not user.avatar else ''}
Сыграно игр: 0

Статистика за август
В этом месяце еще не было игр
"""
        msg2 = await bot.send_message(message.from_user.id, profile_info)

        # Третье сообщение с кнопками "Нет, отредактировать" и "Да, всё ок"
        inline_markup = InlineKeyboardMarkup(row_width=2)
        inline_markup.add(InlineKeyboardButton("Нет, отредактировать", callback_data='edit_profile'), InlineKeyboardButton("Да, всё ок", callback_data='profile_ok'))
        msg3 = await bot.send_message(message.from_user.id, "Все верно?", reply_markup=inline_markup)

        # Сохраняем идентификаторы сообщений в FSM
        async with dp.current_state(chat=message.from_user.id, user=message.from_user.id).proxy() as data:
            data['profile_messages'] = [msg1.message_id, msg2.message_id, msg3.message_id, None]
    else:
        await bot.send_message(message.from_user.id, "Профиль не найден. Пожалуйста, зарегистрируйтесь.")

# Обработчик кнопки "Вернуться в главное меню"
@dp.message_handler(lambda message: message.text == "Вернуться в главное меню", state='*')
async def return_to_main_menu(message: types.Message, state: FSMContext):
    await state.finish()
    await bot.send_message(message.chat.id, "Хорошо, возвращаемся в главное меню", reply_markup=types.ReplyKeyboardRemove())

# Обработчик инлайн кнопок
@dp.callback_query_handler(lambda c: c.data in ['edit_profile', 'profile_ok', 'edit_name', 'edit_game_name', 'edit_city', 'edit_phone', 'edit_avatar', 'afisha_edit_city'])
async def process_callback_profile(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    async with dp.current_state(chat=callback_query.message.chat.id, user=callback_query.from_user.id).proxy() as data:
        msg1_id, msg2_id, msg3_id, msg4_id = [None, None, None, None]
        if 'profile_messages' in data:
            msg1_id, msg2_id, msg3_id, msg4_id = data['profile_messages']
            if callback_query.data == 'edit_profile':
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg3_id, reply_markup=None)  # Удаляем инлайн-кнопки
                new_inline_markup = InlineKeyboardMarkup(row_width=2)
                new_inline_markup.add(
                    InlineKeyboardButton("Имя", callback_data='edit_name'),
                    InlineKeyboardButton("Игровой ник", callback_data='edit_game_name'),
                    InlineKeyboardButton("Текущий клуб", callback_data='edit_city'),
                    InlineKeyboardButton("Номер телефона", callback_data='edit_phone'),
                    InlineKeyboardButton("Аватар", callback_data='edit_avatar')
                )
                msg4 = await bot.send_message(callback_query.message.chat.id, "Ок, что будем редактировать?", reply_markup=new_inline_markup)
                # Сохраняем идентификаторы сообщений в FSM
                async with dp.current_state(chat=callback_query.from_user.id, user=callback_query.from_user.id).proxy() as data:
                    data['profile_messages'] = [msg1_id, msg2_id, msg3_id, msg4.message_id]
        if callback_query.data == 'profile_ok':
            await bot.delete_message(callback_query.message.chat.id, msg2_id)  # Удаляем сообщение с информацией о профиле
            await bot.delete_message(callback_query.message.chat.id, msg3_id)
            await bot.send_message(callback_query.message.chat.id, "Отлично!", reply_markup=types.ReplyKeyboardRemove())  # Заменяем сообщение с кнопками
        elif callback_query.data == 'edit_name':
            await Form.editing_name.set()
            if msg4_id:
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg4_id, reply_markup=None)  # Удаляем инлайн-кнопки
            await bot.send_message(callback_query.message.chat.id, "Введите новое имя:")
        elif callback_query.data == 'edit_game_name':
            await Form.editing_game_name.set()
            if msg4_id:
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg4_id, reply_markup=None)  # Удаляем инлайн-кнопки
            await bot.send_message(callback_query.message.chat.id, "Введите новый игровой ник:")
        elif callback_query.data == 'edit_city':
            await Form.editing_city.set()
            markup = InlineKeyboardMarkup(row_width=2)
            cities = await sync_to_async(City.objects.all)()
            cities = await sync_to_async(list)(cities)
            for city in cities:
                markup.insert(InlineKeyboardButton(city.name, callback_data=f'city_{city.id}'))
            if msg4_id:
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg4_id, reply_markup=None)  # Удаляем инлайн-кнопки
            await bot.send_message(callback_query.message.chat.id, "Выберите новый текущий клуб:", reply_markup=markup)
        elif callback_query.data == 'edit_phone':
            await Form.editing_phone.set()
            if msg4_id:
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg4_id, reply_markup=None)  # Удаляем инлайн-кнопки
            await bot.send_message(callback_query.message.chat.id, "Введите новый номер телефона:")
        elif callback_query.data == 'edit_avatar':
            await Form.editing_avatar.set()
            if msg4_id:
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg4_id, reply_markup=None)  # Удаляем инлайн-кнопки
            await bot.send_message(callback_query.message.chat.id, "Отправьте новый аватар:")
        elif callback_query.data == 'afisha_edit_city':
            await Form.afisha_editing_city.set()
            markup = InlineKeyboardMarkup(row_width=2)
            cities = await sync_to_async(City.objects.all)()
            cities = await sync_to_async(list)(cities)
            for city in cities:
                markup.insert(InlineKeyboardButton(city.name, callback_data=f'city_{city.id}'))
            if msg4_id:
                await bot.edit_message_reply_markup(callback_query.message.chat.id, msg4_id, reply_markup=None)  # Удаляем инлайн-кнопки
            await bot.send_message(callback_query.message.chat.id, "Выберите город для просмотра афиши", reply_markup=markup)

# Обработчики для изменения данных в профиле
@dp.message_handler(state=Form.editing_name)
async def process_edit_name(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.first_name = message.text
    await sync_to_async(user.save)()
    await state.finish()
    await show_profile(message)

@dp.message_handler(state=Form.editing_game_name)
async def process_edit_game_name(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.game_name = message.text
    await sync_to_async(user.save)()
    await state.finish()
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
    await show_profile(callback_query)

@dp.callback_query_handler(lambda c: c.data.startswith('city_'), state=Form.afisha_editing_city)
async def process_afisha_edit_city(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.answer_callback_query(callback_query.id)
    city_id = int(callback_query.data.split('_')[1])
    city = await sync_to_async(City.objects.get)(id=city_id)
    await state.finish()
    await send_afisha(callback_query.message, city=city)

# Обработчик для изменения номера телефона в профиле
@dp.message_handler(state=Form.editing_phone)
async def process_edit_phone(message: types.Message, state: FSMContext):
    phone_pattern = re.compile(r'^\+?\d{10,15}$')
    if not phone_pattern.match(message.text):
        await bot.send_message(message.chat.id, "Неверный формат номера телефона. Пожалуйста, введите номер в формате +1234567890 или 1234567890.")
        return
    
    user_id = message.from_user.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    user.phone = message.text
    await sync_to_async(user.save)()
    await state.finish()
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
    await show_profile(message)

# Обработчик команды /afisha
@dp.message_handler(commands=['afisha'])
async def send_afisha(message: types.Message, city=None):
    user_id = message.chat.id
    user = await sync_to_async(CustomUser.objects.get)(username=str(user_id))
    # Получение мероприятий в текущем городе пользователя
    if city is None:
        city = await sync_to_async(getattr)(user, 'city')
    else:
        await bot.delete_message(message.chat.id, message.message_id)
    events = await sync_to_async(Event.objects.filter)(city=city)
    events = await sync_to_async(list)(events)
    if len(events) == 0:
        await bot.send_message(message.chat.id, f"К сожалению, на данный момент доступных афиш нет.\nПопробуй позже")
        return
    event_buttons = [types.InlineKeyboardButton(event.name, callback_data=f'event_{event.id}') for event in events]
    # Сообщение с информацией о пользователе
    afisha_message = f"""
Ник: {user.game_name or 'Игорь'}
Сыграно игр: {user.games_played or 0}
Набрано баллов: {user.points_earned or 0}

Сыграно игр в этом месяце: {user.games_played_this_month or 0}

Игровых вечеров в этом месяце: {user.game_evenings_this_month or 0}

Статус: Игрок

Ваш статус Игрока дает вам следующие привилегии:

📍Скидочную карту в ресторане Мятный Енот на 5%
📍Участие в розыгрыше призов за 1,2,3 место на каждом игровом вечере

ВАЖНО: Чтобы получать данные привилегии, вы должны подтверждать статус игрока ежемесячно (играть в нашем клубе не менее 1 раза в месяц)

*Если вы станете резидентом клуба (от 50 игр в нашем клубе), то вы получите: возможность участвовать в шоу Мафия Балаган, бесплатную игру на день рождения, увеличение скидки в ресторане Мятный Енот, одну бесплатную песню на выбор (в месяц) и др.

Подробнее со статусами и привилегиями ознакомиться ниже⬇️
"""
    await bot.send_message(message.chat.id, afisha_message)

    # Отправка трех локальных фотографий разом
    photo_paths = [
        os.path.join(settings.BASE_DIR, 'path_to_photo1.jpg'),
        os.path.join(settings.BASE_DIR, 'path_to_photo2.jpg'),
        os.path.join(settings.BASE_DIR, 'path_to_photo3.jpg'),
        os.path.join(settings.BASE_DIR, 'path_to_photo4.jpg')
    ]
    media = [types.InputMediaPhoto(open(photo_path, 'rb')) for photo_path in photo_paths]
    await bot.send_media_group(message.chat.id, media)

    # Сообщение с кнопками
    markup = types.InlineKeyboardMarkup(row_width=1)
    markup.add(*event_buttons)
    markup.add(
        types.InlineKeyboardButton("Заказать мероприятие", callback_data='order_event'),
        types.InlineKeyboardButton("Сменить город", callback_data='afisha_edit_city')
    )
    await bot.send_message(message.chat.id, "Статистика за август\nВ этом месяце у тебя еще не было игр\nСамое время начать! Вот список игр, выбирай, когда удобно, и записывайся!", reply_markup=markup)

# Обработчик клика на мероприятие
@dp.callback_query_handler(lambda c: c.data.startswith('event_'))
async def show_event(callback_query: types.CallbackQuery):
    event_id = int(callback_query.data.split('_')[1])
    event = await sync_to_async(Event.objects.get)(id=event_id)

    # Получаем city асинхронно
    city = await sync_to_async(getattr)(event, 'city')

    # Проверка наличия предыдущего и следующего мероприятий
    event_queryset_previous = await sync_to_async(Event.objects.filter)(city=city, id__lt=event_id)
    has_previous = await sync_to_async(lambda qs: qs.exists())(event_queryset_previous)

    event_queryset_next = await sync_to_async(Event.objects.filter)(city=city, id__gt=event_id)
    has_next = await sync_to_async(lambda qs: qs.exists())(event_queryset_next)

    # Проверка наличия записи Participant для текущего пользователя
    user = await sync_to_async(CustomUser.objects.get)(username=callback_query.message.chat.id)
    participant = await sync_to_async(Participant.objects.filter)(user=user, event=event)
    participant = await sync_to_async(lambda qs: qs.first())(participant)

    # Создание сообщения с информацией о мероприятии
    event_message = f"""{event.description}"""
    # Создание инлайн кнопок
    markup = types.InlineKeyboardMarkup(row_width=2)
    if has_previous:
        markup.add(types.InlineKeyboardButton("Назад", callback_data=f'prev_{event_id}'))
    if has_next:
        markup.add(types.InlineKeyboardButton("Следующая", callback_data=f'next_{event_id}'))
    markup.add(
        types.InlineKeyboardButton(f"Игроки {event.current_players}/{event.max_players}", callback_data=f'players_{event_id}')
    )
    if participant:
        markup.add(
            types.InlineKeyboardButton("Убрать бронь", callback_data=f'remove_booking_{event_id}'),
            types.InlineKeyboardButton("Убрать/Добавить друга", callback_data=f'edit_friends_{event_id}')
        )
    else:
        markup.add(
            types.InlineKeyboardButton("Записаться", callback_data=f'signup_{event_id}')
        )
    markup.add(
        types.InlineKeyboardButton("Сменить город", callback_data='afisha_edit_city')
    )

    # Отправка сообщения с картинкой и текстом мероприятия
    if event.image:
        with open(event.image.path, 'rb') as photo:
            await bot.send_photo(callback_query.message.chat.id, photo, caption=event_message, reply_markup=markup)
    else:
        await bot.send_message(callback_query.message.chat.id, event_message, reply_markup=markup)

    # Обработка исключения для InvalidQueryID
    try:
        await bot.answer_callback_query(callback_query.id)
    except InvalidQueryID:
        pass

# Обработчик кнопки "Назад"
@dp.callback_query_handler(lambda c: c.data.startswith('prev_'))
async def prev_event(callback_query: types.CallbackQuery):
    current_event_id = int(callback_query.data.split('_')[1])
    current_event = await sync_to_async(Event.objects.get)(id=current_event_id)
    
    # Получаем city асинхронно
    city = await sync_to_async(getattr)(current_event, 'city')
    
    # Фильтруем события асинхронно
    event_queryset = await sync_to_async(Event.objects.filter)(city=city, id__lt=current_event_id)
    previous_event = await sync_to_async(lambda qs: qs.order_by('-id').first())(event_queryset)

    if previous_event:
        await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
        await show_event(types.CallbackQuery(data=f'event_{previous_event.id}', message=callback_query.message))
    else:
        await bot.send_message(callback_query.message.chat.id, "Это первое мероприятие в списке.")

    # Обработка исключения для InvalidQueryID
    try:
        await bot.answer_callback_query(callback_query.id)
    except InvalidQueryID:
        pass

# Обработчик кнопки "Следующая"
@dp.callback_query_handler(lambda c: c.data.startswith('next_'))
async def next_event(callback_query: types.CallbackQuery):
    current_event_id = int(callback_query.data.split('_')[1])
    current_event = await sync_to_async(Event.objects.get)(id=current_event_id)
    
    # Получаем city асинхронно
    city = await sync_to_async(getattr)(current_event, 'city')
    
    # Фильтруем события асинхронно
    event_queryset = await sync_to_async(Event.objects.filter)(city=city, id__gt=current_event_id)
    next_event = await sync_to_async(lambda qs: qs.order_by('id').first())(event_queryset)

    if next_event:
        await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
        await show_event(types.CallbackQuery(data=f'event_{next_event.id}', message=callback_query.message))
    else:
        await bot.send_message(callback_query.message.chat.id, "Это последнее мероприятие в списке.")

    # Обработка исключения для InvalidQueryID
    try:
        await bot.answer_callback_query(callback_query.id)
    except InvalidQueryID:
        pass

@dp.callback_query_handler(lambda c: c.data.startswith('players_'))
async def show_players(callback_query: types.CallbackQuery):
    event_id = int(callback_query.data.split('_')[1])
    event = await sync_to_async(Event.objects.get)(id=event_id)

    if event.current_players == 0:
        await bot.send_message(callback_query.message.chat.id, "На данный момент никого не записано")
    else:
        participants = await sync_to_async(event.participants.all)()
        participants = await sync_to_async(list)(participants)
        media = []
        players_message = "** На данный момент зарегистрированные участники: **\n"
        for idx, participant in enumerate(participants, start=1):
            user = await sync_to_async(getattr)(participant, 'user')
            if participant.friends_count == 0 and participant.user.game_name:
                additional_info = f'({participant.user.game_name})'
            elif participant.friends_count == 0 and not participant.user.game_name:
                additional_info = ''
            else:
                additional_info = f'+{participant.friends_count}'
            players_message += f"{idx}. {participant.user.first_name} {additional_info}\n"
            if user.avatar:
                with open(user.avatar.path, 'rb') as photo:
                    photo_data = io.BytesIO(photo.read())
                    media.append(types.InputMediaPhoto(media=photo_data))

        await bot.send_message(callback_query.message.chat.id, players_message)

        # Отправка аватарок участников группой
        if media:
            await bot.send_media_group(callback_query.message.chat.id, media)

    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data.startswith('signup_'))
async def signup_for_event(callback_query: types.CallbackQuery, state: FSMContext):
    event_id = int(callback_query.data.split('_')[1])
    event = await sync_to_async(Event.objects.get)(id=event_id)

    if event.current_players < event.max_players:
        markup = types.InlineKeyboardMarkup(row_width=2)
        markup.add(
            types.InlineKeyboardButton("Я один", callback_data=f'friends_0_{event_id}'),
            types.InlineKeyboardButton("+1", callback_data=f'friends_1_{event_id}'),
            types.InlineKeyboardButton("+2", callback_data=f'friends_2_{event_id}'),
            types.InlineKeyboardButton("+3", callback_data=f'friends_3_{event_id}')
        )
        await bot.send_message(callback_query.message.chat.id, "Сколько с Вами будет друзей? Выберите один из вариантов, или введите число до 10:", reply_markup=markup)
        
        # Сохраняем event_id в состояние FSM
        async with state.proxy() as data:
            data['event_id'] = event_id
        
        await Form.waiting_for_friends_count.set()
    else:
        await bot.send_message(callback_query.message.chat.id, "Извините, все места на мероприятие уже заняты.")

    await bot.answer_callback_query(callback_query.id)
    await bot.answer_callback_query(callback_query.id)

@dp.message_handler(state=Form.waiting_for_friends_count)
async def process_friends_count(message: types.Message, state: FSMContext):
    try:
        friends_count = int(message.text)
        if 0 <= friends_count <= 10:
            async with state.proxy() as data:
                event_id = data['event_id']
                event = await sync_to_async(Event.objects.get)(id=event_id)
                user = await sync_to_async(CustomUser.objects.get)(username=message.from_user.id)

                # Проверяем, существует ли уже запись в Participant
                participant, created = await sync_to_async(Participant.objects.get_or_create)(user=user, event=event)
                if created:
                    participant.friends_count = friends_count
                    await sync_to_async(participant.save)()
                event.current_players = friends_count + 1
                await sync_to_async(event.save)()

                await bot.send_message(message.chat.id, f"Вы записаны на мероприятие '{event.name}' с {friends_count} друзьями.")
                await state.finish()
                await show_event(types.CallbackQuery(data=f'event_{event.id}', message=message))
        else:
            await bot.send_message(message.chat.id, "Пожалуйста, введите число от 0 до 10.")
    except ValueError:
        await bot.send_message(message.chat.id, "Пожалуйста, введите число от 0 до 10.")

@dp.callback_query_handler(lambda c: c.data.startswith('friends_'), state=Form.waiting_for_friends_count)
async def process_friends_count_callback(callback_query: types.CallbackQuery, state: FSMContext):
    friends_count = int(callback_query.data.split('_')[1])
    event_id = int(callback_query.data.split('_')[2])

    event = await sync_to_async(Event.objects.get)(id=event_id)
    user = await sync_to_async(CustomUser.objects.get)(username=callback_query.from_user.id)

    # Проверяем, существует ли уже запись в Participant
    participant, created = await sync_to_async(Participant.objects.get_or_create)(user=user, event=event)
    if created:
        participant.friends_count = friends_count
        await sync_to_async(participant.save)()
    event.current_players = friends_count + 1
    await sync_to_async(event.save)()

    await bot.send_message(callback_query.message.chat.id, f"Вы записаны на мероприятие '{event.name}' с {friends_count} друзьями.")
    await bot.answer_callback_query(callback_query.id)
    await state.finish()
    await show_event(types.CallbackQuery(data=f'event_{event.id}', message=callback_query.message))

@dp.callback_query_handler(lambda c: c.data.startswith('edit_friends_'))
async def edit_friends_for_event(callback_query: types.CallbackQuery, state: FSMContext):
    event_id = int(callback_query.data.split('_')[2])
    event = await sync_to_async(Event.objects.get)(id=event_id)

    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton("Я один", callback_data=f'edit_friends_0_{event_id}'),
        types.InlineKeyboardButton("+1", callback_data=f'edit_friends_1_{event_id}'),
        types.InlineKeyboardButton("+2", callback_data=f'edit_friends_2_{event_id}'),
        types.InlineKeyboardButton("+3", callback_data=f'edit_friends_3_{event_id}')
    )
    await bot.send_message(callback_query.message.chat.id, "Сколько с Вами будет друзей? Выберите один из вариантов, или введите число до 10:", reply_markup=markup)
    # Сохраняем event_id в состояние FSM
    async with state.proxy() as data:
        data['event_id'] = event_id

    await EditFriendsStates.waiting_for_friends_count.set()
    await bot.answer_callback_query(callback_query.id)

@dp.message_handler(state=EditFriendsStates.waiting_for_friends_count)
async def process_edit_friends_count(message: types.Message, state: FSMContext):
    try:
        friends_count = int(message.text)
        if 0 <= friends_count <= 10:
            async with state.proxy() as data:
                event_id = data['event_id']
                event = await sync_to_async(Event.objects.get)(id=event_id)
                user = await sync_to_async(CustomUser.objects.get)(username=message.from_user.id)

                # Проверяем, существует ли уже запись в Participant
                participant = await sync_to_async(Participant.objects.get)(user=user, event=event)
                participant.friends_count = friends_count
                await sync_to_async(participant.save)()
                event.current_players = friends_count + 1
                await sync_to_async(event.save)()

                await bot.send_message(message.chat.id, f"Количество друзей для мероприятия '{event.name}' изменено на {friends_count}.")
                await state.finish()
                await show_event(types.CallbackQuery(data=f'event_{event.id}', message=message))
        else:
            await bot.send_message(message.chat.id, "Пожалуйста, введите число от 0 до 10.")
    except ValueError:
        await bot.send_message(message.chat.id, "Пожалуйста, введите число от 0 до 10.")

@dp.callback_query_handler(lambda c: c.data.startswith('edit_friends_'), state=EditFriendsStates.waiting_for_friends_count)
async def process_edit_friends_count_callback(callback_query: types.CallbackQuery, state: FSMContext):
    friends_count = int(callback_query.data.split('_')[2])
    event_id = int(callback_query.data.split('_')[3])

    event = await sync_to_async(Event.objects.get)(id=event_id)
    user = await sync_to_async(CustomUser.objects.get)(username=callback_query.from_user.id)

    # Проверяем, существует ли уже запись в Participant
    participant = await sync_to_async(Participant.objects.get)(user=user, event=event)
    participant.friends_count = friends_count
    await sync_to_async(participant.save)()
    event.current_players = friends_count + 1
    await sync_to_async(event.save)()

    await bot.send_message(callback_query.message.chat.id, f"Количество друзей для мероприятия '{event.name}' изменено на {friends_count}.")
    await bot.answer_callback_query(callback_query.id)
    await state.finish()
    await show_event(types.CallbackQuery(data=f'event_{event.id}', message=callback_query.message))

@dp.callback_query_handler(lambda c: c.data.startswith('remove_booking_'))
async def remove_booking(callback_query: types.CallbackQuery, state: FSMContext):
    event_id = int(callback_query.data.split('_')[2])
    event = await sync_to_async(Event.objects.get)(id=event_id)
    user = await sync_to_async(CustomUser.objects.get)(username=callback_query.message.chat.id)

    # Проверка наличия записи Participant для текущего пользователя
    participant = await sync_to_async(Participant.objects.filter)(user=user, event=event)
    participant = await sync_to_async(lambda qs: qs.first())(participant)

    if participant:
        # Уменьшаем количество участников на количество друзей и самого пользователя
        event.current_players -= (participant.friends_count + 1)
        await sync_to_async(event.save)()

        # Удаляем запись Participant
        await sync_to_async(participant.delete)()

        await bot.send_message(callback_query.message.chat.id, "Бронь снята.")
    else:
        await bot.send_message(callback_query.message.chat.id, "У вас нет брони на это мероприятие.")

    await bot.answer_callback_query(callback_query.id)

    await state.finish()
    await show_event(types.CallbackQuery(data=f'event_{event.id}', message=callback_query.message))

@dp.callback_query_handler(lambda c: c.data == 'order_event')
async def order_event(callback_query: types.CallbackQuery):
    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton("Да", callback_data='confirm_order_yes'),
        types.InlineKeyboardButton("Нет", callback_data='confirm_order_no')
    )
    await bot.send_message(callback_query.message.chat.id, "Заказать мероприятие?", reply_markup=markup)
    await OrderEventStates.confirm_order.set()
    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data == 'confirm_order_yes', state=OrderEventStates.confirm_order)
async def confirm_order_yes(callback_query: types.CallbackQuery, state: FSMContext):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=True)
    markup.add("День рождения", "Корпоратив")
    await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
    await bot.send_message(callback_query.message.chat.id, "Выберите тип мероприятия или введите свой вариант", reply_markup=markup)
    await OrderEventStates.select_event_type.set()
    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data == 'confirm_order_no', state=OrderEventStates.confirm_order)
async def confirm_order_no(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
    await bot.send_message(callback_query.message.chat.id, "Хорошо. Возвращаемся в главное меню.")
    await state.finish()
    await bot.answer_callback_query(callback_query.id)

@dp.message_handler(state=OrderEventStates.select_event_type)
async def select_event_type(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['event_type'] = message.text
    await bot.send_message(message.chat.id, "Введите желаемую дату мероприятия")
    await OrderEventStates.enter_date.set()

@dp.message_handler(state=OrderEventStates.enter_date)
async def enter_date(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['date'] = message.text
    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton("Добавить комментарий", callback_data='add_comment'),
        types.InlineKeyboardButton("Завершить заказ", callback_data='finish_order'),
        types.InlineKeyboardButton("Отменить заказ", callback_data='cancel_order')
    )
    await bot.send_message(message.chat.id, "Что дальше?", reply_markup=markup)
    await OrderEventStates.add_comment.set()

@dp.callback_query_handler(lambda c: c.data == 'add_comment', state=OrderEventStates.add_comment)
async def add_comment(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
    await bot.send_message(callback_query.message.chat.id, "Введите комментарий к заявке")
    await bot.answer_callback_query(callback_query.id)

@dp.message_handler(state=OrderEventStates.add_comment)
async def enter_comment(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['comment'] = message.text
        user = await sync_to_async(CustomUser.objects.get)(username=message.from_user.id)
        await sync_to_async(Order.objects.create)(
            user=user,
            event_type=data['event_type'],
            date=data['date'],
            comment=data['comment']
        )
    await bot.send_message(message.chat.id, "Ваша заявка принята. Наш менеджер скоро с вами свяжется")
    await state.finish()

@dp.callback_query_handler(lambda c: c.data == 'finish_order', state=OrderEventStates.add_comment)
async def finish_order(callback_query: types.CallbackQuery, state: FSMContext):
    async with state.proxy() as data:
        user = await sync_to_async(CustomUser.objects.get)(username=callback_query.from_user.id)
        await sync_to_async(Order.objects.create)(
            user=user,
            event_type=data['event_type'],
            date=data['date'],
            comment=data.get('comment', '')
        )
    await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
    await bot.send_message(callback_query.message.chat.id, "Ваша заявка принята. Наш менеджер скоро с вами свяжется")
    await state.finish()
    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data == 'cancel_order', state=OrderEventStates.add_comment)
async def cancel_order(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
    await bot.send_message(callback_query.message.chat.id, "Ваш заказ отменён")
    await state.finish()
    await bot.answer_callback_query(callback_query.id)

# Обработчик команды /statistic
@dp.message_handler(commands=['statistic'])
async def send_statistic_link(message: types.Message):
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Перейти", url="https://google.com"))
    await bot.send_message(message.chat.id, "Ок, держи ссылку:", reply_markup=markup)

# Обработчик команды /myclub
@dp.message_handler(commands=['myclub'])
async def send_myclub_link(message: types.Message):
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Перейти", url="https://google.com"))
    await bot.send_message(message.chat.id, "Ок, держи ссылку:", reply_markup=markup)

# Обработчик команды /rules
@dp.message_handler(commands=['rules'])
async def send_rules_link(message: types.Message):
    await bot.send_message(message.chat.id, "https://vk.com/video-220900079_456239091")

@dp.message_handler(commands=['order'])
async def order_table(message: types.Message):
    markup = types.InlineKeyboardMarkup(row_width=2)
    markup.add(
        types.InlineKeyboardButton("Да", callback_data='confirm_order_yes'),
        types.InlineKeyboardButton("Нет", callback_data='confirm_order_no')
    )
    await bot.send_message(message.chat.id, "Заказать именную табличку?", reply_markup=markup)
    await OrderTableState.confirm_order.set()

@dp.callback_query_handler(lambda c: c.data == 'confirm_order_yes', state=OrderTableState.confirm_order)
async def confirm_order_yes(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.edit_message_reply_markup(callback_query.message.chat.id, callback_query.message.message_id, reply_markup=None)
    await bot.send_message(callback_query.message.chat.id, "Введите Игровое имя (Никнейм)")
    await OrderTableState.enter_game_name.set()
    await bot.answer_callback_query(callback_query.id)

@dp.callback_query_handler(lambda c: c.data == 'confirm_order_no', state=OrderTableState.confirm_order)
async def confirm_order_no(callback_query: types.CallbackQuery, state: FSMContext):
    await bot.delete_message(callback_query.message.chat.id, callback_query.message.message_id)
    await bot.send_message(callback_query.message.chat.id, "Хорошо, возвращаемся в главное меню.")
    await state.finish()
    await bot.answer_callback_query(callback_query.id)

@dp.message_handler(state=OrderTableState.enter_game_name)
async def enter_game_name(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['game_name'] = message.text
    await bot.send_message(message.chat.id, "Введите свое настоящее имя")
    await OrderTableState.enter_real_name.set()

@dp.message_handler(state=OrderTableState.enter_real_name)
async def enter_real_name(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['real_name'] = message.text
    await bot.send_message(message.chat.id, "Пришлите фото, которое будет размещено на вашей именно табличке")
    await OrderTableState.upload_photo.set()

@dp.message_handler(content_types=types.ContentTypes.PHOTO, state=OrderTableState.upload_photo)
async def upload_photo(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['photo'] = message.photo[-1].file_id
        user = await sync_to_async(CustomUser.objects.get)(username=message.from_user.id)
        # Скачиваем фото и сохраняем его в файловую систему
        file_info = await bot.get_file(data['photo'])
        file_path = file_info.file_path
        downloaded_file = await bot.download_file(file_path)
        # Сохраняем файл в директорию media/order_tables/
        with open(f"media/order_tables/{data['photo']}.jpg", 'wb') as new_file:
            new_file.write(downloaded_file.getvalue())
        # Сохраняем путь к файлу в базе данных
        await sync_to_async(OrderTable.objects.create)(
            user=user,
            game_name=data['game_name'],
            real_name=data['real_name'],
            photo=f"order_tables/{data['photo']}.jpg"
        )
        
    await bot.send_message(message.chat.id, "Поздравляем! Вы стали обладателем именной таблички для игры в мафию в нашем клубе! С вами свяжется наш администратор для оплаты данной услуги")
    await state.finish()

# Запуск бота
if __name__ == '__main__':
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)