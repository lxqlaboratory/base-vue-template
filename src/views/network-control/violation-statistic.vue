<template>
  <div class="app-container">

    <div class="block">
      <span style="margin-left:10px">报警内容</span>
      <el-select v-model="violationTypeValue" filterable placeholder="请选择">
        <el-option
          v-for="item in violationTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <el-table :data="tableList" border fit highlight-current-row style="margin-top:10px" @row-click="openDetails">

      <el-table-column align="center" label="ID" min-width="20">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车队名称"  min-width="40" align="center">
        <template slot-scope="scope">
          {{ scope.row.fleetName }}
        </template>
      </el-table-column>
      <el-table-column label="违章类型"min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.violationParameterString }}</span>
        </template>
      </el-table-column>
      <el-table-column label="违章次数" min-width="40" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.violationCounts }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="违章信息" :visible.sync="dialogTableVisible">
      <el-table :data="gridData" border fit highlight-current-row style="margin-top:10px">
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
        <el-table-column label="违章类型" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.violationParameterName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="违章时间" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.violationTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="驾驶员姓名" min-width="20" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.driverName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>


</template>

<script>
  import { getVehicleMonitoringViolationType } from '@/api/history-search'
  import { getViolationQueryFormList } from '@/api/history-search'
  import { getDriverList } from '@/api/driver-manage'
  import { getViolationInfoByParameters } from '@/api/network-monitor'
  export default {

    filters: {

    },
    data() {
      return {
        list: [],
        violationTypeList: null,
        violationTypeValue: null,
        plateValue: null,
        driverValue: null,
        driverList:null,
        violationParameterList:null,
        dialogTableVisible:false,
        violationParameter:null,
        violationList:[]
      }
    },
    computed: {
      'tableList'() {
          return this.list.filter(item => {
            if (!this.violationTypeValue||item.violationParameter === this.violationTypeValue ) return true
            return false
          }
          )
        },
      'gridData'() {
        return this.violationList.filter(item => {
            if (item.violationParameter === this.violationParameter ) return true
            return false
          }
        )
      },

    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getVehicleMonitoringViolationType().then(response => {
            this.violationTypeList = response.data
          }),
        getDriverList().then(response => {
            this.driverList = response.data
          }),
        getViolationInfoByParameters().then(response => {
            this.list = response.data
          })
        ,
        getViolationQueryFormList().then(response => {
            this.violationList = response.data
          })
      },
      openDetails (row, column, event) {
        console.log(row.violationParameter)
        this.violationParameter=row.violationParameter
        //具体操作
        this.dialogTableVisible = !this.dialogTableVisible
      },
    }
  }
</script>
