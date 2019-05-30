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
      :data="tableList"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员姓名" width ="150" align="center">
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
          {{ scope.row.driverPhoneNum }}
        </template>
      </el-table-column>
      <el-table-column label="是否兼职押运员" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverPhoneNum }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶证号" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.drivingLicenseNum }}
        </template>
      </el-table-column>
      <el-table-column label="从业资格证号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverPhoneNum }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="135" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"  >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="insertRow" label-position="left" label-width="200px" style="width: 430px; margin-left:50px;">
          <el-form-item label="驾驶员姓名:">
            <el-input v-model="insertRow.driverName"  autocomplete="off" />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input  v-model="insertRow.driverPhoneNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="从业资格证类型:">
            <el-input  v-model="insertRow.driverPhoneNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="是否兼职押运员:">
            <el-input v-model="insertRow.driverPhoneNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="驾驶证号:">
            <el-input v-model="insertRow.drivingLicenseNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="从业资格证号:">
            <el-input v-model="insertRow.driverPhoneNum" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update1()">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { getDriverList, editDriver } from '@/api/driver-manage'

export default {
  filters: {

  },
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      insertRow:{
        driverName: '',
        driverPhoneNum: '',
        drivingLicenseNum: ''
      },
      driverNameQuery: ''
    }
  },
  computed: {
    'tableList': function() {
      return this.list.filter(item => {
        if (!this.driverNameQuery || item.driverName == this.driverNameQuery) { return true }
        return false
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getDriverList().then(response => {
        this.list = response.data
      })
    },
    update1(){
      this.dialogFormVisible = false
      editDriver(this.insertRow.driverName, this.insertRow.drivingLicenseNum, this.insertRow.driverPhoneNum).then(res => {

      }).catch(e => {

      })
    },
    edit(item) {
      this.insertRow = item
      this.dialogFormVisible = true
    }
  }
}
</script>
