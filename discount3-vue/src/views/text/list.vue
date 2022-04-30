<template>
  <div class="app-container">
    <el-tabs v-if="noData" v-model="tabName" type="border-card">
      <el-tab-pane
        v-for="item in category"
        :key="item.name"
        :label="item.name"
        :name="item.name"
      >
        <el-table
          :data="item.texts"
          element-loading-text="获取中"
          border
          fit
          highlight-current-row
          style="margin-top: 20px"
        >
          <el-table-column align="center" label="排序" min-width="10%">
            <template slot-scope="scope">
              {{ scope.row.weight }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标题" min-width="65%">
            <template slot-scope="scope">
              {{ scope.row.text }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="35%">
            <template slot-scope="scope">
              <router-link :to="'/text/edit/'+scope.row.id">
                <el-button type="primary">编辑</el-button>
              </router-link>
              <el-button type="danger" :disabled="!checkPermission(['7'])" @click="deleteText(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div v-else>暂无数据</div>
  </div>
</template>

<script>
import { deleteText, fetchcategory } from '@/api/text'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'ListText',
  data() {
    return {
      category: [],
      activities: [],
      tabName: undefined,
      noData: true
    }
  },
  created() {
    this.fetchCategory()
  },
  methods: {
    checkPermission,
    fetchCategory() {
      fetchcategory().then(response => {
        this.category = response.data
        if (response.data.length === 0) { this.noData = false; return }
        if (this.tabName === '0' || response.data.map(item => item['name']).indexOf(this.tabName) === -1) {
          this.tabName = response.data[0]['name']
        }
      })
    },
    deleteText(id) {
      deleteText(id).then(() => {
        this.fetchCategory()
      })
    }
  }
}
</script>

<style scoped>

</style>
