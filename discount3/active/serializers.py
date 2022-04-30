#!/usr/bin/python
# -*- coding: utf-8 -*-
# @Author: June
# @Time : 2019/3/12
from .models import SiteAdmin, Record, Item, Resource
from django.contrib.auth import get_user_model
from rest_framework import serializers


class AdminSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ("id", "username", "is_superuser", "last_login", "password", "role", "game")
        extra_kwargs = {
            "password": {'write_only': True}
        }


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
        extra_kwargs = {
            "created_at": {'read_only': True},
            "updated_at": {'read_only': True},
            # "image_url": {'read_only': True}
        }


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = "__all__"


class RecordCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ("account", "activity", "data", "message", "apply_time", "status")
        extra_kwargs = {
            "data": {'write_only': True},
            "message": {'read_only': True},
            "apply_time": {'read_only': True},
            "status": {'read_only': True},
        }
