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
          :data="item.activities"
          element-loading-text="获取中"
          border
          fit
          highlight-current-row
          style="margin-top: 20px"
        >
          <el-table-column align="center" label="编号" min-width="10%">
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标题" min-width="45%">
            <template slot-scope="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="权重" min-width="20%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight" placeholder="仅数字，可重复"><el-button slot="append" size="mimi" icon="el-icon-edit" @click="editActivity(scope.row)" /></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="25%">
            <template slot-scope="scope">
              <router-link :to="'/activity/edit/'+scope.row.id">
                <el-button type="primary">编辑</el-button>
              </router-link>
              <el-button type="danger" disabled @click="deleteActivity(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div v-else>暂无数据</div>
  </div>
</template>

<script>
import { fetchcategory, deleteActivity, changeWeight } from '@/api/activity'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'ListActivity',
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
    editActivity(row) {
      const tmp = {
        id: row.id,
        weight: row.weight
      }
      changeWeight(tmp).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 3000
        })
        this.fetchCategory()
      })
    },
    deleteActivity(id) {
      deleteActivity(id).then(() => {
        this.fetchCategory()
      })
    }
  }
}
</script>

<style scoped>

</style>
