<template>
  <div class="app-container">
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
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="是否兼职押运员" width="150" align="center">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="驾驶证号" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.drivingLicenseNum }}
        </template>
      </el-table-column>
      <el-table-column label="从业资格证号" width="150" align="center">
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="操作" width="135" align="center">
        <template slot-scope="scope">

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
        list: null,
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
      }
    }
  }
</script>
