from django.db import models
from django.contrib.auth.models import AbstractUser

class City(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"
    
class Event(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название")
    image = models.ImageField(upload_to='events/', verbose_name="Изображение")
    description = models.TextField(verbose_name="Описание")
    city = models.ForeignKey(City, related_name='events', on_delete=models.CASCADE, verbose_name="Город")
    max_players = models.PositiveIntegerField(verbose_name="Максимальное количество игроков")
    current_players = models.PositiveIntegerField(default=0, verbose_name="Текущее количество игроков")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Мероприятие"
        verbose_name_plural = "Мероприятия"

class CustomUser(AbstractUser):
    game_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="Игровое имя")
    city = models.ForeignKey('City', related_name='users', blank=True, null=True, on_delete=models.SET_NULL, verbose_name="Город")
    main_city = models.ForeignKey('City', related_name='main_users', blank=True, null=True, on_delete=models.SET_NULL, verbose_name="Основной город")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Аватар")
    games_played = models.PositiveIntegerField(default=0, verbose_name="Количество сыгранных игр")
    points_earned = models.PositiveIntegerField(default=0, verbose_name="Заработанные очки")
    games_played_this_month = models.PositiveIntegerField(default=0, verbose_name="Количество сыгранных игр в этом месяце")
    game_evenings_this_month = models.PositiveIntegerField(default=0, verbose_name="Количество игровых вечеров в этом месяце")
    is_registered = models.BooleanField(default=False, verbose_name="Зарегистрирован")

    def save(self, *args, **kwargs):
        if self.avatar and self.phone and self.city:
            self.is_registered = True
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
    
class Participant(models.Model):
    user = models.ForeignKey(CustomUser, related_name='participations', on_delete=models.CASCADE, verbose_name="Пользователь")
    event = models.ForeignKey(Event, related_name='participants', on_delete=models.CASCADE, verbose_name="Мероприятие")
    friends_count = models.PositiveIntegerField(default=0, verbose_name="Количество друзей")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        unique_together = ('user', 'event')
        verbose_name = "Участник"
        verbose_name_plural = "Участники"

    def __str__(self):
        return f"{self.user.username} на {self.event.name}"
    
class Order(models.Model):
    user = models.ForeignKey(CustomUser, related_name='orders', on_delete=models.CASCADE, verbose_name="Пользователь")
    event_type = models.CharField(max_length=255, verbose_name="Тип мероприятия")
    date = models.CharField(max_length=255, verbose_name="Дата")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    def __str__(self):
        return f"Заказ на мероприятие #{self.id} от {self.user.username}"

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
    
class OrderTable(models.Model):
    user = models.ForeignKey(CustomUser, related_name='order_tables', on_delete=models.CASCADE, verbose_name="Пользователь")
    game_name = models.CharField(max_length=255, verbose_name="Игровое имя")
    real_name = models.CharField(max_length=255, verbose_name="Настоящее имя")
    photo = models.ImageField(upload_to='order_tables/', verbose_name="Фото")  # Сохранение фото в директорию media/order_tables/
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    def __str__(self):
        return f"Заказ таблички #{self.id} от {self.user.username}"

    class Meta:
        verbose_name = "Заказ таблички"
        verbose_name_plural = "Заказы табличек"