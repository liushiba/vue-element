from django.test import TestCase
import json
# Create your tests here.
from datetime import datetime, timedelta
import redis
from django_redis import get_redis_connection
# def allow():
#     user_name = 'june'
#     activity = '活动一'
#     period = 1*24*60*60
#     now = datetime.today()
#     monday = now-timedelta(days=now.weekday())
#     month = datetime(now.year, now.month, 1).timestamp()
#     year = datetime(now.year, 1, 1).timestamp()
#     day = datetime(now.year, now.month, now.day).timestamp()
#     week = datetime(monday.year, monday.month, monday.day).timestamp()
#     coon = get_redis_connection('default')
#     key = 'hist:%s:%s' % (user_name, activity)
#     now_ts = int(datetime.today().timestamp()*1000)
#     ans = coon.zadd(key, {now_ts: now_ts})
#     print('ans', ans)
#     a = coon.zcount(key, day*1000, now_ts)
#     print(a)
import time
start = time.clock()
a = [{'name': '②电子游戏', 'activities': [{'id': 11, 'alias': 'one', 'title': '凡人歌访问服务而', 'imageUrl': '/static/media/00efb52a1b.jpg'}, {'id': 14, 'alias': 'game1', 'title': '哈哈哈哈', 'imageUrl': '/static/media/e851da6030.jpg'}]},
     {'name': '③视讯风云', 'activities': [{'id': 12, 'alias': 'hezi2', 'title': '百家乐对子和局赢战1888', 'imageUrl': '/static/media/72061c71de.jpg'}]},
     {'name': '①电子英雄联盟', 'activities': [{'id': 13, 'alias': 'aaa', 'title': '捕鱼--特殊武器Bonus', 'imageUrl': '/static/media/6a31169b19.jpg'}]}]
context = sorted(context, key=lambda x:x['name'])
print(b)
elapsed = (time.clock() - start)
print(elapsed)
# a = "会员账号,注单编号,娱乐平台"
# b = a.split(',')
# for index, i in enumerate(b):
#     print(index, i)
# print('aaa'+str(2))