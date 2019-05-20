<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="信息内容" width="800" align="center">
        <template slot-scope="scope">
          {{ scope.row.messageContent }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.addTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMessageTemplateList } from '@/api/template-manage'

export default {
  filters: {

  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMessageTemplateList().then(response => {
        this.list = response.data
      })
      this.listLoading = false
    }
  }
}
</script>
