from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from main.serializers import AdminSerializer, MemberSerializer, RecSerializer, ItemSerializer
from main.models import *
from django_filters import rest_framework
from rest_framework import filters
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.db import transaction
# Create your views here.


class AdminViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = AdminSerializer
    queryset = SiteAdmin.objects.all().order_by('id')
    filter_backends = (rest_framework.DjangoFilterBackend, filters.OrderingFilter,)
    ordering_fields = ('id',)

    def perform_create(self, serializer):
        serializer.save(password=make_password(serializer.validated_data['password']), is_staff=True)

    def perform_update(self, serializer):
        print(serializer.validated_data)
        if serializer.validated_data.get('password', False):
            serializer.save(password=make_password(serializer.validated_data['password']))
        else:
            serializer.save()


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecSerializer
    queryset = Rec.objects.all().order_by('id')

    def get_permissions(self):
        if self.action in ['create', 'list']:
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        if self.kwargs[self.lookup_field] == 'all':
            Rec.objects.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        if self.kwargs[self.lookup_field] == 'bulk':
            Rec.objects.filter(id__in=request.data).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return super(RecordViewSet, self).destroy(request, *args, **kwargs)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'HTTP_X_FORWARDED_FOR' in self.request.META.values():
            ip = self.request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = self.request.META['REMOTE_ADDR']
        if self.request.user.is_staff:
            serializer.save(ip=ip)
        else:
            pass
            # 会员投注 todo
            # serializer.save(period=pass, ip=ip)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        if self.request.user.is_staff:
            return super(RecordViewSet, self).list(request, *args, **kwargs)
        else:
            user = request.query_params.get('user', None)
            if user is None:
                return Response({
                    "status": 0,
                    "info": "会员账号为空"
                })
            recs = Rec.objects.filter(user=user)
            return Response({
                "status": 1,
                "data": [{"phase": rec.period, "num": rec.number} for rec in recs]
            })


class MemberViewSet(viewsets.ModelViewSet):
    # permission_classes = (IsAuthenticated, )
    serializer_class = MemberSerializer
    queryset = Member.objects.all().order_by("id")
    filter_backends = (rest_framework.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter,)
    filterset_fields = ('name',)

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get('data', {}), list):
            kwargs['many'] = True
        return super().get_serializer(*args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if self.kwargs[self.lookup_field] == 'all':
            Member.objects.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return super(MemberViewSet, self).destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        #  后台批量导入
        if isinstance(serializer.validated_data, list):
            validated_data = [
                dict(list(attrs.items()))
                for attrs in serializer.validated_data
            ]
            Member.objects.bulk_create([Member(**item) for item in validated_data])
        else:
            serializer.save()

    def list(self, request, *args, **kwargs):
        if self.request.user.is_staff:
            return super(MemberViewSet, self).list(request, *args, **kwargs)
        else:
            #  登录
            name = request.query_params.get('name', None)
            if name is None:
                return Response({
                    "status": 0,
                    "info": "请填写会员账号"
                })
            members = Member.objects.filter(name=name, period=2)
            if members:
                return Response({
                    "status": 1,
                    "info": "登录成功!"
                })
            else:
                return Response({
                    "status":0,
                    "info": "登录失败！"
                })


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all().order_by('-period')

    def partial_update(self, request, *args, **kwargs):
        money = request.data.get("money", None)
        number = request.data.get("number", None)
        if money and number:
            # 每期开奖处理 todo
            # Rec.objects.filter(number=number, period=pass).update(bonus=money, status=pass)
            instance = self.get_object()
            serializer = self.get_serializer(instance, {"status": True}, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            return super(ItemViewSet, self).partial_update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        if self.request.user.is_staff:
            return super(ItemViewSet, self).list(request, *args, **kwargs)
        else:
            items = Item.objects.filter(status=True)
            pass  # todo 前端期数查询

