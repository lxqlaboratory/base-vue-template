<template>
  <div class="app-container">
    驾驶员姓名：
    <el-select v-model="driverNameQuery" filterable   style="margin-bottom: 10px" placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.driverName"
        :label="item.driverName"
        :value="item.driverName"
      />
    </el-select>
    <el-button type="primary" round @click="openSave()">增加</el-button>
    <!--<el-button type="primary" round @click="exportToExcel()" style="margin-bottom: 10px">导出</el-button>-->
    <el-table
      :data="tableList"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="10">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶员姓名" min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverName }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverPhoneNum }}
        </template>
      </el-table-column>
      <el-table-column label="出生日期" min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverBirth }}
        </template>
      </el-table-column>
      <el-table-column label="家庭住址" min-width="30" align="center">
        <template slot-scope="scope">
          {{ scope.row.driverAddress }}
        </template>
      </el-table-column>
      <el-table-column label="驾驶证号" min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.drivingLicenseNum }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" min-width="30" align="center">
        <template slot-scope="scope">
          {{ scope.row.identificationCardNum }}
        </template>
      </el-table-column>
      <el-table-column label="操作"  min-width="30" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.row)"  >编辑</el-button>
          <el-button @click="deleteDriver(scope.row)"  size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="insertRow" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
          <el-form-item label="驾驶员姓名:">
            <el-input v-model="insertRow.driverName"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input  v-model="insertRow.driverPhoneNum" oninput ="value=value.replace(/[^\d]/g,'')"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="身份证号:">
            <el-input  v-model="insertRow.identificationCardNum" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="出生日期:">
            <el-input v-model="insertRow.driverBirth" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="驾驶证号:">
            <el-input v-model="insertRow.drivingLicenseNum" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="家庭住址:">
            <el-input v-model="insertRow.driverAddress" style="width: 80%" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update1()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="保存" :visible.sync="dialogSaveFormVisible" width="500px">
        <el-form :model="save" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
          <el-form-item label="驾驶员姓名:">
            <el-input v-model="save.driverName"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input  v-model="save.driverPhoneNum" oninput ="value=value.replace(/[^\d]/g,'')"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="身份证号:">
            <el-input  v-model="save.identificationCardNum" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="出生日期:">
            <el-input v-model="save.driverBirth" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="驾驶证号:">
            <el-input v-model="save.drivingLicenseNum" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="家庭住址:">
            <el-input v-model="save.driverAddress" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <!--<el-form-item label="选择车牌号码:">
            <el-select v-model="plateValue"  style="width: 80%" filterable placeholder="请选择车牌号码">
              <el-option
                v-for="item in plateList"
                :key="item.vehicleId"
                :label="item.plateNum"
                :value="item.plateNum"
              />
            </el-select>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSaveFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDriver()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDriverList, editDriver,saveDriver,deleteDriver } from '@/api/driver-manage'
import { getCarList } from '@/api/vehicle-manage'
export default {
  filters: {

  },
  data() {
    return {
      list: [],
      plateList: null,
      plateValue: null,
      dialogFormVisible: false,
      dialogSaveFormVisible: false,
      insertRow:{
        driverName: '',
        driverPhoneNum: '',
        drivingLicenseNum: '',
        driverBirth:'',
        driverAddress:'',
        identificationCardNum:''
      },
      save:{
        driverName: '',
        driverPhoneNum: '',
        drivingLicenseNum: '',
        driverBirth:'',
        driverAddress:'',
        identificationCardNum:''
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
      }),
      getCarList().then(response => {
          this.plateList = response.data
      })
    },
    update1(){
      this.dialogFormVisible = false
      editDriver(this.insertRow.driverName, this.insertRow.drivingLicenseNum,
        this.insertRow.identificationCardNum, this.insertRow.driverBirth, this.insertRow.driverAddress
        ,this.insertRow.driverPhoneNum).then(res => {
        if(res.re==1){
          this.$message({
            message: '更新成功',
            type: 'success'
          });
        }else{
          this.$message.error('更新失败');
        }
      }).catch(e => {

      })
    },
    edit(item) {
      this.insertRow = item
      this.dialogFormVisible = true
    },
    saveDriver() {
      this.dialogSaveFormVisible = false
      saveDriver(this.save.driverName, this.save.drivingLicenseNum,
        this.save.identificationCardNum, this.save.driverBirth, this.save.driverAddress
        ,this.save.driverPhoneNum,this.plateValue).then(res => {
          console.log(res)
          if(res.re==1){
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }else{
            this.$message.error('保存失败');
          }
         this.fetchData()
      }).catch(e => {

      })
    },
    openSave(){
      this.dialogSaveFormVisible = true
    },
    deleteDriver(item) {
      this.insertRow = item
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDriver(this.insertRow.identificationCardNum).then(res => {
          if(res.re==1){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.fetchData()
          }else{
            this.$message.error('删除失败');
          }
        }).catch(e => {

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })

    },
    exportToExcel() {
      //excel数据导出
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('../../assets/js/Export2Excel');
        const tHeader = ['姓名','联系电话', '出生日期', '家庭地址', '驾驶证号', '身份证号'];
        const filterVal = ['driverName','driverPhoneNum', 'driverBirth', 'driverAddress', 'drivingLicenseNum', 'identificationCardNum'];
        const list = this.tableList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '驾驶员列表');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  }
}
</script>
