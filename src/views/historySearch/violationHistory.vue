<template>
  <div class="app-container">

    <div class="block">

      <el-date-picker
        v-model="time"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']">
      </el-date-picker>
      <span style="margin-left:10px">车牌号</span>
     <el-select v-model="plateValue" filterable placeholder="请选择车牌号码">
      <el-option
        v-for="item in plateList"
        :key="item.vehicleId"
        :label="item.plateNum"
        :value="item.vehicleId">
      </el-option>
    </el-select>
      <span style="margin-left:10px">报警内容</span>
      <el-select v-model="violationTypeValue" filterable placeholder="请选择">
        <el-option
          v-for="item in violationTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left:10px" type="primary" icon="el-icon-search">搜索</el-button>
    </div>

    <el-table :data="list" border  fit highlight-current-row style="margin-top:10px">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号"width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.plateNum }}
        </template>
      </el-table-column>
      <el-table-column label="报警类型" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.violationParameterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.violationTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车队名称" width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fleetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getViolationQueryFormList } from '@/api/history-search'
  import { getVehicleMonitoringViolationType } from '@/api/history-search'
  import { getCarList } from '@/api/vehicle-manage'
  export default {
    filters: {

    },
    data() {
      return {
        list: null,
        violationTypeList:null,
        violationTypeValue:null,
        time:null,
        plateValue:null,
        plateList:null,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getViolationQueryFormList().then(response => {
          this.list = response.data
        }),
        getVehicleMonitoringViolationType().then(response => {
          this.violationTypeList= response.data
        }),
        getCarList().then(response => {
            this.plateList= response.data
          })
      }
    }
  }
</script>
