<template>
  <div class="app-container">

    <div class="block">
      开始时间：
      <el-date-picker v-model="createDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="pickerOptionsStart" style="margin-right: 10px;" @change="startTimeStatus" />
      至
      <el-date-picker v-model="overDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="pickerOptionsEnd" style="margin-left: 10px;" @change="endTimeStatus" />
      <span style="margin-left:10px">车牌号</span>
      <el-select v-model="plateValue" filterable placeholder="请选择车牌号码">
        <el-option
          v-for="item in plateList"
          :key="item.vehicleId"
          :label="item.plateNum"
          :value="item.plateNum"
        />
      </el-select>
      <span style="margin-left:10px">报警内容</span>
      <el-select v-model="violationTypeValue" filterable placeholder="请选择">
        <el-option
          v-for="item in violationTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button style="margin-left:10px" type="primary" icon="el-icon-search">搜索</el-button>
    </div>

    <el-table :data="tableList" border fit highlight-current-row style="margin-top:10px">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号" width="110" align="center">
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
      violationTypeList: null,
      violationTypeValue: null,
      plateValue: null,
      plateList: null,
      createDate: '',
      overDate: '',
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = this.overDate
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = this.createDate
          if (beginDateVal) {
            return (
              time.getTime() <
                new Date(beginDateVal).getTime()
            )
          }
        }
      }
    }
  },
  computed: {

    'tableList': function() {
      return this.list.filter(item => {
        if (!this.plateValue || item.plateNum === this.plateValue) {
          if (!this.violationTypeValue || item.violationParameter === this.violationTypeValue) {
            if (!this.createDate || !this.overDate) {
              return true
            }
            if (item.violationTime > this.createDate && item.violationTime < this.overDate) { return true }
          }
        } else { return false }
      })
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
        this.violationTypeList = response.data
      }),
      getCarList().then(response => {
        this.plateList = response.data
      })
    },
    startTimeStatus: function(value) {
      this.createDate = value
    },
    // 时间结束选择器
    endTimeStatus: function(value) {
      this.overDate = value
    }
  }
}
</script>
