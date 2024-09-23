from rest_framework import serializers
from .models import City, District, Level, Role, Game, Peculiarity, CustomUser, Participant
from django.core.cache import cache

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    is_booking = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = '__all__'
    
    def get_is_booking(self, obj):
        user = self.context.get('user')
        if user:
            return Participant.objects.filter(user=user, game=obj).exists()
        return False
        
class PeculiaritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Peculiarity
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField()
    number_of_games = serializers.SerializerMethodField()
    number_of_victories = serializers.SerializerMethodField()
    trust_level = serializers.SerializerMethodField()
    best_roles = serializers.SerializerMethodField()
    completed_games_for_mafia = serializers.SerializerMethodField()
    completed_games_for_civilian = serializers.SerializerMethodField()
    completed_games_for_werewolf = serializers.SerializerMethodField()
    points_per_game_on_average = serializers.SerializerMethodField()
    points_per_month = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 
                  'first_name', 'avatar', 
                  'sex', 'phone', 'city', 
                  'district', 'nickname', 'date_joined',
                  'level', 'is_registered', 'points',
                  'number_of_games', 'number_of_victories', 
                  'trust_level', 'best_roles', 'referral_code', 'referral_code',
                  'completed_games_for_mafia',
                  'completed_games_for_civilian',
                  'completed_games_for_werewolf',
                  'points_per_game_on_average', 'points_per_month']
        
    def get_level(self, obj):
        return obj.level.name

    def get_number_of_games(self, obj):
        return cache.get(f"number_of_games_{obj.username}", 0)
    
    def get_number_of_victories(self, obj):
        return cache.get(f"number_of_victories_{obj.username}", 0)
    
    def get_trust_level(self, obj):
        return cache.get(f"trust_level_{obj.username}", 0)
    
    def get_best_roles(self, obj):
        return cache.get(f"best_roles_{obj.username}", None) # [["Хакер", "2 победы", "👋🏿"], ["Хакер", "2 победы", "👋🏿"], ["Хакер", "2 победы", "👋🏿"]]
    
    def get_completed_games_for_mafia(self, obj):
        return cache.get(f"completed_games_for_mafia_{obj.username}", 0)
    
    def get_completed_games_for_civilian(self, obj):
        return cache.get(f"completed_games_for_civilian_{obj.username}", 0)
    
    def get_completed_games_for_werewolf(self, obj):
        return cache.get(f"completed_games_for_werewolf_{obj.username}", 0)
    
    def get_points_per_game_on_average(self, obj):
        return cache.get(f"points_per_game_on_average_{obj.username}", 0)
    
    def get_points_per_month(self, obj):
        return cache.get(f"points_per_month_{obj.username}", 0)
    
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'