from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
# User = get_user_model()

# Create your models here.


class SiteAdmin(AbstractUser):
    """
    网站管理员
    """
    game = models.CharField('所管游戏', max_length=128, blank=True)
    role = models.CharField('权限', max_length=64, default='', blank=True)

    def __str__(self):
        return str(self.username)


def custom_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = '{}.{}'.format(uuid.uuid4().hex[:10], ext)
    return filename


class Item(models.Model):
    type_choices = (
        (1, '日'),
        (2, '周'),
        (3, '月'),
        (4, '年')
    )
    alias = models.CharField('英文别名', max_length=32)
    title = models.CharField('标题', max_length=32)
    is_show = models.BooleanField('展示状态', default=True)
    is_open = models.BooleanField('开启状态', default=True)
    # is_jump_blank = models.BooleanField('打开形式')
    valid_day_start = models.TimeField('日启')
    valid_day_end = models.TimeField('日结')
    limit_type = models.SmallIntegerField('限制类型', choices=type_choices, default=1)  # todo
    limit_number = models.IntegerField('限制次数', default=0)
    content_table = models.TextField('内容')
    content_desc = models.CharField('描述', max_length=256)
    content_articles = models.CharField('说明', max_length=128)  # todo
    # process_type = models.IntegerField('处理形式')  # artificial人工  'preData', 'artificial', 'noteAuto', 'customAuto'
    # process_rules = models.IntegerField('处理规则')  #
    submit_forms = models.CharField('表单形式', max_length=256, blank=True)
    # form_limit_number = models.IntegerField('')  #
    updated_at = models.DateTimeField('修改时间', auto_now=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    image_url = models.ImageField('图片链接', upload_to=custom_path)
    # href = models.URLField('活动地址')
    # blank = models.BooleanField('')
    # is_jump = models.BooleanField('跳转', default=False)
    # jump_url = models.URLField('跳转url')
    close_tip = models.CharField('关闭提示', max_length=128, blank=True)
    # process_type_str = models.CharField()  # "eliminateBonus"', '"candyPartyPass"','"dragonTreasures"', '"freeGame"', '"teamLottery"', '"jackpot"
    valid_date_start = models.DateTimeField('开始时间')
    valid_date_end = models.DateTimeField('结束时间')
    category = models.CharField('分类', max_length=32, blank=True)
    audio = models.FileField("音频", null=True, blank=True, upload_to=custom_path)
    is_new = models.BooleanField('是否最新', default=False)
    weight = models.IntegerField('权重', default=0)


class Record(models.Model):
    status_choices = (
        (1, '审核中'),
        (2, '锁定'),
        (3, '已派发'),
        (4, '未通过')
    )
    account = models.CharField('会员账号', max_length=32)
    activity = models.CharField('活动', max_length=32)
    actid = models.IntegerField('活动id', null=True, default=None)
    data = models.TextField('申请信息')
    message = models.CharField('回复内容', max_length=256)
    apply_time = models.DateTimeField('申请时间', auto_now_add=True)
    reply_time = models.DateTimeField('审核时间', null=True)
    auditor = models.CharField('审核人', null=True, max_length=32)
    status = models.SmallIntegerField('状态', choices=status_choices, default=1)
    ip = models.GenericIPAddressField('ip地址')
    money = models.DecimalField('金额', max_digits=9, decimal_places=2, default=0)


class Resource(models.Model):
    weight = models.SmallIntegerField('sort', blank=True)
    text = models.CharField('文本', max_length=256, blank=True)
    url = models.CharField('链接', max_length=128, default="javascript:void(0)")
    img = models.ImageField('图片链接', upload_to=custom_path, blank=True, null=True)
    category = models.CharField('分类', max_length=32, blank=True)
