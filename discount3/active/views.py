from .serializers import ItemSerializer, RecordSerializer, RecordCustomerSerializer, AdminSerializer, ResourceSerializer
from .models import SiteAdmin, Item, Record, Resource
from rest_framework import viewsets
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from utils.permission import IsSuperUser
from django_filters import rest_framework
from django.http.response import JsonResponse, HttpResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions, authentication
from django.contrib.auth.hashers import make_password
from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import render
from PIL import Image, ImageDraw, ImageFont
from django.utils.six import BytesIO
import random
from rest_framework.views import APIView


class IndexView(APIView):
    def get(self,request):
        if 'HTTP_X_FORWARDED_FOR' in request.META.keys():
            ip = request.META['HTTP_X_FORWARDED_FOR'].split(',')[0]
        elif 'HTTP_CF_CONNECTING_IP' in request.META.keys():
            ip = request.META['HTTP_CF_CONNECTING_IP']
        else:
            ip = request.META['REMOTE_ADDR']
        if request.user_agent.is_mobile:
            template = "wap.html"
        else:
            template = "index.html"
        # navs = Resource.objects.filter(category="导航栏").order_by("weight")
        # suspends = Resource.objects.filter(category="侧导航").order_by("weight")
        # carousels = Resource.objects.filter(category="轮播图").order_by("weight")
        # news = Resource.objects.filter(category="最新优惠").order_by("weight")
        # hots = Resource.objects.filter(category="热门游戏").order_by("weight")
        # items = Item.objects.all().order_by('-weight')
        # queryitems = Item.objects.filter(is_open=True)
        # categorys = Item.objects.values('category').distinct()
        # context = []
        # context1 = []
        # for category in categorys:
        #     context.append({
        #         'name': category['category'] or '9其他',
        #         'activities': [{'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url} for i in
        #                        items.filter(category=category['category'], is_show=True)]
        #     })
        # context = sorted(context, key=lambda x: x['name'])
        # context1.append({
        #     'name': '最新优惠',
        #     'activities': [
        #         {'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url} for i in
        #         items.filter(is_new=True, is_show=True)
        #     ]
        # })
        # limit = {
        #     1: '每日可申请',
        #     2: '每周可申请',
        #     3: '每月可申请'
        # }
        # for j in range(1,4):
        #     context1.append({
        #         'limit': limit[j],
        #         'activities': [
        #             {'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url} for i in
        #             items.filter(limit_type=j, is_show=True)
        #         ]
        #     })
        # context2 = [
        #         {'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url} for i in
        #         items.filter(is_show=True)
        #     ]
        return render(request, template, locals())


class AdminViewSet(viewsets.ModelViewSet):
    permission_classes = (IsSuperUser,)
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

class ItemViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = ItemSerializer
    queryset = Item.objects.all().order_by('id')
    filter_backends = (rest_framework.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter,)
    filterset_fields = ('id',)
    ordering_fields = ('id',)

    def list(self, request, *args, **kwargs):
        if request.query_params.get('type', None):
            items = Item.objects.all().order_by('-weight')
            context = [{
                "name": '全部',
                'activities': [
                    {'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url, 'weight': i.weight} for i in
                    items
                ]
            }]
            # categorys = Item.objects.values('category').distinct()
            # context = []
            # context.append({
            #     'name': '最新',
            #     'activities': [
            #         {'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url, 'weight': i.weight} for i in
            #         items.filter(is_new=True, is_show=True)
            #     ]
            # })
            # limit = {
            #     1: '每日',
            #     2: '每周',
            #     3: '每月'
            # }
            # for j in range(1, 4):
            #     context.append({
            #         'name': limit[j],
            #         'activities': [
            #             {'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url, 'weight': i.weight} for i in
            #             items.filter(limit_type=j, is_show=True)
            #         ]
            #     })
            # for category in categorys:
            #     context.append({
            #         'name': category['category'] or '其他',
            #         'activities': [{'id': i.id, 'alias': i.alias, 'title': i.title, 'imageUrl': i.image_url.url, 'weight': i.weight}for i in items.filter(category=category['category'])]
            #     })
            return JsonResponse(context, safe=False)
        else:
            return super(ItemViewSet, self).list(self, request, *args, **kwargs)


class ResViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = ResourceSerializer
    queryset = Resource.objects.all().order_by('id')
    filter_backends = (rest_framework.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter,)
    filterset_fields = ('id',)
    ordering_fields = ('id',)

    def list(self, request, *args, **kwargs):
        if request.query_params.get('type', None):
            items = Resource.objects.all().order_by('weight')
            categorys = Resource.objects.values('category').distinct()
            context = []
            for category in categorys:
                context.append({
                    'name': category['category'] or '其他',
                    'texts': [{'id': i.id, 'text': i.text, 'weight': i.weight, 'url': i.url, 'img': i.img.url if i.img else ''}
                                   for i in items.filter(category=category['category'])]
                })
            return JsonResponse(context, safe=False)
        else:
            return super(ResViewSet, self).list(self, request, *args, **kwargs)


class NumberInFilter(rest_framework.BaseInFilter, rest_framework.NumberFilter):
    pass


class RecordFilter(rest_framework.FilterSet):
    stat = rest_framework.NumberFilter(field_name="status", lookup_expr='lte')
    actid__in = NumberInFilter(field_name="actid", lookup_expr='in')
    class Meta:
        model = Record
        fields = ['account', 'stat', 'status', 'activity', 'actid__in', 'actid']


class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all().order_by('id')
    filter_backends = (rest_framework.DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter,)
    filterset_class = RecordFilter
    ordering_fields = ('id', 'status')

    def destroy(self, request, *args, **kwargs):
        if self.kwargs[self.lookup_field] == 'all':
            Record.objects.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        if self.kwargs[self.lookup_field] == 'bulk':
            Record.objects.filter(id__in=request.data).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return super(RecordViewSet, self).destroy(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return RecordSerializer
        else:
            return RecordCustomerSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        flag = request.data.get('status', None)
        if flag is None:
            return super(RecordViewSet, self).partial_update(request, *args, **kwargs)
        else:
            if flag == 1 and instance.status in [2, 3]:
                serializer = self.get_serializer(instance, {"status": 1}, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({"code": 3})  # 重新审核
            if flag == 2 and instance.status == 1:
                serializer = self.get_serializer(instance, {"status": 2, "auditor": request.user.username}, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({"code": 1})  # 锁定成功
            elif flag in [3, 4] and instance.auditor == request.user.username:
                serializer = self.get_serializer(instance, {'reply_time': timezone.now(), **request.data}, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({"code": 2})  # 派送成功
            else:
                return Response({"code": 0})

    def get_queryset(self):
        if self.request.query_params.get('model', None):
            if self.request.user.is_superuser:
                return super(RecordViewSet, self).get_queryset()
            if self.request.user.game:
                items = self.request.user.game.split('|')
                items = [int(i) for i in items]
            else:
                items = []
            return self.queryset.filter(actid__in=items)
        else:
            return super(RecordViewSet, self).get_queryset()


class ActiveView(APIView):
    def get(self, request):
        activities = Item.objects.filter(is_show=True)
        data = []
        for activity in activities:
            data.append({
                "ClassRemark": activity.image_url.url,
                "InfoList": (activity.submit_forms+',').replace(",", "|1,"),
                "T_ProClassID": activity.id,
                "T_ProClassKey": activity.content_table,
                "T_ProClassName": activity.title
            })
        return JsonResponse(data, safe=False)

    def post(self, request):
        PostInfo = request.POST.get("PostInfo", None)
        pid = request.POST.get("pid", None)
        UserNo = request.POST.get("UserNo", None)
        # Xz = request.POST.get("Xz", None)
        if 'HTTP_X_FORWARDED_FOR' in request.META.values():
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
        try:
            item = Item.objects.get(id=pid)
        except Item.DoesNotExist:
            return JsonResponse({"code": 3, "error": "请申请正确的优惠活动"})
        # 是否开启申请
        if not item.is_open:
            return JsonResponse({"code": 4, "error": "活动未开启申请"}, status=status.HTTP_200_OK)
        # 是否在申请时间
        now = datetime.now()
        if now.time() > item.valid_day_end or now.time() < item.valid_day_start or now > item.valid_date_end or now < item.valid_date_start:
            return JsonResponse({"code": 5, "error": "不在在申请时间内"})
        # 申请信息解析
        post_data = request.POST
        # forms = item.submit_forms.split(',')
        # if "图片" in forms:
        #     forms.remove("图片")
        #     data = "|".join([form + ":" + post_data["data" + str(index)] for index, form in enumerate(forms)])
        #     img = request.FILES.get("image", None)
        #     if img is not None:
        #         ext = img.name.split('.')[-1]
        #         img_name = post_data["data0"]+str(int(time.time()))+'.'+ext
        #         img_path = settings.MEDIA_ROOT+img_name
        #         with open(img_path, 'wb') as f:
        #             for c in img:
        #                 f.write(c)
        #         data = data + "|图片:<img src='" + settings.MEDIA_URL + img_name+"' height:'500' width:'1000'>"
        #     else:
        #         return JsonResponse({'code': 8, 'error': '请上传图片'})
        # else:
        #     data = "|".join([form + ":" + post_data["data" + str(index)] for index, form in enumerate(forms)])
        # 次数检测
        now = datetime.today()
        monday = now - timedelta(days=now.weekday())
        day = datetime(now.year, now.month, now.day)
        week = datetime(monday.year, monday.month, monday.day)
        month = datetime(now.year, now.month, 1)
        year = datetime(now.year, 1, 1)
        timetype = [day, week, month, year]
        count = Record.objects.filter(account=UserNo, activity=item.title, apply_time__gte=timetype[item.limit_type-1]).count()
        if count >= item.limit_number:
            return JsonResponse({"code": 6, "error": "超出申请限制"})
        # 提交
        Record(
            account=UserNo,
            activity=item.title,
            data=PostInfo,
            ip=ip,
            actid=item.id
        ).save()
        return HttpResponse("ok")


# class ActiveView(APIView):
#     def get(self, request, alias):
#         if 'HTTP_X_FORWARDED_FOR' in request.META.keys():
#             ip = request.META['HTTP_X_FORWARDED_FOR'].split(',')[0]
#         elif 'HTTP_CF_CONNECTING_IP' in request.META.keys():
#             ip = request.META['HTTP_CF_CONNECTING_IP']
#         else:
#             ip = request.META['REMOTE_ADDR']
#         if request.user_agent.is_mobile:
#             template = "huodong.html"
#         else:
#             template = "active.html"
#         try:
#             activity = Item.objects.get(alias=alias)
#         except Exception as e:
#             print(e)
#             return HttpResponseRedirect('/')
#         activity.content_articles = activity.content_articles.split('|')
#         activity.submit_forms = activity.submit_forms.split(',') if activity.submit_forms else None
#         items = Item.objects.all()
#         navs = Resource.objects.filter(category="导航栏").order_by("weight")
#         suspends = Resource.objects.filter(category="侧导航").order_by("weight")
#         return render(request, template, locals())
#
#     def post(self, request, alias):
#         code = request.POST["note"]
#         if not code.lower() == request.session['verifycode'].lower():
#             return JsonResponse({'code': 8, 'error': '验证码不正确'})
#         if 'HTTP_X_FORWARDED_FOR' in request.META.values():
#             ip = request.META['HTTP_X_FORWARDED_FOR']
#         else:
#             ip = request.META['REMOTE_ADDR']
#         try:
#             item = Item.objects.get(alias=alias)
#         except Item.DoesNotExist:
#             return JsonResponse({"code": 3, "error": "请申请正确的优惠活动"})
#         # 是否开启申请
#         if not item.is_open:
#             return JsonResponse({"code": 4, "error": "活动未开启申请"}, status=status.HTTP_200_OK)
#         # 是否在申请时间
#         now = datetime.now()
#         if now.time()> item.valid_day_end or now.time()<item.valid_day_start or now>item.valid_date_end or now< item.valid_date_start:
#             return JsonResponse({"code": 5, "error": "不在在申请时间内"})
#         # 申请信息解析
#         post_data = request.POST
#         forms = item.submit_forms.split(',')
#         if "图片" in forms:
#             forms.remove("图片")
#             data = "|".join([form + ":" + post_data["data" + str(index)] for index, form in enumerate(forms)])
#             img = request.FILES.get("image", None)
#             if img is not None:
#                 ext = img.name.split('.')[-1]
#                 img_name = post_data["data0"]+str(int(time.time()))+'.'+ext
#                 img_path = settings.MEDIA_ROOT+img_name
#                 with open(img_path, 'wb') as f:
#                     for c in img:
#                         f.write(c)
#                 data = data + "|图片:<img src='" + settings.MEDIA_URL + img_name+"' height:'500' width:'1000'>"
#             else:
#                 return JsonResponse({'code': 8, 'error': '请上传图片'})
#         else:
#             data = "|".join([form + ":" + post_data["data" + str(index)] for index, form in enumerate(forms)])
#         # 次数检测
#         now = datetime.today()
#         monday = now - timedelta(days=now.weekday())
#         day = datetime(now.year, now.month, now.day)
#         week = datetime(monday.year, monday.month, monday.day)
#         month = datetime(now.year, now.month, 1)
#         year = datetime(now.year, 1, 1)
#         timetype = [day, week, month, year]
#         count = Record.objects.filter(account=post_data["data0"], activity=item.title, apply_time__gte=timetype[item.limit_type-1]).count()
#         if count >= item.limit_number:
#             return JsonResponse({"code": 6, "error": "超出申请限制"})
#         # 提交
#         Record(
#             account=post_data["data0"],
#             activity=item.title,
#             data=data,
#             ip=ip,
#             actid=item.id
#         ).save()
#         return JsonResponse({"code": 7})


class FreshView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        """
        :param request:cursor客户端的最新id, 0表示客户端数据为空
        :return: 最新id
        """
        cursor = request.GET.get("cursor", None)
        if cursor is None:
            try:
                new_id = Record.objects.last().id
            except Record.DoesNotExist:
                new_id = 0
            except AttributeError:
                new_id = 0
            return JsonResponse({"id": new_id}, status=status.HTTP_200_OK, safe=False)
        else:
            if self.request.user.game:
                items = self.request.user.game.split('|')
                items = [int(i) for i in items]
            else:
                items = []
            new_records = Record.objects.filter(id__gt=int(cursor), actid__in=items)
            if new_records.exists():
                return JsonResponse({
                    "id": new_records.last().id,
                    "newRecs": [{"id": rec.id, "account": rec.account, "activity": rec.activity} for rec in new_records]
                })
            else:
                return JsonResponse({"id": int(cursor)}, status=status.HTTP_200_OK, safe=False)


class CodeView(APIView):
    def get(self, request):
        # 定义变量，用于画面的背景色、宽、高
        bgcolor = '#3D1769'
        width = 58
        height = 25
        # 创建画面对象
        im = Image.new('RGB', (width, height), bgcolor)
        # 创建画笔对象
        draw = ImageDraw.Draw(im)
        # 调用画笔的point()函数绘制噪点
        for i in range(0, 100):
            xy = (random.randrange(0, width), random.randrange(0, height))
            fill = (random.randrange(0, 255), 255, random.randrange(0, 255))
            draw.point(xy, fill=fill)
        # 定义验证码的备选值
        str1 = 'ABCD123EFGHIJK456LMNOPQRS789TUVWXYZ0'
        # 随机选取4个值作为验证码
        rand_str = ''
        for i in range(0, 4):
            rand_str += str1[random.randrange(0, len(str1))]
        # 构造字体对象，ubuntu的字体路径为“/usr/share/fonts/truetype/freefont”
        # font = ImageFont.truetype('FreeMono.ttf', 33)  # linux
        font = ImageFont.truetype('arial.ttf', 16)  # win7的
        # 构造字体颜色
        # 选取验证码的背景颜色
        fontcolor = (255, random.randrange(0, 255), random.randrange(0, 255))
        # 绘制4个字
        draw.text((5, 4), rand_str[0], font=font, fill=fontcolor)
        draw.text((20, 4), rand_str[1], font=font, fill=fontcolor)
        draw.text((35, 4), rand_str[2], font=font, fill=fontcolor)
        draw.text((45, 4), rand_str[3], font=font, fill=fontcolor)
        # 释放画笔
        del draw
        # 存入session，用于做进一步验证
        # 存入session，用于做进一步验证
        request.session['verifycode'] = rand_str
        # 内存文件操作
        buf = BytesIO()
        # 将图片保存在内存中，文件类型为png
        im.save(buf, 'png')
        # 将内存中的图片数据返回给客户端，MIME类型为图片png
        return HttpResponse(buf.getvalue(), 'image/png')


class RecordView(APIView):
    def get(self, request, res):
        if res == "recs":
            recs = Record.objects.filter(status=3).order_by('-id')[:50]
            data = []
            for rec in recs:
                data.append({
                   "T_ProClassName": rec.activity,
                   "T_ProductName": rec.account[:2] + '***' + rec.account[-1:]
                })
            return JsonResponse(data, safe=False)
        elif res == "sliders":
            resources = Resource.objects.filter(category="轮播图")
            data = []
            for resource in resources:
                data.append({
                    "img": resource.img.url,
                    "url": resource.url
                })
            return JsonResponse(data, safe=False)
        else:
            return HttpResponse('error')