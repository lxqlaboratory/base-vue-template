<template>
  <div style="height: calc(100vh - 34px);width: 100%;">
    <baidu-map :center="center" :zoom="zoom" style="height: 100%;width: 100%;" @ready="handler" @click="getClickInfo">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />-->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
      <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label content="我爱北京天安门" :label-style="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
    </baidu-map>
    <!--地图右侧弹出-->
    <div class="mapright" />

    <el-dialog title="智能选车" :visible.sync="dialogTableVisible">
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
        <el-button type="text" @click="isDialogTableVisible">智能选车</el-button>
      </div>
      <div class="item-mapbottom" @click="clearFilter">
        <svg-icon icon-class="all" />
        全部&nbsp;&nbsp;&nbsp;{{ all }}
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="location" />
        运行&nbsp;&nbsp;&nbsp;{{ running }}
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="car_park" />
        停车&nbsp;&nbsp;&nbsp;{{ parking }}
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="offline" />
        离线&nbsp;&nbsp;&nbsp;{{ offline }}
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="alarm" />
        报警&nbsp;&nbsp;&nbsp;{{ alarm }}
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="warning" />
        预警&nbsp;&nbsp;&nbsp;{{ warning }}
      </div>

      <div class="item-mapbottom">
        &nbsp;&nbsp;&nbsp;车辆在线数：&nbsp;{{ vehicle_num }}&nbsp;&nbsp;&nbsp;当前在线率：&nbsp;{{ online_rate }}
      </div>

      <div class="item-mapbottom-right">
        <svg-icon icon-class="arrow-up" @click="showTable" />
        <svg-icon icon-class="maxscreen" />
      </div>
    </div>
    <div v-show="isShow" class="mapBottomTable" style="width: 100%">
      <el-table :data="tableData" height="250" border style="width: 100%">
        <el-table-column prop="vehicle_name" label="车牌号" sortable />
        <el-table-column prop="sim_num" label="SIM卡号" sortable />
        <el-table-column prop="last_time" label="最后上线时间" min-width="110" sortable />
        <el-table-column prop="acc" label="ACC" sortable />
        <el-table-column prop="speed" label="卫星速度" sortable />
        <el-table-column prop="gbRecSpeed" label="记录仪速度" sortable />
        <el-table-column prop="longitude" label="经度" sortable />
        <el-table-column prop="latitude" label="纬度" sortable />
        <el-table-column prop="vehicle_loc" label="位置信息" sortable />
        <el-table-column prop="direction" label="方向" sortable />
        <el-table-column prop="oil_volume" label="油量(L)" sortable />
        <el-table-column prop="is_online" label="是否在线" sortable :filter-method="filterHandler" :filters="[{ text: '在线', value: '在线' }, { text: '离线', value: '离线' }]" />
        <el-table-column prop="sim_flow" label="已用流量(M)" sortable />
        <el-table-column prop="stopTime" label="停车时长(分钟)" sortable />
        <el-table-column prop="driver_name" label="驾驶员" sortable />
        <el-table-column prop="driverLicense" label="驾驶证号" sortable />
        <el-table-column prop="team_name" label="车队名称" sortable />
        <el-table-column prop="note" label="备注" sortable />
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    const generateData2 = _ => {
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
      center: { lng: 0, lat: 0 },
      zoom: 13,
      isShow: false,
      vehicle_num: 0,
      online_rate: 0,
      all: 0,
      running: 0,
      parking: 0,
      offline: 0,
      alarm: 0,
      warning: 0,

      dialogTableVisible: false,

      data2: generateData2(),
      value2: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },

      value1: [1, 4],

      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  activated: function() {
    this.$store.commit('app/hideNavbar')
  },
  deactivated: function() {
    this.$store.commit('app/showNavbar')
  },
  created: function() {
    this.$store.commit('app/hideNavbar')
  },

  mounted: function() {
    // this.enableScrollWheelZoom(true);
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 113.822348
      this.center.lat = 22.635538
      this.zoom = this.zoom
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },
    showTable() {
      this.isShow = !this.isShow
    },
    isDialogTableVisible() {
      this.dialogTableVisible = !this.dialogTableVisible
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter()
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    }
  }
}

</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .bm-view {
    width: 100%;
    height: 300px;
  }

  .mapBottomTable {
    position: absolute;
    bottom: 4.5vh;
    left: 0;
    border-top: 1px solid gray;
    width: 100%;
    background-color: ghostwhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    z-index: 99;
  }

  .mapbottom {
    position: absolute;
    bottom: 0;
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
  .item-mapbottom svg{
    margin-right: 5px !important;
    height: 1.2em !important;
    width: 1.2em !important;
  }
  .item-mapbottom-right{
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .item-mapbottom-right svg{
    margin-right: 15px !important;
    height: 1.5em !important;
    width: 1.5em !important;
  }
  .mapright{
    position: absolute;
    z-index: 99;
    bottom: 40vh;
    right: -8vw;
    background-color: white;
    border: 1px solid whitesmoke;
    border-radius: 7px;
    height: 40vh;
    width: 10vw;
  }

</style>
