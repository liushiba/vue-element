<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-button class="filter-item">导出</el-button>-->
      <!--<el-button class="filter-item">查询</el-button>-->
      <el-select v-model="freshTime" class="filter-item" size="small" style="width: 100px" placeholder="刷新时间">
        <el-option
          v-for="item in times"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="filter-item" type="primary" @click="changeAllRecords('lock')">选中锁定</el-button>
      <el-button class="filter-item" type="primary" @click="changeAllRecords('send')">选中派送</el-button>
      <el-button class="filter-item" type="danger" @click="changeAllRecords('wrong')">选中驳回</el-button>
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
    > <el-table-column
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
      <el-table-column label="手机号" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.data.indexOf('手机') > 0 ? scope.row.data.split('|')[1].substring(3,) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" align="center" min-width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.activity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间/信息" align="center" min-width="160px">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content" style="font-size: 24px; width: 450px" v-html="scope.row.data.replace(/\|/g, '<br/>')" />
            <span>{{ scope.row.apply_time | datetimeFilter }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="赠送金额" class-name="status-col" min-width="86px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.money " :disabled="scope.row.status === 2 && !(scope.row.auditor === name)" class="edit-input" size="small" @focus="handleMouseEnter(scope.row)" @blur="handleMouseOut(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="回复内容" align="center" min-width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.message" :disabled="scope.row.status === 2 && !(scope.row.auditor === name)" class="edit-input" size="small" type="textarea" @focus="handleMouseEnter(scope.row)" @blur="handleMouseOut(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="ip" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="228px">
        <template slot-scope="scope">
          <el-button v-show="scope.row.status === 1" size="small" type="warning" @click="operate(scope.row, 2)">锁定</el-button>
          <el-button v-show="scope.row.status === 2 && scope.row.auditor === name" size="small" type="primary" @click="operate(scope.row, 3)">通过</el-button>
          <el-button v-show="scope.row.status === 2 && scope.row.auditor === name" size="small" type="danger" @click="operate(scope.row, 4)">驳回</el-button>
          <el-tag v-show="scope.row.status === 2 && !(scope.row.auditor === name)" type="warning">{{ scope.row.auditor }}正在处理...</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getRecords" />
  </div>
</template>

<script>
import { fetchRecord, updateRecord, fetchNew } from '@/api/record'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { mapGetters } from 'vuex'

export default {
  name: 'Record',
  components: { Pagination },
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
    }
  },
  data() {
    return {
      multipleSelection: [],
      currentRow: undefined,
      lastRunTime: undefined,
      currentTime: undefined,
      isPlaying: false,
      freshTime: 0,
      times: [
        { value: 0, label: '自动刷新' },
        { value: 5, label: '每5秒' },
        { value: 15, label: '每15秒' },
        { value: 30, label: '每30秒' },
        { value: 60, label: '每1分钟' },
        { value: 1800, label: '每30分钟' },
        { value: -1, label: '关闭刷新' }
      ],
      currentId: undefined,
      intervalid1: undefined,
      intervalid2: undefined,
      list: [],
      listQuery: {
        page: 1,
        page_size: 20,
        ordering: '-status,-id',
        stat: 2,
        model: 1
      },
      total: 0,
      listLoading: false,
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    freshTime: function(newTime, oldTime) {
      if (newTime === 0 || newTime === -1) {
        clearInterval(this.intervalid2)
        this.intervalid2 = undefined
      } else {
        clearInterval(this.intervalid2)
        this.intervalid2 = setInterval(() => {
          this.getRecords(this.listQuery)
        }, newTime * 1000)
      }
    },
    currentRow: function(newRow, oldRow) {
      console.log(newRow, oldRow)
    }
  },
  created() {
    this.getRecords(this.listQuery)
    this.intervalid1 = setInterval(() => {
      this.getNewId()
    }, 2500)
  },
  beforeDestroy() {
    clearInterval(this.intervalid1)
    clearInterval(this.intervalid2)
  },
  methods: {
    handleMouseEnter(arg) {
      if (arg.status === 2 && !(arg.auditor === name)) {
        this.currentRow = arg
      }
    },
    handleMouseOut(row) {
      if (row.status === 2 && !(row.auditor === name) && row.id === this.currentRow.id) {
        this.currentRow = undefined
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id)
    },
    play() {
      this.lastRunTime = Date.now()
      const audio = document.querySelector('#audio')
      if (!this.isPlaying) {
        audio.play()
        this.isPlaying = true
      }
      const timeOut = setTimeout(() => {
        this.stop(timeOut)
      }, 3000)
    },
    stop(timeOut) {
      this.currentTime = Date.now()
      const audio = document.querySelector('#audio')
      if (this.currentTime - this.lastRunTime > 2999) {
        if (this.isPlaying) {
          audio.currentTime = 0
          audio.pause()
          this.isPlaying = false
        }
      }
      clearTimeout(timeOut)
    },
    getNewId() {
      fetchNew({ cursor: this.currentId }).then(response => {
        this.currentId = response.data.id
        if (response.data.newRecs) {
          this.play()
          if (this.freshTime === 0) {
            this.getRecords(this.listQuery)
          }
          response.data.newRecs.forEach(item => {
            this.$notify({
              title: `新的记录${item.id}`,
              dangerouslyUseHTMLString: true,
              message: `用户 <strong>${item.account}</strong> 申请了<br> <span style="color: red">${item.activity}</span>`,
              type: 'warning',
              position: 'bottom-right',
              offset: 100,
              duration: 4500
            })
          })
        }
      }).catch(err => {
        console.log(err)
        clearInterval(this.intervalid1)
      })
    },
    getRecords() {
      this.listLoading = true
      fetchRecord(this.listQuery).then(response => {
        if (this.currentRow) {
          const edit = this.list.find(item => {
            return item.id === this.currentRow.id
          })
          response.data.results.forEach(item => {
            if (item.id === this.currentRow.id) {
              item.money = edit.money
              item.message = edit.message
              return false
            }
          })
        }
        this.list = response.data.results
        this.total = response.data.count
        this.listLoading = false
      }).catch(err => {
        console.log(err)
        this.freshTime = 0
        this.listLoading = false
        clearInterval(this.intervalid2)
      })
    },
    operate(row, status) {
      const postDate = status === 2 ? { status: status } : {
        status: status,
        money: row.money,
        message: row.message
      }
      updateRecord(row.id, postDate).then(response => {
        this.getRecords(this.listQuery)
        if (response.data.code === 1) {
          this.$notify({
            title: '提示',
            message: '锁定成功',
            type: 'success',
            duration: 2000
          })// success
        } else if (response.data.code === 2) {
          this.$notify({
            title: '提示',
            message: '审核成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '提示',
            message: '操作失败：记录已被锁定',
            type: 'warning',
            duration: 3000
          })// failed
        }
      })
    },
    changeAllRecords(flag) {
      const operateMap = {
        send: '派送',
        lock: '锁定',
        wrong: '驳回'
      }
      const operate = operateMap[flag]
      this.$confirm(`该操作会${operate}选中记录，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateRecord(flag, this.multipleSelection).then(() => {
          this.$message({ type: 'success', message: `${operate}操作成功` })
          this.getRecords()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${operate}`
        })
      })
    }
    // handleUpdate(row) {
    //   const data = {
    //     status: 2,
    //     message: row.message,
    //     money: row.money
    //   }
    //   updateRecord(row.id, data).then(() => {
    //     this.$notify({
    //       title: '成功',
    //       message: '审核成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //     const index = this.list.indexOf(row)
    //     this.list.splice(index, 1)
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
