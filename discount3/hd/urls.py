"""hd URL Configuration

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
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, ObtainJSONWebToken
from active.views import AdminViewSet, ItemViewSet, RecordViewSet, ActiveView, FreshView, CodeView, ResViewSet, IndexView, RecordView
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'admins', AdminViewSet, base_name='admins')
router.register(r'items', ItemViewSet, base_name='items')
router.register(r'records', RecordViewSet, base_name='records')
router.register(r'texts', ResViewSet, base_name='res')


urlpatterns = [
    url(r'login', ObtainJSONWebToken.as_view()),
    url(r'^info$', verify_jwt_token),
    url(r'^api/admin$', TemplateView.as_view(template_name="admin.html"), name="index"),
    url(r'^api/verifycode/$', CodeView.as_view(), name='verifycode'),
    url(r'^api/records/new/$', FreshView.as_view(), name='new'),
    url(r'^api/', include(router.urls)),
    url(r'^active/$', ActiveView.as_view(), name='active'),
    url(r'^resource/(?P<res>\w+)$', RecordView.as_view(), name='showRec'),
    # url(r'', TemplateView.as_view(template_name="index.html"), name="index"),
    url(r'', IndexView.as_view(), name="index")
]
