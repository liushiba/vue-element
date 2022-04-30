<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" type="url" required>
                标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
              <el-input v-model="postForm.content_desc" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
              <span v-show="contentDescLength" class="word-counter" style="color: red">{{ contentDescLength }}字</span>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="70px" label="活动分类" class="postInfo-container-item">
                    <el-autocomplete
                      v-model="postForm.category"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入分组"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="90px" label="英文别名" class="postInfo-container-item">
                    <el-input v-model="postForm.alias" placeholder="用于标识(唯一)" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="postForm.is_show?10:5">
                  <el-form-item label-width="45px" label="显示" class="postInfo-container-item">
                    <el-switch v-model="postForm.is_show" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                </el-col>
                <el-col v-show="!postForm.is_show" :span="5">
                  <el-form-item label-width="90px" label="关闭提示" class="postInfo-container-item">
                    <el-input v-model="postForm.close_tip" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label-width="120px" label="是否开启申请" class="postInfo-container-item">
                    <el-switch v-model="postForm.is_open" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label-width="120px" label="是否为最新活动" class="postInfo-container-item">
                    <el-switch v-model="postForm.is_new" active-color="#13ce66" inactive-color="#ff4949" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="45px" label="每日" class="postInfo-container-item">
                    <div class="time">
                      <el-time-picker v-model="postForm.valid_day_start" placeholder="每日开始时间" value-format="HH:mm:ss" format="HH:mm:ss" />
                      <el-time-picker v-model="postForm.valid_day_end" placeholder="每日结束时间" value-format="HH:mm:ss" format="HH:mm:ss" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="120px" label="活动时间范围" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.valid_date"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="70px" label="限制类型" class="postInfo-container-item">
                    <el-select v-model="postForm.limit_type">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="90px" label="限制次数" class="postInfo-container-item">
                    <el-input-number v-model="postForm.limit_number" :min="1" :max="100" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="45px" label="表单" class="postInfo-container-item">
                    <el-drag-select v-model="postForm.submit_forms" style="width: 400px" multiple placeholder="请选择">
                      <el-option v-for="item in form_options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-drag-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="103px" label="自定义添加" class="postInfo-container-item">
                    <el-input v-model="form" clearable @keyup.enter.native="addForm"><el-button slot="append" icon="el-icon-plus" @click="addForm" /></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-button size="medium" type="primary" class="el-icon-edit" @click="addArticle">添加游戏说明</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20" style="margin-top: 20px">
                  <el-form-item
                    v-for="(domain, index) in postForm.content_articles"
                    :key="domain.key"
                    :label="'说明' + (index + 1)"
                    label-width="55px"
                  >
                    <el-input v-model="domain.value"><el-button slot="append" icon="el-icon-delete" style="color: red" @click="removeArticle(domain)" /></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-upload
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :file-list="postForm.image_url"
                    :limit="1"
                    :http-request="addImage"
                    class="upload-demo"
                    action="https://httpbin.org/post"
                    list-type="picture"
                  >
                    <el-button size="medium" type="primary">上传缩略图</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-upload
                    action="upload-demo"
                    :on-remove="handleRemoveAudio"
                    :http-request="addAudio"
                    :limit="1"
                    :file-list="postForm.audio"
                    list-type="text"
                  >
                    <el-button size="medium" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content_table" :height="400" style="background-color: #295788" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ isEdit ? '提交修改': '立即创建' }}</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import MDinput from '@/components/MDinput'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import Tinymce from '@/components/Tinymce'
import { createActivity, fetchActivity, updateActivity, fetchcategory } from '@/api/activity'
const defaultForm = {
  alias: '',
  category: '',
  title: '',
  is_show: true,
  is_open: true,
  // valid_day_start: new Date(new Date().toLocaleDateString()),
  // valid_day_end: new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1),
  valid_day_start: '00:00:00',
  valid_day_end: '23:59:59',
  limit_type: 1,
  limit_number: 0,
  content_table: '',
  content_desc: '',
  content_articles: [{ value: '所获彩金1倍流水即可出款' }],
  submit_forms: ['会员账号'],
  image_url: [],
  close_tip: '',
  valid_date_start: undefined,
  valid_date_end: undefined,
  valid_date: undefined,
  audio: [],
  is_new: false
}
export default {
  name: 'ActivityDetail',
  components: { MDinput, ElDragSelect, Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fs: [{ value: 'aaa' }, { value: 'bbb' }],
      postForm: Object.assign({}, defaultForm),
      options: [{ value: 1, label: '每日' }, { value: 2, label: '每周' }, { value: 3, label: '每月' }, { value: 4, label: '每年' }],
      form_options: [
        { value: '会员账号', label: '会员账号' },
        { value: '注单编号', label: '注单编号' },
        { value: '娱乐平台', label: '娱乐平台' },
        { value: '牌局编号', label: '牌局编号' },
        { value: '有效投注', label: '有效投注' },
        { value: '游戏名称', label: '游戏名称' },
        { value: '亏损金额', label: '亏损金额' },
        { value: '盈利金额', label: '盈利金额' },
        { value: '下注金额', label: '下注金额' },
        { value: '存款金额', label: '存款金额' },
        { value: '中奖金额', label: '中奖金额' },
        { value: '图片', label: '图片' }
      ],
      form: '',
      tempRoute: {},
      updateImage: false,
      updateAudio: false
    }
  },
  computed: {
    contentDescLength() {
      return this.postForm.content_desc.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    querySearch(queryString, cb) {
      fetchcategory().then(response => {
        cb(response.data.map(item => { return { value: item['name'] } }))
      })
    },
    fetchData(id) {
      fetchActivity(id).then(response => {
        const tempData = Object.assign({}, response.data)
        // Just for test
        tempData.valid_date = [tempData.valid_date_start, tempData.valid_date_end]
        tempData.submit_forms = tempData.submit_forms.split(',')
        tempData.content_articles = tempData.content_articles.split('|').map(key => {
          return { value: key }
        })
        tempData.image_url = tempData.image_url ? [{ name: tempData.image_url.split('/').pop(), url: tempData.image_url }] : []
        tempData.audio = tempData.audio ? [{ name: tempData.audio.split('/').pop(), url: tempData.audio }] : []
        this.postForm = tempData
        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log('error', err.response)
      })
    },
    setTagsViewTitle() {
      const title = '编辑活动'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    addForm() {
      this.postForm.submit_forms.push(this.form)
      this.form = ''
    },
    removeArticle(item) {
      const index = this.postForm.content_articles.indexOf(item)
      if (index !== -1) {
        this.postForm.content_articles.splice(index, 1)
      }
    },
    addArticle() {
      this.postForm.content_articles.push({
        value: '',
        key: Date.now()
      })
    },
    handleRemove(file, fileList) {
      this.updateImage = true
      this.postForm.image_url = []
      console.log(file, fileList)
    },
    handleRemoveAudio() {
      this.updateAudio = true
      this.postForm.audio = []
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(response, file) {
      console.log(response)
      console.log('handlesuccess')
      console.log(file)
    },
    onSubmit() {
      const tempData = Object.assign({}, this.postForm)
      tempData['submit_forms'] = tempData['submit_forms'].join()
      tempData['content_articles'] = tempData['content_articles'].map(v => {
        return v['value']
      }).join('|')
      tempData['valid_date_start'] = tempData['valid_date'][0]
      tempData['valid_date_end'] = tempData['valid_date'][1]
      tempData['image_url'] = tempData['image_url'].length === 0 ? null : tempData['image_url'][0]['raw']
      tempData['audio'] = tempData['audio'].length === 0 ? null : tempData['audio'][0]['raw']
      if (this.isEdit) {
        if (!this.updateImage) {
          delete tempData.image_url
        }
        if (!this.updateAudio) {
          delete tempData.audio
        }
        updateActivity(tempData).then(() => {
          this.updateImage = false
          this.updateAudio = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.log('error', err.response)
          this.$notify({
            title: '失败',
            message: '更新失败',
            type: 'danger',
            duration: 4000
          })
        })
      } else {
        createActivity(tempData).then(() => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.log('error', err.response)
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'danger',
            duration: 4000
          })
        })
      }
    },
    addImage(param) {
      console.log(param)
      this.postForm.image_url = [{ raw: param.file, url: URL.createObjectURL(param.file), name: param.file.name }]
      this.updateImage = true
    },
    addAudio(param) {
      this.postForm.audio = [{ raw: param.file, url: URL.createObjectURL(param.file), name: param.file.name }]
      this.updateAudio = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
