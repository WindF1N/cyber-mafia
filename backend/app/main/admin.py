from django.contrib import admin
from .models import CustomUser, City, Event, Participant, Order, OrderTable

# Регистрация модели Event
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'current_players', 'max_players')  # Поля, которые будут отображаться в списке городов
    search_fields = ('name', 'city')  # Поля, по которым можно выполнять поиск

# Регистрация модели City
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Поля, которые будут отображаться в списке городов
    search_fields = ('name',)  # Поля, по которым можно выполнять поиск

# Регистрация модели CustomUser
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'city', 'main_city', 'phone', 'avatar')  # Поля, которые будут отображаться в списке пользователей
    list_filter = ('city', 'main_city')  # Поля, по которым можно фильтровать пользователей
    search_fields = ('username', 'first_name', 'last_name', 'email')  # Поля, по которым можно выполнять поиск
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
        ('Additional info', {
            'fields': ('city', 'main_city', 'phone', 'avatar', 'games_played', 'points_earned', 'games_played_this_month', 'game_evenings_this_month', 'is_registered')
        }),
    )

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'friends_count', 'created_at')
    list_filter = ('event', 'created_at')
    search_fields = ('user__username', 'event__name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event_type', 'date', 'comment', 'created_at')
    list_filter = ('event_type', 'date', 'created_at')
    search_fields = ('user__username', 'event_type', 'comment')

# Регистрация модели OrderTable
@admin.register(OrderTable)
class OrderTableAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'game_name', 'real_name', 'photo', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'game_name', 'real_name')