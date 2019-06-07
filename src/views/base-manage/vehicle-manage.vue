<template>
  <div class="app-container">
    车牌号：
    <el-select v-model="plateNumQuery" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.plateNum"
        :label="item.plateNum"
        :value="item.plateNum"
      />
    </el-select>
    车队：
    <el-select v-model="fleetNameQuery" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.plateNum"
        :label="item.fleetName"
        :value="item.fleetName"
      />
    </el-select>
    <el-button type="primary" round @click="openSave()" style="margin-bottom: 10px">增加</el-button>
    <el-table
      :data="tableList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="车牌号">
              <span>{{ props.row.plateNum }}</span>
            </el-form-item>
            <el-form-item label="所属车队">
              <span>{{ props.row.fleetName }}</span>
            </el-form-item>
            <el-form-item label="司机姓名">
              <span>{{ props.row.driverName }}</span>
            </el-form-item>
            <el-form-item label="车主">
              <span>{{ props.row.ownerName }}</span>
            </el-form-item>
            <el-form-item label="车主电话">
              <span>{{ props.row.ownerPhoneNum }}</span>
            </el-form-item>
            <el-form-item label="单/双桥">
              <span>{{ props.row.bridge }}</span>
            </el-form-item>
            <el-form-item label="营运证号">
              <span>{{ props.row.operationPermitNum }}</span>
            </el-form-item>
            <el-form-item label="行车证号">
              <span>{{ props.row.vehicleLicenceNum }}</span>
            </el-form-item>
            <el-form-item label="[运政]铭牌型号">
              <span>{{ props.row.nameplateType1 }}</span>
            </el-form-item>
            <el-form-item label="[运政]车辆类型">
              <span>{{ props.row.vehicleType1 }}</span>
            </el-form-item>
            <el-form-item label="[运政]车牌颜色">
              <span>{{ props.row.plateColor1 }}</span>
            </el-form-item>
            <el-form-item label="[运政]铭牌厂牌">
              <span>{{ props.row.nameplateBrand1 }}</span>
            </el-form-item>
            <el-form-item label="[运政]道路运输证字">
              <span>{{ props.row.transportCertificateWord1 }}</span>
            </el-form-item>
            <el-form-item label="[运政]车辆营运状态">
              <span>{{ props.row.operationStatus1 }}</span>
            </el-form-item>
            <el-form-item label="[运政]经营范围类别">
              <span>{{ props.row.businessScope1 }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" min-width="10">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="车牌号" min-width="10"
        prop="plateNum">
      </el-table-column>
      <el-table-column
        label="所属车队" min-width="30"
        prop="fleetName">
      </el-table-column>
      <el-table-column
        label="司机姓名" min-width="10"
        prop="driverName">
      </el-table-column>
      <el-table-column
        label="SIM卡号" min-width="20"
        prop="simNum">
      </el-table-column>
      <el-table-column
        label="车辆类型" min-width="20"
        prop="vehicleType">
      </el-table-column>
      <el-table-column label="操作" min-width="20" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)"  size="small">编辑</el-button>
          <el-button @click="deleteContent(scope.row)"  size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
import { getCarList } from '@/api/vehicle-manage'
import ElInput from '../../../node_modules/element-ui/packages/input/src/input.vue'

export default {
  components: { ElInput },
  filters: {

  },
  data() {
    return {
      list: [
        //        {
        //
        //
        //        }
      ],
      plateNumQuery: '',
      fleetNameQuery: ''

    }
  },
  computed: {
    'tableList': function() {
      return this.list.filter(item => {
        if (!this.plateNumQuery || item.plateNum == this.plateNumQuery) { return true }
        return false
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getCarList().then(response => {
        console.log(response)
        this.list = response.data
      })
    }
  }
}
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
