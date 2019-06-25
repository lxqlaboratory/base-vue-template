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
    <div>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="insertRow" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
          <el-form-item label="驾驶证号:">
            <el-input v-model="insertRow.plateNum"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="SIM卡号:">
            <el-input  v-model="insertRow.simNum" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所属车队:">
            <el-select v-model="fleetNameEdit" filterable placeholder="请选择">
              <el-option
                v-for="item in fleetList"
                :key="item.companyName"
                :label="item.companyName"
                :value="item.companyName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属司机:">
            <el-select v-model="driverNameQuery" filterable   style="margin-bottom: 10px" placeholder="请选择">
              <el-option
                v-for="item in driverList"
                :key="item.personId"
                :label="item.driverName"
                :value="item.personId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车主:">
            <el-input v-model="insertRow.ownerName" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="车主电话:">
            <el-input v-model="insertRow.ownerPhoneNum" style="width: 80%" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="保存" :visible.sync="dialogSaveFormVisible" width="500px">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form :model="save" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
              <el-form-item label="车牌号:">
                <el-input v-model="save.plateNum"  style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="SIM卡号:">
                <el-input  v-model="save.simNum"  oninput ="value=value.replace(/[^\d]/g,'')"  style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="所属车队(必选):">
                <el-select v-model="fleetNameEdit" filterable placeholder="请选择">
                  <el-option
                    v-for="item in fleetList"
                    :key="item.companyName"
                    :label="item.companyName"
                    :value="item.companyName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="[运政]车牌颜色:">
                <el-input v-model="save.plateColor1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <!--<el-form-item label="所属司机(必选):">
                <el-select v-model="driverNameQuery" filterable   style="margin-bottom: 10px" placeholder="请选择">
                  <el-option
                    v-for="item in driverList"
                    :key="item.personId"
                    :label="item.driverName"
                    :value="item.personId"
                  />
                </el-select>
              </el-form-item>-->
              <el-form-item label="车主:">
                <el-input v-model="save.ownerName" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="车主电话:">
                <el-input v-model="save.ownerPhoneNum" oninput ="value=value.replace(/[^\d]/g,'')"  style="width: 80%" autocomplete="off" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="配置信息" name="second">
            <el-form :model="save" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
              <el-form-item label="[运政]铭牌型号:">
                <el-input v-model="save.nameplateType1"  style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="是否卧铺车:">
                <el-switch
                  v-model="boolSleeper"
                  active-text="是"
                  inactive-text="不是">
                </el-switch>
              </el-form-item>
              <el-form-item label="[运政]车辆类型:">
                <el-input v-model="save.vehicleType1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]燃料类型:">
                <el-input v-model="save.fuelType1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]铭牌厂牌:">
                <el-input v-model="save.nameplateBrand1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]客运等级:">
                <el-input v-model="save.busRank1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]道路运输证字:">
                <el-input v-model="save.transportCertificateWord1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]车辆营运状态:">
                <el-input v-model="save.operationStatus1" style="width: 80%" autocomplete="off" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="车辆信息" name="third">
            <el-form :model="save" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
              <el-form-item label="车长:">
                <el-input v-model="save.vehicleLength"  oninput ="value=value.replace(/[^0-9.]/g,'')"   style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="车宽:">
                <el-input  v-model="save.vehicleWidth" oninput ="value=value.replace(/[^0-9.]/g,'')"   style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="车高:">
                <el-input v-model="save.vehicleHeight" oninput ="value=value.replace(/[^0-9.]/g,'')"   style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="吨位:">
                <el-input v-model="save.vehicleTonnage" oninput ="value=value.replace(/[^0-9.]/g,'')"   style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="可用米数:">
                <el-input v-model="save.availableRice"  oninput ="value=value.replace(/[^0-9.]/g,'')"  style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="可用体积:">
                <el-input v-model="save.availableVolume" oninput ="value=value.replace(/[^0-9.]/g,'')"  style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="可用重量:">
                <el-input v-model="save.availableWeight" oninput ="value=value.replace(/[^0-9.]/g,'')"   style="width: 80%" autocomplete="off" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="牌照信息" name="fourth">
            <el-form :model="save" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
              <el-form-item label="车辆型号:">
                <el-input v-model="save.vehicleModel"  style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="车辆类型:">
                <el-input  v-model="save.vehicleType" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="营运证号:">
                <el-input v-model="save.operationPermitNum" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="单/双桥:">
                <el-input v-model="save.bridge" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]经营范围类别:">
                <el-input v-model="save.businessScope1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]班线类型:">
                <el-input v-model="save.lineType1" style="width: 80%" autocomplete="off" />
              </el-form-item>
              <el-form-item label="[运政]道路运输证号:">
                <el-input v-model="save.transportCertificateNum1" style="width: 80%" autocomplete="off" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
         <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSaveFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTemplate()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCarList,deleteCarList,editCarList,saveCarList} from '@/api/vehicle-manage'
import ElInput from '../../../node_modules/element-ui/packages/input/src/input.vue'
import { getFleetList } from '@/api/fleet-manage'
import { getDriverList} from '@/api/driver-manage'
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
      driverList: [
        //        {
        //
        //
        //        }
      ],
      fleetList: [
        //        {
        //
        //
        //        }
      ],
      plateNumQuery: '',
      activeName: 'first',
      fleetNameQuery: '',
      fleetNameEdit:'',
      driverNameQuery:'',
      dialogFormVisible: false,
      dialogSaveFormVisible: false,
      boolSleeper: true,
      insertRow:{
        vehicleId: '',
        plateNum: '',
        simNum: '',
        fleetName:'',
        driverId:'',
        vehicleType:'',
        operationPermitNum: '',
        vehicleLicenceNum: '',
        bridge:'',
        ownerName:'',
        ownerPhoneNum:'',
        nameplateType1:'',
        vehicleType1:'',
        fuelType1:'',
        plateColor1:'',
        nameplateBrand1:'',
        busRank1:'',
        transportCertificateWord1:'',
        operationStatus1:'',
      },
      save:{
        vehicleId: '',
        plateNum: '',
        simNum: '',
        fleetName:'',
        driverId:'',
        vehicleModel:'',
        vehicleType:'',
        operationPermitNum: '',
        vehicleLicenceNum: '',
        bridge:'',
        ownerName:'',
        ownerPhoneNum:'',
        businessScope1:'',
        lineType1:'',
        transportCertificateNum1:'',
        nameplateType1:'',
        isSleeper:'',
        vehicleType1:'',
        fuelType1:'',
        plateColor1:'',
        nameplateBrand1:'',
        busRank1:'',
        transportCertificateWord1:'',
        operationStatus1:'',
        vehicleLength:'',
        vehicleWidth:'',
        vehicleHeight:'',
        vehicleTonnage:'',
        availableRice:'',
        availableVolume:'',
        availableWeight:'',
      },
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
      }),
      getDriverList().then(response => {
        this.driverList = response.data
        if(this.driverList!=[]){
          this.driverNameQuery=this.driverList[0].personId
        }
      }),
      getFleetList().then(response => {
        this.fleetList = response.data
        if(this.fleetList!=[]){
          this.fleetNameEdit=this.fleetList[0].companyName
        }
      })
    },
    handleClick(tab, event) {

    },
    update(){
      this.dialogFormVisible = false
      editCarList(this.insertRow.vehicleId,this.insertRow.plateNum, this.insertRow.simNum,
        this.fleetNameEdit, this.driverNameQuery , this.insertRow.ownerName, this.insertRow.ownerPhoneNum).then(res => {
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
    saveTemplate() {
      this.dialogSaveFormVisible = false
      saveCarList(this.save.plateNum, this.save.simNum,
        this.fleetNameEdit, this.save.ownerName, this.save.ownerPhoneNum,
        this.save.businessScope1,  this.save.lineType1,  this.save.transportCertificateNum1,  this.save.nameplateType1
        , this.boolSleeper,  this.save.vehicleType1, this.save.vehicleType, this.save.fuelType1
        , this.save.plateColor1 , this.save.nameplateBrand1 , this.save.busRank1 , this.save.transportCertificateWord1 ,
        this.save.operationStatus1,  this.save.vehicleLength , this.save.vehicleWidth,
        this.save.vehicleHeight,  this.save.vehicleTonnage,  this.save.availableRice,  this.save.availableVolume,
        this.save.availableWeight
      ).then(res => {
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
    edit(item) {
      this.insertRow = item
      this.dialogFormVisible = true
    },
    deleteContent(item) {
      this.insertRow = item
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCarList(this.insertRow.vehicleId).then(res => {
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
