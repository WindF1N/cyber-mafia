from django.contrib import admin
from django.urls import path, include
from main.views import (
    TelegramAuthView, AccountInfoView, CitiesView, DistrictsView, MessagesView, UsersView
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include(router.urls)),
    path('auth/telegram/', TelegramAuthView.as_view(), name='telegram_auth'),
    path('user/', AccountInfoView.as_view(), name='account_info'),
    path('users/', UsersView.as_view(), name='users'),
    path('cities/', CitiesView.as_view(), name='cities'),
    path('districts/', DistrictsView.as_view(), name='districts'),
    path('get_messages/', MessagesView.as_view(), name='get_messages'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)