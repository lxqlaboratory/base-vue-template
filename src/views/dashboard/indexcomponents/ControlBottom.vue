<template>
  <div class="bottom-container" :class="{active:isShow}">

    <div id="menu">
      <div class="menu">功能1</div>
      <div class="menu">功能2</div>
      <div class="menu">功能3</div>
      <div class="menu">功能4</div>
      <div class="menu">功能5</div>
    </div>

    <el-dialog title="智能选车" :visible.sync="carSelectionVisible" :center="true" style="width: 74%">
      <div>
        <span class="font-span">起点：</span>
        <el-input v-model="startInput" class="dialog-input-text" style="width: 35%" placeholder="请输入内容" />
        <span class="font-span">终点：</span>
        <el-input v-model="endInput" class="dialog-input-text" style="width: 35%" placeholder="请输入内容" />
      </div>
      <div style="margin-top: 2px">
        <span class="font-span">sim卡：</span>
        <el-input v-model="simInput" class="dialog-input-text" style="width: 35%;" placeholder="请输入内容" />
        <span class="font-span">驾驶员：</span>
        <el-input v-model="driverInput" class="dialog-input-text" style="width: 35%" placeholder="请输入内容" />
      </div>
      <div style="margin-top: 2px">
        <span class="font-span">车队名称：</span>
        <el-select v-model="fleetValue" style="font-size: 12px;" class="dialog-input-text" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            style="font-size: 12px;"
          />
        </el-select>
        <span class="font-span">车牌尾号：</span>
        <el-input v-model="plateInput" class="dialog-input-text" style="width: 16%;" placeholder="" />
      </div>
      <div style="margin-top: 2px" />
      <div style="margin-top: 2px">
        <el-checkbox v-model="onlineChecked" class="el-dialog--center" style=" padding-left: 3px;">选择在线车辆</el-checkbox>
        <el-checkbox v-model="videoChecked" class="el-dialog--center" style=" padding-left: 3px;">选择视频车辆</el-checkbox>
        <el-checkbox v-model="defenceChecked" class="el-dialog--center" style=" padding-left: 3px;">主动防御车辆</el-checkbox>
      </div>
      <div style="margin-top: 2px">
        <span class="font-span">请填写车速范围：</span>
        <el-input v-model="startSpeed" class="dialog-input-text" style="width: 15%;" placeholder="" />
        <span class="font-span">至</span>
        <el-input v-model="endSpeed" class="dialog-input-text" style="width: 15%;" placeholder="" />
        <span class="font-span">km/h</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="carSelectionVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="seachBottomTable">查 询</el-button>
      </span>
    </el-dialog>

    <div class="mapbottom">

      <!--<el-button type="primary" icon="el-icon-search" class="item-mapbottom" @click="dialogTableVisible = true">智能选车</el-button>-->
      <div class="item-mapbottom">
        <svg-icon icon-class="search" />
        <el-button type="text" @click="isCarSelectionVisible">智能选车</el-button>
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="all" />
        <el-button type="text" style="color:green" @click="showAll">全部</el-button>&nbsp;&nbsp;&nbsp;{{ vehicle_num }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="location" />
        <el-button type="text" style="color:red" @click="showRunning">运行</el-button>&nbsp;&nbsp;&nbsp;{{ running }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="car_park" />
        <el-button type="text" style="color:blueviolet" @click="showParking">停车</el-button>&nbsp;&nbsp;&nbsp;{{ parking }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="offline" />
        <el-button type="text" style="color:gray" @click="showOffline">离线</el-button>&nbsp;&nbsp;&nbsp;{{ offline_num }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="alarm" />
        <el-button type="text" style="color:red" @click="clearFilter">报警</el-button>&nbsp;&nbsp;&nbsp;{{ alarm }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="warning" />
        <el-button type="text" style="color:red" @click="clearFilter">预警</el-button>&nbsp;&nbsp;&nbsp;{{ warning }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        &nbsp;&nbsp;&nbsp;车辆在线数：&nbsp;{{ online_num }}&nbsp;&nbsp;&nbsp;当前在线率：&nbsp;{{ online_rate }}
      </div>

      <div class="item-mapbottom-right">
        <svg-icon icon-class="arrow-up" :class="{transformPictureDiv:isShow}" @click="showTable" />
        <svg-icon icon-class="maxscreen" @click="showTableMax" />
      </div>
    </div>

    <div v-show="isShow" class="mapBottomTable">
      <el-table :data="tableData" border style="width: 100%;max-height:40vh" @row-click="throwEmit" @row-contextmenu="row_contextmenu">
        <!--  <el-table-column type="selection" min-width="50" />-->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="驾驶证号">
                <span>{{ props.row.driverLicense }}</span>
              </el-form-item>
              <el-form-item label="驾驶员号码">
                <span>{{ props.row.driverPhoneNumber }}</span>
              </el-form-item>
              <el-form-item label="车队名称">
                <span>{{ props.row.driverCompany }}</span>
              </el-form-item>
              <el-form-item label="从业资格证编码">
                <span>{{ props.row.qualificationCode }}</span>
              </el-form-item>
              <el-form-item label="发证机构名称">
                <span>{{ props.row.authorityName }}</span>
              </el-form-item>
              <el-form-item label="方向">
                <span>{{ props.row.direction }}</span>
              </el-form-item>
              <el-form-item label="高程(海拔高度，单位为米)">
                <span>{{ props.row.elevation }}</span>
              </el-form-item>
              <el-form-item label="模拟量">
                <span>{{ props.row.simulation }}</span>
              </el-form-item>
              <el-form-item label="无线通信网络信号强度">
                <span>{{ props.row.wirelessIntensity }}</span>
              </el-form-item>
              <el-form-item label="GNSS/定位卫星数">
                <span>{{ props.row.satellitesNum }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="plateNum" label="车牌号" sortable min-width="100" />
        <!--<el-table-column prop="phoneNum" label="SIM卡号" sortable min-width="120" />-->
        <el-table-column prop="is_online" label="是否在线" sortable min-width="120" />
        <el-table-column prop="acc" label="ACC" sortable min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.acc">{{ '开启' }}</div>
            <div v-else>{{ '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="卫星速度" sortable min-width="90">
          <template slot-scope="scope">
            <div v-if="scope.row.speed>75" style="color: red">{{ scope.row.speed }}</div>
            <div v-else>{{ scope.row.speed }}</div>
          </template>
        </el-table-column>
       <!-- <el-table-column prop="gbRecSpeed" label="记录仪速度" sortable min-width="120" />-->
        <!-- <el-table-column prop="longitude" label="经度" sortable min-width="80" />
        <el-table-column prop="latitude" label="纬度" sortable min-width="80" />-->
        <el-table-column prop="locationDetail" label="位置" sortable min-width="240" />
        <el-table-column prop="subTime" label="持续上线时间" sortable min-width="160" />
        <el-table-column prop="time" label="最后上线时间" sortable min-width="160" />
        <el-table-column prop="driverName" label="驾驶员" sortable min-width="120" />
        <!--<el-table-column prop="driverLicense" label="驾驶证号" sortable min-width="160" />-->
        <!--<el-table-column prop="driverCompany" label="车队名称" sortable min-width="220" />-->
        <!-- <el-table-column prop="vehicle_loc" label="位置信息" sortable min-width="400" />
        <el-table-column prop="direction" label="方向" sortable min-width="80" />
        <el-table-column prop="oil_volume" label="油量(L)" sortable min-width="100" />
        <el-table-column prop="sim_flow" label="已用流量(M)" sortable min-width="130" />
        <el-table-column prop="stopTime" label="停车时长(分钟)" sortable min-width="140" />
        <el-table-column prop="note" label="备注" sortable min-width="400" />-->
      </el-table>
    </div>

  </div>

</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'ControlBottom',
  data() {
    return {
      isShow: false,
      alarm: 0,
      warning: 0,
      carSelectionVisible: false,
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },
      tableData: [],
      startInput: null,
      endInput: null,
      simInput: null,
      onlineChecked: false,
      videoChecked: false,
      defenceChecked: false,
      options: [{
        value: '1',
        label: '鑫华汽车运输有限公司车队'
      }, {
        value: '2',
        label: '鑫华汽车运输有限公司顺通车队'
      }, {
        value: '3',
        label: '鑫华汽车运输有限公司龙业车队'
      }],
      fleetValue: null,
      dialogVisible: false,
      startSpeed: null,
      endSpeed: null,
      plateInput: null,
      driverInput: null
    }
  },
  computed: {
    ...mapGetters([
      'carList'
    ]),
    'vehicle_num': function() {
      return this.carList.length
    },
    'running': function() {
      var num = 0
      this.carList.forEach(item => {
        if (item.is_online === '在线') { num++ }
      }
      )
      return num
    },
    'parking': function() {
      var num = 0
      this.carList.forEach(item => {
        if (item.is_online === '熄火') { num++ }
      }
      )
      return num
    },
    'online_num': function() {
      var num = 0
      this.carList.forEach(item => {
        if (item.is_online === '在线') { num++ }
      }
      )
      return num
    },
    'offline_num': function() {
      var num = 0
      this.carList.forEach(item => {
        if (item.is_online === '离线') { num++ }
      }
      )
      return num
    },
    'online_rate': function() {
      return this.vehicle_num <= 0 ? '0%' : (Math.round(this.online_num / this.vehicle_num * 10000) / 100.00) + '%'
    }

  },
  mounted() {
    const that = this
    setTimeout(() => {
      that.tableData = that.carList
    }, 1000)
  },
  methods: {
    throwEmit(val) {
      this.$emit('selectrow', val.plateNum)
    },
    showTable() {
      // this.fillTable()
      this.isShow = !this.isShow
    },
    seachBottomTable() {
      var list = []
      // 6个if
      // author：杨培林
      this.tableData.filter(item => {
        if (this.simInput == null || item.phoneNum == this.simInput) {
          if (this.plateInput == null || item.plateNum.indexOf(this.plateInput) >= 0) {
            if (this.driverInput == null || item.driverName == this.driverInput) {
              if (this.fleetValue == null || item.fleetName.indexOf(this.fleetValue) >= 0) {
                if (this.startSpeed == null || this.endSpeed == null || (item.speed > this.startSpeed && item.speed < this.endSpeed)) {
                  if (!this.onlineChecked || item.is_online === '在线') { list.push(item) }
                }
              }
            }
          }
        }
      })
      this.tableData = list
    },
    showTableMax() {
      this.isShow = !this.isShow
    },
    isCarSelectionVisible() {
      this.carSelectionVisible = !this.carSelectionVisible
    },

    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    row_contextmenu(row, column, e) {
      e.preventDefault()
      const menu = document.querySelector('#menu')
      menu.style.left = e.clientX + 'px'
      menu.style.top = e.clientY + 'px'
      menu.style.width = '130px'
    },
    showAll() {
      this.tableData = this.carList
    },
    showRunning() {
      this.tableData = []
      this.carList.forEach(item => {
        if (item.is_online == '在线') { this.tableData.push(item) }
      })
    },
    showParking() {
      this.tableData = []
      this.carList.forEach(item => {
        if (item.is_online == '熄火') { this.tableData.push(item) }
      })
    },
    showOffline() {
      this.tableData = []
      this.carList.forEach(item => {
        if (item.is_online == '离线') { this.tableData.push(item) }
      })
    }
  }
}
</script>

<style scoped>

  #menu{
    position: fixed;
    width: 0; /*设置为0 隐藏自定义菜单*/
    height: 125px;
    overflow: hidden;
    box-shadow: 0 1px 1px #888,1px 0 1px #ccc;
    background-color: ghostwhite;
    flex-direction: column;
    z-index: 9999;
  }
  .menu{
    width: 130px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
  }

  .transformPictureDiv {
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* Internet Explorer */
    -moz-transform:rotate(180deg); /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg); /* Opera */
  }

  .active {
    position: absolute;
    bottom: 0;
    left: 0;
    min-height: 40vh;
    border-top: 1px solid gray;
    width: 100%;
    background-color: ghostwhite;
    flex-direction: column;
    /*cursor: n-resize*/
  }

  .bottom-container{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4.5vh;
    border-top: 1px solid gray;
    width: 100%;
    background-color: ghostwhite;
    flex-direction: column;
  }

  .mapBottomTable {
    position: absolute;
    top: 4.5vh;
    bottom: 0;
    left: 0;
    min-height: 40vh;
    max-height: 45vh;
    border-top: 1px solid gray;
    width: 100%;
    background-color: ghostwhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    /*align-items: center;*/
    z-index: 99;
  }

  .mapbottom {
    position: absolute;
    top: 0;
    left: 0;
    height: 4.5vh;
    border-top: 1px solid gray;
    width: 100%;
    background-color: ghostwhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    z-index: 99;
  }

  .item-mapbottom {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    min-width: 8vw;
    color: black;
  }

  .item-mapbottom svg {
    margin-right: 5px !important;
    height: 1.2em !important;
    width: 1.2em !important;
  }

  .item-mapbottom-right {
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .item-mapbottom-right svg {
    margin-right: 15px !important;
    height: 1.2em !important;
    width: 1.2em !important;
  }
  .dialog-input-text >>> .el-input__inner {

    height: 2.7em;
    font-size: 12px;
  }
  .el-dialog--center >>> .el-checkbox__label{
    font-size: 12px;
  }
  .font-span{
    font-size: 12px;
    padding-left: 3px;
  }
  .colorred{
    color: red
  }
</style>
