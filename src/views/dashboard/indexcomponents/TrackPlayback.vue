<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="9">
        <el-input v-model="trackPlaybackStartTime" size="small" type="date" placeholder="请输入开始时间" suffix-icon="el-icon-date" />
      </el-col>
      <el-col :span="9">
        <el-input v-model="trackPlaybackEndTime" size="small" type="date" placeholder="请输入结束时间" suffix-icon="el-icon-date" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" round size="small" @click="trackPlaybackDraw">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="success" round size="small" @click="trackPlaybackStart">开始</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" round size="small" @click="trackPlaybackStop">停止</el-button>
      </el-col>
    </el-row>
    <div style="width: 100%;height: 50vh;">
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
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { getTreeVehicleFormList,getVehiclePositionFromList } from '@/api/vehicle-list-index'
  import { cameraPhoto, textMsg, tempLocationTrack, getTerminalParam } from '@/api/terminal'
  import BmLushu from '../../../../node_modules/vue-baidu-map/components/extra/Lushu.vue'
  import Stomp from 'stompjs'
  import { getWeatherInfo } from '@/api/weather'
  import { getLocationDetailInfo } from '@/api/location'
  import { getVehiclePhotoInfoList } from '@/api/photo-info'
  import { getMessageTemplateList } from '@/api/template-manage'
  export default {
    name: 'TrackPlayback',
    components: {
      BmLushu,
    },
    data() {
      return {
        play: false,
        path: [

        ],
        icon: {
          url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
          size: { width: 52, height: 26 },
          opts: { anchor: { width: 27, height: 13 }}
        },
        trackPlaybackStartPoint: { },
        trackPlaybackEndPoint: { },
        trackPlaybackWayPointList: [
          /* { lng: 116.404844, lat: 39.911836 },
          { lng: 116.308102, lat: 40.056057 }*/
        ],
        vehiclePositionFromList:[{}],
      }
    },
    computed: {},
    methods: {
      trackPlaybackDraw() { // 查询一段时间间隔的坐标，画路径
        //this.trackPlaybackStartPoint = { lng: 116.404844, lat: 39.911836 }
        //this.trackPlaybackEndPoint = { lng: 116.308102, lat: 40.056057 }
        if(!this.trackPlaybackStartTime){
          alert("请选择开始时间!")
          return
        }
        if(!this.trackPlaybackEndTime){
          alert("请选择开始时间!")
          return
        }
        getVehiclePositionFromList(this.currentCarInfo.phoneNum,this.trackPlaybackStartTime, this.trackPlaybackEndTime).then(response => {
          this.vehiclePositionFromList = response.data
          console.log(this.vehiclePositionFromList)
          if (this.vehiclePositionFromList.length > 0) {
            this.trackPlaybackStartPoint = { lng: this.vehiclePositionFromList[0].lng, lat: this.vehiclePositionFromList[0].lat }
            this.trackPlaybackEndPoint = { lng: this.vehiclePositionFromList[ this.vehiclePositionFromList.length - 1].lng, lat: this.vehiclePositionFromList[ this.vehiclePositionFromList.length - 1].lat }
          }
          else{
            alert("数据为空!")
            //演示的时候如果数据是空的就显示假数据
            this.trackPlaybackStartPoint = { lng: 116.404844, lat: 39.911836 }
            this.trackPlaybackEndPoint = { lng: 116.308102, lat: 40.056057 }
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
      trackPlaybackStart() { // 开始回放
        this.$refs.lushu.$emit('start', this.$refs.lushu)
        this.play = true
      },
      trackPlaybackStop() { // 停止回放
        this.play = false
      },
    }
  }

</script>
