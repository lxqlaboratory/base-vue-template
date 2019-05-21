<template>
  <div class="app-container">
    驾驶员姓名：
    <el-select v-model="driverNameQuery" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.driverName"
        :label="item.driverName"
        :value="item.driverName"
      />
    </el-select>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员姓名"width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverName }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverPhoneNum }}
        </template>
      </el-table-column>
      <el-table-column label="从业资格证类型" width="150" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="是否兼职押运员" width="150" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="驾驶证号" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.drivingLicenseNum }}
        </template>
      </el-table-column>
      <el-table-column label="从业资格证号" width="150" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="操作" width="135" align="center">
        <template slot-scope="scope">
          <el-button @click="show(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getDriverList } from '@/api/driver-manage'

export default {
  filters: {

  },
  data() {
    return {
      list: [],
      driverNameQuery: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getDriverList().then(response => {
        console.log(response)
        this.list = response.data
      })
    },
    show(row) {
      console.log(row);
    },
    edit(row) {
      console.log(row);
    },
  }
}
</script>
