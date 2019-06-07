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
      <el-table-column label="操作" width="135" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="delete(scope.row)" type="text" size="small">删除</el-button>
        </template>
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
    },
    delete(row) {
      console.log(row);
    },
    edit(row) {
      console.log(row);
    },
  }
}
</script>
<style>
  colgroup {
    position: absolute;
    width: 100% !important;
    display: flex;
  }
  col {
    flex: 1;
    text-align: center;
  }
  table,tbody,thead {
    width: 100% !important;
  }
</style>
