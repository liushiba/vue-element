<template>
  <div class="createPost-container">
    <el-form ref="textForm" :model="postForm" label-width="160px" abel-position="left" style="margin-top: 30px">
      <el-form-item label="分类">
        <el-select v-model="postForm.category" value="">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文字信息">
        <el-input v-model="postForm.text" style="width: 400px" />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="postForm.url" style="width: 400px" />
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          :file-list="postForm.img"
          :limit="1"
          :on-remove="handleRemove"
          :http-request="addImage"
          class="upload-demo"
          action="https://httpbin.org/post"
          list-type="picture"
        >
          <el-button size="medium" type="primary">上传缩略图</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-left: 100px">
        <el-button type="primary" @click="onSubmit">{{ isEdit ? '提交修改': '立即创建' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createText, fetchText, updateText } from '@/api/text'
const defaultForm = {
  category: '导航栏',
  text: '',
  url: undefined,
  weight: 1,
  img: []
}
export default {
  name: 'TextDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempRoute: {},
      updateImage: false,
      postForm: Object.assign({}, defaultForm),
      options: [{ value: '导航栏', label: '导航栏' }, { value: '轮播图', label: '轮播图' }, { value: '侧导航', label: '侧导航' }, { value: '右侧导航', label: '右侧导航' }, { value: '最新优惠', label: '最新优惠' }, { value: '热门游戏', label: '热门游戏' }]
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
    fetchData(id) {
      fetchText(id).then(response => {
        const tempData = Object.assign({}, response.data)
        tempData.img = tempData.img ? [{ name: tempData.img.split('/').pop(), url: tempData.img }] : []
        this.postForm = tempData
        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log('error', err.response)
      })
    },
    setTagsViewTitle() {
      const title = '编辑文本'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    addImage(param) {
      console.log(param)
      this.postForm.img = [{ raw: param.file, url: URL.createObjectURL(param.file) }]
      this.updateImage = true
    },
    onSubmit() {
      const tempData = Object.assign({}, this.postForm)
      if (tempData['img'].length > 0) {
        tempData['img'] = tempData['img'][0]['raw']
      } else {
        tempData['img'] = null
      }
      if (this.isEdit) {
        if (!this.updateImage) {
          delete tempData.img
        }
        updateText(tempData).then(() => {
          this.updateImage = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.log('error', err.response)
        })
      } else {
        createText(tempData).then(() => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          console.log('error', err.response)
        })
      }
    },
    handleRemove(file, fileList) {
      this.updateImage = true
      this.postForm.img = []
    }
  }
}
</script>

<style scoped>

</style>
