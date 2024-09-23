from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
import jwt
import urllib.parse
import hmac
import hashlib
from django.conf import settings
from django.core.cache import cache
from django.db.models import Q
from django.utils import timezone
import json
import traceback
import string
import random
from .serializers import (
    CustomUserSerializer, CitySerializer, DistrictSerializer, LevelSerializer, GameSerializer
)
from .models import City, District, Game, Participant

User = get_user_model()

class TelegramAuthView(APIView):
    def post(self, request):
        try:
            init_data = urllib.parse.parse_qs(json.loads(request.body)['initData'])
            if self.verify_telegram_init_data(init_data):
                user_data = self.extract_user_data(init_data)
                user, created = User.objects.get_or_create(username=str(user_data['telegram_id']))
                user.referral_code = self.generate_referral_code()
                user.save()
                # Добавляем персонажа с типом standart
                if created:
                    if 'start_param' in init_data:
                        try:
                            referred_user = User.objects.get(referral_code=init_data['start_param'][0])
                            user.referred_by = referred_user
                            user.save()
                            referred_user.points += 50
                            referred_user.save()
                        except:
                            pass
                payload = {
                    'user_id': user.id,
                    'telegram_id': str(user_data['telegram_id']),
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                return Response({'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid init data'}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def verify_telegram_init_data(self, parsed_data):
        try:
            hash_ = parsed_data['hash'][0]
            data_check_string = '\n'.join(f'{key}={value[0]}' for key, value in sorted(parsed_data.items()) if key != 'hash')
            secret_key = hmac.new(b'WebAppData', settings.TELEGRAM_BOT_TOKEN.encode(), hashlib.sha256).digest()
            calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
            return hmac.compare_digest(calculated_hash, hash_)
        except:
            traceback.print_exc()
            return False

    def extract_user_data(self, init_data):
        user_data = init_data['user'][0]
        user_dict = json.loads(user_data.replace('true', 'true').replace('false', 'false').replace('null', 'null'))
        return {
            'telegram_id': user_dict['id']
        }
    
    def generate_referral_code(self):
        characters = string.ascii_letters + string.digits
        while True:
            code = ''.join(random.choice(characters) for _ in range(6))
            if not User.objects.filter(referral_code=code).exists():
                return code
            
class AccountInfoView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        userId = request.GET.get("userId")
        if userId:
            try:
                user = User.objects.get(id=userId)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        account_info = {
            'user': CustomUserSerializer(user).data,
            'city': CitySerializer(user.city).data if user.city else None,
            'district': DistrictSerializer(user.district).data if user.district else None,
            'level': LevelSerializer(user.level).data if user.level else None,
        }
        return Response(account_info, status=status.HTTP_200_OK)
    
    def post(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        sex = request.data.get('sex')
        if sex not in ['male', 'female']:
            return Response({'error': 'Invalid sex'}, status=status.HTTP_400_BAD_REQUEST)
        first_name = request.data.get('first_name', "")
        if first_name == "":
            return Response({'error': 'Invalid first_name'}, status=status.HTTP_400_BAD_REQUEST)
        phone = request.data.get('phone', "")
        if phone == "":
            return Response({'error': 'Invalid phone'}, status=status.HTTP_400_BAD_REQUEST)
        nickname = request.data.get('nickname', "")
        if nickname == "":
            return Response({'error': 'Invalid nickname'}, status=status.HTTP_400_BAD_REQUEST)
        city_id = request.data.get('city_id', "")
        if city_id == "":
            return Response({'error': 'Invalid city_id'}, status=status.HTTP_400_BAD_REQUEST)
        district_id = request.data.get('district_id', "")
        if district_id == "":
            return Response({'error': 'Invalid district_id'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            city = City.objects.get(id=city_id)
        except City.DoesNotExist:
            return Response({'error': 'Invalid city_id'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            district = District.objects.get(id=district_id)
        except District.DoesNotExist:
            return Response({'error': 'Invalid district_id'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.sex = sex
        user.first_name = first_name
        user.phone = phone
        user.nickname = nickname
        user.city = city
        user.district = district
        user.save()
        
        return Response({
            'user': CustomUserSerializer(user).data,
            'city': CitySerializer(user.city).data if user.city else None,
            'district': DistrictSerializer(user.district).data if user.district else None,
            'level': LevelSerializer(user.level).data if user.level else None,
        }, status=status.HTTP_200_OK)
 
class CitiesView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cities = City.objects.all()
        cities_serializer = CitySerializer(cities, many=True)
       
        return Response({
            'cities': cities_serializer.data,
        }, status=status.HTTP_200_OK)
 
class DistrictsView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            city = City.objects.get(id=request.GET.get('city_id'))
        except City.DoesNotExist:
            return Response({'error': 'City not found'}, status=status.HTTP_404_NOT_FOUND)
        
        districts = District.objects.filter(city=city)
        districts_serializer = DistrictSerializer(districts, many=True)
       
        return Response({
            'districts': districts_serializer.data,
        }, status=status.HTTP_200_OK)
 
class MessagesView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        messages = []
        keys = cache.keys(f'message_{user.username}_*')
        if keys:
            for key in keys:
                message = cache.get(key)
                messages.append(message)
                cache.delete(key)
        return Response({'messages': messages}, status=status.HTTP_200_OK)
    
class UsersView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Извлекаем параметры limit, offset и search из запроса
        limit = int(request.query_params.get('limit', 5))
        offset = int(request.query_params.get('offset', 0))
        search = request.query_params.get('search', '')

        # Фильтруем пользователей по городу, исключая текущего пользователя
        users_query = User.objects.filter(city=user.city).exclude(id=user.id)

        # Применяем фильтр поиска, если параметр search задан
        if search:
            users_query = users_query.filter(
                Q(first_name__icontains=search) | Q(nickname__icontains=search)
            )

        # Применяем пагинацию
        users = users_query[offset:offset+limit]
        users_serializer = CustomUserSerializer(users, many=True)
       
        return Response({
            'users': users_serializer.data,
            'total': users_query.count()
        }, status=status.HTTP_200_OK)
    
class FriendsView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Извлекаем параметры limit, offset и search из запроса
        limit = int(request.query_params.get('limit', 5))
        offset = int(request.query_params.get('offset', 0))

        # Фильтруем пользователей по городу, исключая текущего пользователя
        users_query = User.objects.filter(referred_by=user)

        # Применяем пагинацию
        users = users_query[offset:offset+limit]
        users_serializer = CustomUserSerializer(users, many=True)
       
        return Response({
            'users': users_serializer.data,
            'total': users_query.count()
        }, status=status.HTTP_200_OK)
    

class PostersView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Извлекаем параметры limit, offset и search из запроса
        limit = int(request.query_params.get('limit', 5))
        offset = int(request.query_params.get('offset', 0))
        city_id = request.query_params.get('city_id', '')

        try:
            city = City.objects.get(id=city_id)
        except City.DoesNotExist:
            return Response({'error': 'City not found'}, status=status.HTTP_404_NOT_FOUND)

        # Фильтруем пользователей по городу, исключая текущего пользователя
        posters_query = Game.objects.filter(city=city, datetime__gte=timezone.now())
        posters = posters_query[offset:offset+limit]
        posters_serializer = GameSerializer(posters, context={"user": user}, many=True)
       
        return Response({
            'posters': posters_serializer.data,
            'total': posters_query.count()
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        token = request.headers.get('Authorization', '').split(' ')[-1]
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        poster_id = request.data.get('poster_id')

        if not poster_id:
            return Response({'error': 'Invalid poster_id'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            poster = Game.objects.get(id=poster_id)
        except Game.DoesNotExist:
            return Response({'error': 'Invalid poster_id'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            participant = Participant.objects.get(user=user, game=poster)
            participant.delete()
            is_booking = False
        except Participant.DoesNotExist:
            participant = Participant.objects.create(user=user, game=poster)
            is_booking = True
        
        return Response({
            'is_booking': is_booking
        }, status=status.HTTP_200_OK)