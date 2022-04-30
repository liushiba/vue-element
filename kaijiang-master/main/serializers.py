# -*- coding: utf-8 -*-
# @Author: June
# @Time : 2020/1/20
from main.models import Rec, Member, Item
from django.contrib.auth import get_user_model
from rest_framework import serializers


class AdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ("id", "username", "is_superuser", "last_login", "password", "role")
        extra_kwargs = {
            "password": {'write_only': True}
        }


class RecSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rec
        fields = "__all__"
        extra_kwargs = {'ip': {'read_only': True},
                        'period': {'read_only': True},
                        "open_time": {'read_only': True},
                        }


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"

