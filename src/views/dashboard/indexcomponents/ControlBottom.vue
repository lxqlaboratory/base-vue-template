<template>
  <div class="bottom-container" :class="{active:isShow}">

    <div id="menu">
      <div class="menu">功能1</div>
      <div class="menu">功能2</div>
      <div class="menu">功能3</div>
      <div class="menu">功能4</div>
      <div class="menu">功能5</div>
    </div>

    <el-dialog title="智能选车" :visible.sync="carSelectionVisible">
      <el-transfer
        v-model="value2"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入城市拼音"
        :data="data2"
      />
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
        <el-button type="text" style="color:green" @click="clearFilter">全部</el-button>&nbsp;&nbsp;&nbsp;{{ vehicle_num }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="location" />
        <el-button type="text" style="color:red" @click="clearFilter">运行</el-button>&nbsp;&nbsp;&nbsp;{{ running }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="car_park" />
        <el-button type="text" style="color:blueviolet" @click="clearFilter">停车</el-button>&nbsp;&nbsp;&nbsp;{{ parking }}
      </div>
      <div style="width: 1px;height: 4.5vh; background: gray;" />
      <div class="item-mapbottom">
        <svg-icon icon-class="offline" />
        <el-button type="text" style="color:gray" @click="clearFilter">离线</el-button>&nbsp;&nbsp;&nbsp;{{ offline_num }}
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
      <el-table :data="tableData" height="35.5vh" border style="width: 100%" @row-contextmenu="row_contextmenu">
        <el-table-column type="selection" min-width="50" />
        <el-table-column prop="plateNum" label="车牌号" sortable min-width="100" />
        <el-table-column prop="phoneNum" label="SIM卡号" sortable min-width="120" />
        <el-table-column
          prop="is_online"
          label="是否在线"
          sortable
          :filter-method="filterHandler"
          :filters="[{ text: '在线', value: '在线' }, { text: '离线', value: '离线' }]"
          min-width="120"
        />
        <el-table-column prop="acc" label="ACC" sortable min-width="80" />
        <el-table-column prop="speed" label="卫星速度" sortable min-width="110" />
        <el-table-column prop="gbRecSpeed" label="记录仪速度" sortable min-width="120" />
        <el-table-column prop="longitude" label="经度" sortable min-width="80" />
        <el-table-column prop="latitude" label="纬度" sortable min-width="80" />
        <el-table-column prop="last_time" label="最后上线时间" min-width="140" sortable />
        <el-table-column prop="driver_name" label="驾驶员" sortable min-width="120" />
        <el-table-column prop="driverLicense" label="驾驶证号" sortable min-width="160" />
        <el-table-column prop="team_name" label="车队名称" sortable min-width="200" />
        <el-table-column prop="vehicle_loc" label="位置信息" sortable min-width="400" />
        <el-table-column prop="direction" label="方向" sortable min-width="80" />
        <el-table-column prop="oil_volume" label="油量(L)" sortable min-width="100" />
        <el-table-column prop="sim_flow" label="已用流量(M)" sortable min-width="130" />
        <el-table-column prop="stopTime" label="停车时长(分钟)" sortable min-width="140" />
        <el-table-column prop="note" label="备注" sortable min-width="400" />
      </el-table>
    </div>

  </div>

</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'ControlBottom',
  data() {
    const generateData2 = () => {
      const data = []
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都']
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu']
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      return data
    }
    return {

      isShow: false,
      running: 0,
      parking: 0,
      alarm: 0,
      warning: 0,

      carSelectionVisible: false,

      data2: generateData2(),
      value2: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },

      value1: [1, 4],

      /* tableData: [{
        plateNum: '鲁N89689',
        phoneNum: '15153139702',
        is_online: '在线',
        acc: '开',
        speed: 80,
        gbRecSpeed: 0,
        longitude: 116.404,
        latitude: 39.915
      },
      {
        plateNum: '鲁NB3551',
        phoneNum: '15153139702',
        is_online: '离线',
        acc: '开',
        speed: 80,
        gbRecSpeed: 0,
        longitude: 116.404,
        latitude: 39.915
      }] */
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'carList'
    ]),
    'vehicle_num': function() {
      return this.tableData.length
    },
    'online_num': function() {
      var num = 0
      this.tableData.forEach(item => {
        if (item.is_online === '在线') { num++ }
      }
      )
      return num
    },
    'offline_num': function() {
      var num = 0
      this.tableData.forEach(item => {
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
    setTimeout(() => {
      this.tableData = this.carList
    }, 1000)
  },
  methods: {
    showTable() {
      // this.fillTable()
      this.isShow = !this.isShow
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
</style>
