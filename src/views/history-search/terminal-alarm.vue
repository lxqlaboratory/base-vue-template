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
          :key="item.alarmId"
          :label="item.plateNum"
          :value="item.plateNum"
        />
      </el-select>
      <span style="margin-left:10px">报警内容</span>
      <el-select v-model="alamTypeValue" filterable placeholder="请选择">
        <el-option
          v-for="item in listAlarm"
          :key="item.alarmContent"
          :label="item.alarmContent"
          :value="item.alarmContent"
        />
      </el-select>
      <el-button style="margin-left:10px" type="primary" icon="el-icon-search">搜索</el-button>
    </div>

    <el-table :data="tableList" border height="calc(100vh - 50px)" style="margin-top:10px;">
      <el-table-column align="center" label="ID" min-width="10">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号" min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.plateNum }}
        </template>
      </el-table-column>
      <el-table-column label="报警内容" min-width="50"align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警时间" min-width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="车队名称" min-width="50" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fleetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置信息" min-width="50"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }} </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getViolationAlarmFormList,getAlarmProcessContentInfo } from '@/api/history-search'
  import { getCarList } from '@/api/vehicle-manage'

  export default {

    filters: {

    },
    data() {
      return {
        list: [],
        listAlarm: [],
        alamTypeValue: [],
        plateValue: [],
        plateList: [],
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
            if (!this.alamTypeValue || item.alarmContent === this.alamTypeValue) {
              if (!this.createDate || !this.overDate) { return true }
              if (item.updateTime > this.createDate && item.updateTime < this.overDate) { return true }
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
        getViolationAlarmFormList().then(response => {
          this.list = response.data
        }),
        getCarList().then(response => {
            this.plateList = response.data
        }),
        getAlarmProcessContentInfo().then(response => {
          let list = response.data
          console.log( this.listAlarm)
          let list_map = new Array();
          for ( let i = 0; i < list.length; i++) {
            list_map.push({alarmContent:list[i],alarmContent:list[i]});
          }
          this.listAlarm=list_map
          console.log( this.listAlarm)
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
