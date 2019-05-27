<template>
  <div style="height: calc(100vh - 34px);width: 100%;">
    <el-container style="height: calc(100vh - 34px);">
      <el-aside width="265px">
        <el-input
          v-model="filterText"
          style="width:230px;margin-left: 18px;margin-bottom: 10px;margin-top: 8px;background-color:#304156;"
          placeholder="输入关键字进行过滤"
        />
        <el-tree
          ref="tree2"
          class="filter-tree"
          :data="data"
          border-radius:0px
          show-checkbox
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @check-change="getChecked"
        />
      </el-aside>
      <el-main style="height: calc(100vh - 34px);padding:0px;">
        <baidu-map :center="center" :zoom="zoom" style="height: 100%;width: 100%;" @ready="handler" @click="getClickInfo">
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
          <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />-->
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />

          <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}" @click="infoWindowOpen" title="杨培林">
            <bm-info-window title="车辆信息" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
              <div>{{ vehicleInfo.plateNum }} {{ vehicleInfo.driverName }}</div>
              <div>{{ vehicleInfo.speed }}{{ vehicleInfo.time }}</div>
              <el-button @click="isVideoMonitoringVisible">视频监控</el-button>
              <el-button>定位跟踪</el-button>
              <el-button @click="isTrackPlaybackVisible">轨迹回放</el-button>
            </bm-info-window>
          </bm-marker>

        </baidu-map>
        <!--地图右侧弹出-->
      </el-main>
    </el-container>

    <el-dialog title="视频监控" :visible.sync="videoMonitoringVisible">
      <video-player
        ref="videoPlayer"
        class="video-player vjs-custom-skin"
        :playsinline="true"
        :options="playerOptions"
      />
    </el-dialog>
    <controlbottom />


      <el-dialog  title="轨迹回放" width="80vw;"  :visible.sync="trackPlaybackVisible">
        <el-input v-model="trackPlaybackStartTime" type="date" size="small" placeholder="请输入开始时间" suffix-icon="el-icon-date"></el-input>
        <el-input v-model="trackPlaybackEndTime" type="date" size="small" placeholder="请输入结束时间" suffix-icon="el-icon-date"></el-input>
        <el-button  @click="trackPlaybackDraw" >查询</el-button>
        <el-button  @click="trackPlaybackStart" >开始</el-button>
        <el-button  @click="trackPlaybackStop" >停止</el-button>
        <div  style="width: 100%;height: 50vh;">
        <baidu-map class="map" :center="center" :zoom="11" style="height: 100%;width: 100%;">
          <bm-driving
            :start="trackPlaybackStartPoint"
            :end="trackPlaybackEndPoint"
            :waypoints="trackPlaybackWayPointList"
            :panel="false"
            :auto-viewport="true"
            @searchcomplete="handleSearchComplete"
          />
          <bm-lushu
            ref="lushu"
            :path="path"
            :icon="icon"
            :play="play"
            :rotation="true"
            @stop="reset"
          />
        </baidu-map>
      </div>
    </el-dialog>
    <controlbottom />
  </div>
</template>


<script>
  import { mapGetters } from 'vuex'
  import ControlBottom from './indexcomponents/ControlBottom'
  import { getTreeVehicleFormList,getVehiclePositionFromList,getSelectedVehiclePosition } from '@/api/vehicle-list-index'
  import BmLushu from "../../../node_modules/vue-baidu-map/components/extra/Lushu.vue"
  import {BmlLushu} from 'vue-baidu-map'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input.vue";
export default {
  name: 'Dashboard',
  components: {
    ElButton,
    BmLushu,
    Controlbottom: ControlBottom
  },
  data() {
    return {
      filterText: '',
      data: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      infoWindowShow: false,
      infoWindow: {
        show: false,
        contents: '视频监控'
      },
      markers2: [],
      markers: [
        {
          lng: 116.404,
          lat: 39.900
        },
        {
          lng: 116.405,
          lat: 39.901
        },
        {
          lng: 116.406,
          lat: 39.899
        },
        {
          lng: 116.404,
          lat: 39.898
        },
      ],
      center: { lng: 0, lat: 0 },
      zoom: 13,
      videoMonitoringVisible: false,
      trackPlaybackVisible: false,

      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/dash+xml',
          src: 'http://202.194.14.72:8080/dash/test.mpd'
        }],
        // poster: "poster.jpg", // 你的封面地址
        width: document.documentElement.clientWidth
        // notSupportedMessage: '此视频暂无法播放，请稍后再试'
        //  controlBar: {
        //   timeDivider: true,
        //   durationDisplay: true,
        //   remainingTimeDisplay: false,
        //   fullscreenToggle: true //全屏按钮
        //  }
      },
      vehicleInfo: [{
        plateNum: '鲁YPL666',
        driverName: '杨培林',
        speed: '666km/h',
        time: '2018-12-25 10:49:48'
      }],
      checkedNodes: [],
      plateNumList: [],
      plateNumList2: [],
      // 下边是轨迹回放的data
      play: true,
      path: [

      ],
      icon: {
        url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 }}
      },
      trackPlaybackStartPoint: { lng: 116.404844, lat: 39.911836 },
      trackPlaybackEndPoint: { lng: 116.308102, lat: 40.056057 },
      trackPlaybackWayPointList: [
        { lng: 116.404844, lat: 39.911836 },
        { lng: 116.308102, lat: 40.056057 }
      ]
      //* *****************************************//
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
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
    this.fetchData()
  },
  methods: {
    fetchData() {
      getTreeVehicleFormList().then(response => {
        this.data = response.data
        console.log('this.data=' + this.data)
      })
    },
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = this.zoom
    },
    isVideoMonitoringVisible() {
      this.videoMonitoringVisible = !this.videoMonitoringVisible
    },
    isTrackPlaybackVisible() {
      this.trackPlaybackVisible = !this.trackPlaybackVisible
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },

    infoWindowClose() {
      this.infoWindow.show = false
    },
    infoWindowOpen() {
      this.infoWindow.show = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getChecked() {
      this.checkedNodes = this.$refs.tree2.getCheckedNodes()
      console.log(this.checkedNodes)
      this.checkedNodes.forEach(item => {
        if (item.plateNum) { this.plateNumList.push(item.plateNum) }
      })
      this.plateNumList2 = new Set(this.plateNumList)
      console.log(this.plateNumList)
      this.doLocation()
    },
    doLocation() {
      this.plateNumList.forEach(item => {
          getSelectedVehiclePosition(item).then(response => {
            console.log("response.data")
            console.log(response.data)
            //console.log(this.markers)
            if(response.data!=null)
              this.markers.push({lng:response.data.longitude,lat:response.data.latitude})
              this.center.lng=response.data.longitude
              this.center.lat=response.data.latitude
          })
          this.markers2=new Set(this.markers)
          this.markers=this.markers2
          console.log(this.markers)
        }
      )
    },
    // 轨迹回放用到的方法
    trackPlaybackDraw(){
      getVehiclePositionFromList(this.trackPlaybackStartTime,this.trackPlaybackEndTime).then(response => {
        this.vehiclePositionFromList = response.data
        if(this.vehiclePositionFromList.style()>0){
          console.log(this.vehiclePositionFromList)
          console.log(this.vehiclePositionFromList[0])
          this.trackPlaybackStartPoint={lng:this.vehiclePositionFromList[0].lng,lat:this.vehiclePositionFromList[0].lat}
          this.trackPlaybackEndPoint== {lng:this.vehiclePositionFromList[ this.vehiclePositionFromList.style()-1].lng,lat:this.vehiclePositionFromList[ this.vehiclePositionFromList.style()-1].lat}
          console.log("this.trackPlaybackStartPoint="+this.trackPlaybackStartPoint )
        }
      })
    },
    reset() {
      this.play = false
    },
    handleSearchComplete(res) {
      this.path = res.getPlan(0).getRoute(0).getPath()

      console.log(this.path)
    },
    trackPlaybackStart() {
      this.$refs.lushu.$emit('start', this.$refs.lushu)
    },
    trackPlaybackStart(){
      this.play=true
    },
    trackPlaybackStop(){
      this.play=false
    },
    // ////////////////////////////////////////////
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
  .el-aside {
    background-color:#304156;
  }
  .el-tree {
    background-color:#304156;
    color:#9b9b83
  }

</style>
