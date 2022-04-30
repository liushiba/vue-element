<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" clearable placeholder="会员账号" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.status" clearable placeholder="申请状态" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.actid__in" clearable multiple placeholder="活动类型" class="filter-item">
        <el-option
          v-for="item in activies"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="roles.includes('9')" class="filter-item" type="danger" @click="deleteAllRecords">一键清空</el-button>
      <el-button class="filter-item" type="danger" @click="deleteBulkRecords">批量删除</el-button>
      <!--<el-button v-if="roles.includes('9')" :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出全部</el-button>-->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="35px"
      />
      <el-table-column label="编号" prop="id" sortable="custom" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员账号" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center" min-width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.activity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusToColor" size="small">{{ scope.row.status | statusToText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间/信息" align="center" min-width="140px">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content" style="font-size: 24px;width: 450px" v-html="scope.row.data.replace(/\|/g, '<br/>')" />
            <span>{{ scope.row.apply_time | datetimeFilter }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" class-name="status-col" min-width="86px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.money " disabled class="edit-input" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="回复内容" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.message" disabled class="edit-input" size="small" type="textarea" />
        </template>
      </el-table-column>
      <el-table-column label="ip" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.auditor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.reply_time | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" :disabled="scope.row.status === 1 || scope.row.status === 2" @click="renew(scope.row.id)">重新审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchRecord, updateRecord, delteRecord } from '@/api/record'
import { getActivity } from '../../api/activity'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // Waves directive
import { mapGetters } from 'vuex'
export default {
  name: 'RecordList',
  components: { Pagination },
  directives: { waves },
  filters: {
    datetimeFilter(time) {
      if (time) {
        return time.split('.')[0].replace('T', ' ')
      } else {
        return time
      }
    },
    applyFilter(data) {
      return data.replace(/\|/g, '<br/>')
    },
    statusToText(status) {
      const tag = ['未处理', '锁定中', '已派出', '未通过']
      return tag[parseInt(status) - 1]
    },
    statusToColor(status) {
      const colors = ['primary', 'warning', 'success', 'danger']
      return colors[parseInt(status) - 1]
    }
  },
  data() {
    return {
      multipleSelection: [],
      downloadLoading: false,
      activies: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      list: undefined,
      listQuery: {
        account: undefined,
        status: undefined,
        page: 1,
        page_size: 20,
        ordering: '-id',
        actid__in: undefined
      },
      statusOptions: [{ label: '未审核', key: 1 }, { label: '锁定中', key: 2 }, { label: '已派发', key: 3 }, { label: '未通过', key: 4 }]
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getList()
    this.getActivities()
  },
  methods: {
    // 处理下载Excel请求
    deleteBulkRecords() {
      this.$confirm(`该操作会永久删除${this.multipleSelection.length}条信息，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delteRecord('bulk', this.multipleSelection).then(() => {
          this.$message({ type: 'success', message: '删除成功' })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id)
    },
    handleDownload() {
      this.downloadLoading = true
      const title = '优惠活动' + new Date().toDateString()
      fetchRecord({ page_size: 100000, page: 1 }).then(response => {
        this.down = response.data.results
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['会员账号', '活动项目', '申请时间', '申请数据', 'ip', '回复', '状态']
          const filterVal = ['account', 'activity', 'apply_time', 'data', 'ip', 'message', 'status']
          const data = this.formatJson(filterVal, this.down)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: title
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      const types = ['', '审核中', '锁定中', '已派发', '未通过']
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'status') {
          return types[v[j]]
        } else {
          return v[j]
        }
      }))
    },
    deleteAllRecords() {
      this.$confirm('该操作会永久删除所有已处理后的信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delteRecord('all').then(() => {
          this.$message({ type: 'success', message: '删除成功' })
          this.list = null
          this.total = 0
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getActivities() {
      getActivity().then(res => {
        this.activies = res.data.results.map(item => {
          return {
            label: item.title,
            value: item.id
          }
        })
      })
    },
    renew(id) {
      updateRecord(id, { status: 1 }).then(response => {
        if (response.data.code === 3) {
          this.$notify({
            title: '提示',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })// success
          this.getList()
        } else {
          this.$notify({
            title: '提示',
            message: '操作失败',
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      const dataTemp = Object.assign({}, this.listQuery)
      dataTemp['actid__in'] = dataTemp['actid__in'] === undefined ? undefined : dataTemp['actid__in'].join(',')
      fetchRecord(dataTemp).then(response => {
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
