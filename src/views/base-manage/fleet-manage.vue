<template>
  <div class="app-container">
    车队名称：
    <el-select v-model="companyNameQuery" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.companyName"
        :label="item.companyName"
        :value="item.companyName"
      />
    </el-select>
    <el-table
      v-loading="listLoading"
      :data="tableList"
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
      <el-table-column label="车队名称"width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column label="车辆数量" width="250" align="center">
        <template slot-scope="" />
      </el-table-column>
      <el-table-column label="车队负责人" width="150" align="center">
        <template slot-scope="" />
      </el-table-column>
      <el-table-column label="负责人电话" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFleetList } from '@/api/fleet-manage'

export default {
  filters: {

  },

  data() {
    return {
      list: [],
      listLoading: true,
      companyNameQuery: ''
    }
  },
  computed: {
    'tableList': function() {
      return this.list.filter(item => {
        if (!this.companyNameQuery || item.companyName == this.companyNameQuery) { return true }
        return false
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getFleetList().then(response => {
        this.list = response.data
      })
      this.listLoading = false
    }
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
