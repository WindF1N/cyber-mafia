from django.core.cache import cache

async def update_messages(bot, chat_id, msgs):
    # Получаем идентификаторы сообщений из Redis
    message_ids = cache.get(f'user_{chat_id}_message_ids')
    # Удаляем предыдущие сообщения из Redis
    if message_ids:
        for msg_id in message_ids:
            try:
                await bot.delete_message(chat_id=chat_id, message_id=msg_id)
            except:
                pass
    # Сохраняем идентификаторы сообщений в Redis
    cache.set(f'user_{chat_id}_message_ids', msgs)