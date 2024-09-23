from django.contrib import admin
from .models import City, District, Level, Role, Game, Peculiarity, CustomUser, Participant

# Регистрация моделей в админ-панели
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_in_prepositional_case')
    search_fields = ('name', 'name_in_prepositional_case')

@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name', 'city')
    search_fields = ('name', 'city__name')
    list_filter = ('city',)

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'need_victories')
    search_fields = ('name',)
    list_filter = ('need_victories',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('city', 'datetime', 'address', 'max_players')
    search_fields = ('city__name', 'address', 'theme')
    list_filter = ('city', 'datetime')

@admin.register(Peculiarity)
class PeculiarityAdmin(admin.ModelAdmin):
    list_display = ('game', 'label', 'value')
    search_fields = ('game__city__name', 'label', 'value')
    list_filter = ('game__city',)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'city', 'phone', 'referral_code', 'referred_by', 'is_registered')
    list_filter = ('city', 'is_registered')
    search_fields = ('username', 'first_name', 'phone')
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email', 'avatar', 'sex', 'phone', 'city', 'district', 'nickname', 'level', 'referral_code','referred_by')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
        ('Registration status', {
            'fields': ('is_registered',)
        }),
    )

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'role', 'created_at')
    list_filter = ('game', 'role', 'created_at')
    search_fields = ('user__username', 'game__city__name', 'role__name')