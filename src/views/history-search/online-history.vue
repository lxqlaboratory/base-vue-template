<template>
  <div class="app-container">

    <div class="block">
      开始时间：
      <el-date-picker v-model="createDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="pickerOptionsStart" style="margin-right: 10px;" @change="startTimeStatus" />
      至
      <el-date-picker v-model="overDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :picker-options="pickerOptionsEnd" style="margin-left: 10px;" @change="endTimeStatus" />
      <span style="margin-left:10px">车牌号</span>
      <el-select v-model="plateValue" style="margin-right: 10px;" filterable placeholder="请选择车牌号码">
        <el-option
          v-for="item in plateList"
          :key="item.messageId"
          :label="item.plateNum"
          :value="item.plateNum"
        />
      </el-select>
      驾驶员姓名：
      <el-select v-model="driverNameQuery" filterable   style="margin-bottom: 10px;" placeholder="请选择">
        <el-option
          v-for="item in driverList"
          :key="item.driverName"
          :label="item.driverName"
          :value="item.driverName"
        />
      </el-select>
    </div>

    <el-table :data="tableList" border fit highlight-current-row style="margin-top:10px">
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员信息" min-width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.driverName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="换卡时间" min-width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.onlineDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送车辆" min-width="260" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.plateNum }} </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getUserMassageFormList,getVueAllOnlineRecordingInfo } from '@/api/history-search'
  import { getCarList } from '@/api/vehicle-manage'
  import { getDriverList } from '@/api/driver-manage'
  export default {

    filters: {

    },
    data() {
      return {
        list: [],
        onlineList: [],
        driverList: [],
        alamTypeValue: [],
        plateValue: [],
        plateList: [],
        driverNameQuery: '',
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
        return this.onlineList.filter(item => {
          if (!this.plateValue || item.plateNum === this.plateValue) {
            if (!this.driverNameQuery || item.driverName == this.driverNameQuery){
              if (!this.createDate || !this.overDate) { return true }
              if (item.onlineDate > this.createDate && item.onlineDate < this.overDate) { return true }

          } else { return false } }
        })
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getUserMassageFormList().then(response => {
          this.list = response.data
        }),
        getCarList().then(response => {
            this.plateList = response.data
          }),
        getVueAllOnlineRecordingInfo().then(response => {
            this.onlineList = response.data
        }),
        getDriverList().then(response => {
          this.driverList = response.data
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
