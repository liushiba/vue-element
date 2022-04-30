from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class SiteAdmin(AbstractUser):
    """
    网站管理员
    """
    role = models.CharField('权限', max_length=64, default='')

    def __str__(self):
        return str(self.username)


class Member(models.Model):
    """会员"""
    name = models.CharField("会员名称", max_length=64)
    create_time = models.DateTimeField("导入时间", auto_now_add=True)
    period = models.SmallIntegerField("期数")
    times = models.SmallIntegerField("次数", default=1)  # 初始为一期一次


class Rec(models.Model):
    """投注记录"""
    user = models.CharField("会员名称", max_length=64)
    period = models.SmallIntegerField("期数")
    number = models.SmallIntegerField("号码")
    status = models.BooleanField("状态", default=False)
    bonus = models.IntegerField("彩金", default=0)
    create_time = models.DateTimeField("投注时间", auto_now_add=True)
    open_time = models.DateTimeField("开奖时间", blank=True, null=True)
    ip = models.GenericIPAddressField("ip")


class Item(models.Model):
    """期数"""
    period = models.SmallIntegerField("期数")
    number = models.SmallIntegerField("号码", default=0)
    money = models.IntegerField("奖金", default=0)
    status = models.BooleanField("是否开奖", default=False)
    start_time = models.DateTimeField("开始时间")
    end_time = models.DateTimeField("结束时间")
