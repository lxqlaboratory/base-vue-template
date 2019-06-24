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
          :key="item.plateNum"
          :label="item.plateNum"
          :value="item.plateNum"
        />
      </el-select>
    </div>

    <el-table :data="tableList" border fit highlight-current-row style="margin-top:10px">
      <el-table-column align="center" label="ID" min-width="20">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号" min-width="40" align="center">
        <template slot-scope="scope">
          {{ scope.row.plateNum }}
        </template>
      </el-table-column>
      <el-table-column label="发送内容" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" min-width="60" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime }} </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getAllVehicleTextMsgInfo } from '@/api/history-search'
  import { getCarList } from '@/api/vehicle-manage'
  export default {

    filters: {

    },
    data() {
      return {
        list: [],
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
              if (!this.createDate || !this.overDate) { return true }
              if (item.addTime > this.createDate && item.addTime < this.overDate) { return true }
          }
          else { return false }
        })
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getAllVehicleTextMsgInfo().then(response => {
          this.list = response.data
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
