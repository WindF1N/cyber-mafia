from django.db import models
from django.contrib.auth.models import AbstractUser

class City(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название")
    name_in_prepositional_case = models.CharField(max_length=255, unique=True, verbose_name="Название в предложном падеже")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Город"
        verbose_name_plural = "Города"

class District(models.Model):
    city = models.ForeignKey(City, related_name='districts', on_delete=models.CASCADE, verbose_name="Город")
    name = models.CharField(max_length=255, unique=True, verbose_name="Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Район"
        verbose_name_plural = "Районы"

class Level(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название")
    need_victories = models.PositiveIntegerField(verbose_name="Необходимое количество побед")

    def __str__(self):
        return f"Уровень: {self.name}"

    class Meta:
        verbose_name = "Уровень игрока"
        verbose_name_plural = "Уровни игроков"

class Role(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Название")

    def __str__(self):
        return f"Роль: {self.name}"

    class Meta:
        verbose_name = "Роль игрока"
        verbose_name_plural = "Роли игроков"
    
class Game(models.Model):
    city = models.ForeignKey(City, related_name='games', on_delete=models.CASCADE, verbose_name="Город")
    image = models.ImageField(upload_to='games/', verbose_name="Изображение")
    datetime = models.DateTimeField(verbose_name="Дата и время")
    address = models.CharField(max_length=255, verbose_name="Место проведения")
    small_address = models.CharField(max_length=255, verbose_name="Место проведения (кратко)")
    theme = models.CharField(max_length=255, verbose_name="Тема")
    difficulty_level = models.CharField(max_length=255, verbose_name="Уровень сложности")
    duration = models.CharField(max_length=255, verbose_name="Продолжительность")
    max_players = models.PositiveIntegerField(verbose_name="Максимальное количество игроков")
    available_roles = models.ManyToManyField(Role, related_name='games', verbose_name="Доступные роли")

    # max_players = models.PositiveIntegerField(verbose_name="Максимальное количество игроков")
    # current_players = models.PositiveIntegerField(default=0, verbose_name="Текущее количество игроков")

    def __str__(self):
        return f"{self.small_address} {self.datetime.date()}"

    class Meta:
        verbose_name = "Игра"
        verbose_name_plural = "Игры"

class Peculiarity(models.Model):
    game = models.ForeignKey(Game, related_name='peculiarities', on_delete=models.CASCADE, verbose_name="Игра")
    label = models.CharField(max_length=255, verbose_name="Ключ")
    value = models.CharField(max_length=255, verbose_name="Значение")

    def __str__(self):
        return f"{self.label}: {self.value}"

    class Meta:
        verbose_name = "Особенность игры"
        verbose_name_plural = "Особенности игр"

class CustomUser(AbstractUser):
    SEX_CHOICES = (
        ('male', 'Мужской'),
        ('female', 'Женский')
    )
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Аватар")
    sex = models.CharField(max_length=255, choices=SEX_CHOICES, blank=True, null=True, verbose_name="Пол")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    city = models.ForeignKey('City', related_name='users', blank=True, null=True, on_delete=models.SET_NULL, verbose_name="Город")
    district = models.ForeignKey('District', related_name='users', blank=True, null=True, on_delete=models.SET_NULL, verbose_name="Район")
    nickname = models.CharField(max_length=255, blank=True, null=True, verbose_name="Никнейм")
    level = models.ForeignKey('Level', related_name='users', blank=True, null=True, on_delete=models.SET_NULL, verbose_name="Уровень")
    is_registered = models.BooleanField(default=False, verbose_name="Зарегистрирован")

    # games_played = models.PositiveIntegerField(default=0, verbose_name="Количество сыгранных игр")
    # games_won = models.PositiveIntegerField(default=0, verbose_name="Количество выйграных игр")
    # level_of_trust = models.PositiveIntegerField(default=0, verbose_name="Уровень доверия")
    # best_roles - Лучшие роли
    # activity - Активность

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
    user = models.ForeignKey('CustomUser', related_name='participations', on_delete=models.CASCADE, verbose_name="Пользователь")
    game = models.ForeignKey('Game', related_name='participants', on_delete=models.CASCADE, verbose_name="Игра")
    role = models.ForeignKey('Role', related_name='participants', null=True, blank=True, on_delete=models.CASCADE, verbose_name="Роль")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        unique_together = ('user', 'game')
        verbose_name = "Участник"
        verbose_name_plural = "Участники"

    def __str__(self):
        return f"{self.user.username} на {self.event.name}"
    