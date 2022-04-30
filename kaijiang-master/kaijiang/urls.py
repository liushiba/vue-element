"""kaijiang URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from main.views import AdminViewSet, MemberViewSet, ItemViewSet, RecordViewSet
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, ObtainJSONWebToken
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='members')
router.register(r'items', ItemViewSet, basename='items')
router.register(r'users', AdminViewSet, basename='users')
router.register(r'records', RecordViewSet, basename='records')
urlpatterns = [
    url(r'^api/login$', ObtainJSONWebToken.as_view()),
    url(r'^api/info$', verify_jwt_token),
    url(r'^api/admin$', TemplateView.as_view(template_name="index.html"), name="index"),
    url(r'^api/', include(router.urls)),
    # url(r'', TemplateView.as_view(template_name="fontpage.html"), name="main"),

]
