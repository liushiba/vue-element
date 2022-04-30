<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button :icon="listQuery.user?'el-icon-search':'el-icon-refresh'" class="filter-item" type="primary" @click="handleFilter">{{ listQuery.user?'搜索':'刷新' }}</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        width="35px"-->
<!--      />-->
      <el-table-column label="编号" prop="id" sortable="custom" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期数" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" min-width="195px">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" min-width="195px">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time | datetimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="160px">
        <template slot-scope="scope">
          <el-tag  :type="scope.row.status === false ? 'danger': 'success'" size="mini" disable-transitions>{{ scope.row.status === false ? '未开奖' : '已开奖：号码' + scope.row.number + '金额' + scope.row.money }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="228px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" :disabled="scope.row.status" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="warning" :disabled="scope.row.status" @click="handleOpen(scope.row)">开奖</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="投注期数">
          <el-input v-model="temp.period" :disabled="dialogStatus === 'open' || dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'open'" label="开奖号码">
          <el-input v-model="temp.number" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'open'" label="开奖彩金">
          <el-input v-model="temp.money" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update' || dialogStatus === 'create'" label="投注时间" prop="datetime">
          <el-date-picker
            v-model="temp.datetimerange"
            :disabled="dialogStatus === 'open'"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getItem, createItem, updateItem, delteItem } from '../../api/item'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'Item',
  components: { Pagination },
  filters: {
    typeToColor(type) {
      const types = ['success', 'info', 'danger']
      return types[parseInt(type)]
    },
    typeToText(type) {
      const types = ['自然抽奖', '内定抽奖', '后台添加']
      return types[parseInt(type)]
    },
    sendToColor(status) {
      const types = ['warning', 'success']
      return types[parseInt(status)]
    },
    sendToText(status) {
      const types = ['未送出', '已送出', '处理中']
      return types[parseInt(status)]
    },
    datetimeFilter(time) {
      if (time) {
        return time.slice(0, -6).replace('T', ' ')
      } else {
        return time
      }
    }
  },
  data() {
    return {
      maxPeriod: 0,
      multipleSelection: [],
      freshTime: 0,
      sendOptions: [
        { value: 0, label: '未派发' },
        { value: 1, label: '已派发' },
        { value: undefined, label: '全部' }
      ],
      times: [
        { value: 0, label: '自动刷新' },
        { value: 5, label: '每5秒' },
        { value: 15, label: '每15秒' },
        { value: 30, label: '每30秒' },
        { value: 60, label: '每1分钟' },
        { value: 600, label: '每10分钟' },
        { value: -1, label: '关闭刷新' }
      ],
      lastRunTime: undefined,
      isPlaying: false,
      currentTime: undefined,
      intervalid1: undefined,
      intervalid2: undefined,
      currentId: 0,
      total: 0,
      tableKey: 0,
      list: null,
      down: null,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      downloadLoading: false,
      textMap: {
        create: '添加',
        update: '编辑',
        open: '开奖'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        period: undefined,
        number: undefined,
        money: undefined,
        datetimerange: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id)
    },
    getList() {
      this.listLoading = true
      getItem(this.listQuery).then(response => {
        this.list = response.data.results
        if (this.list && this.list[0].period > this.maxPeriod) {
          this.maxPeriod = this.list[0].period
        }
        this.total = response.data.count
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        // this.freshTime = 0
        this.listLoading = false
        // clearInterval(this.intervalid2)
      })
    },
    // 处理查询请求
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 处理添加记录
    handleCreate() {
      this.temp = {
        id: undefined,
        period: this.maxPeriod + 1,
        number: undefined,
        money: undefined,
        datetimerange: []
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理更改记录
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理开奖
    handleOpen(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'open'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理删除记录
    handleDelete(row) {
      this.$confirm('删除这条记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delteItem(row.id).then(() => {
          // 删除细节  todo
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增记录
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.temp.datetimerange) {
            tempData['start_time'] = this.temp.datetimerange[0]
            tempData['end_time'] = this.temp.datetimerange[1]
          }
          createItem(tempData).then(response => {
            // this.list.unshift(response.data)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 更新记录
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.temp.datetimerange) {
            tempData['start_time'] = this.temp.datetimerange[0]
            tempData['end_time'] = this.temp.datetimerange[1]
          }
          updateItem(tempData.id, tempData).then(res => {
            this.getList()
            this.dialogFormVisible = false
            if (this.dialogStatus === 'open') {
              if (res.data.number === 0 || res.data.money === 0) {
                this.$notify({
                  title: '失败',
                  message: '开奖失败',
                  type: 'danger',
                  duration: 2000
                })
                return
              }
            }
            this.$notify({
              title: '成功',
              message: this.textMap[this.dialogStatus] + '成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
