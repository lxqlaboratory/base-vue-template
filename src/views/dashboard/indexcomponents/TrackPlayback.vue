<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-date-picker
          v-model="TrackPlaybackShotTime"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
        />
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
        phoneNum:'',
        TrackPlaybackShotTime: '',
        //trackPlaybackStartTime:'',
        //trackPlaybackEndTime:'',
        center: { lng: 116.404844, lat: 39.911836 },
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
    props:{
      phonenum:{
        type:String,
        default:function () {
          return ''
        }
      }
    },
    methods: {
      trackPlaybackDraw() { // 查询一段时间间隔的坐标，画路径
        //this.trackPlaybackStartPoint = { lng: 116.404844, lat: 39.911836 }
       // this.trackPlaybackEndPoint = { lng: 116.308102, lat: 40.056057 }

        if (this.TrackPlaybackShotTime == '') {
          this.$message({
            showClose: true,
            message: '必须输入开始时间和结束时间',
            type: 'error'
          })
        }/*else if(this.phonenum=='23021181541'){
          this.trackPlaybackStartPoint = { lng: 116.89305771801756, lat: 39.52543810992425 }
          this.trackPlaybackEndPoint = { lng: 116.52424324963377, lat: 39.508090279866586 }
        }else if(this.phonenum=='23021181423'){
          this.trackPlaybackStartPoint = { lng: 116.37013448730467, lat: 37.3788007058978 }
          //this.trackPlaybackEndPoint = { lng: 116.5011121179199, lat: 37.364067100466464 }
          this.trackPlaybackEndPoint = { lng: 116.67311844189453, lat: 37.27738898300958}
        }*/else{
          var trackPlaybackStartTime = this.TrackPlaybackShotTime[0].toLocaleString()
          var trackPlaybackEndTime = this.TrackPlaybackShotTime[1].toLocaleString()
          console.log(this.phonenum+trackPlaybackStartTime+trackPlaybackEndTime)
          getVehiclePositionFromList(this.phonenum,trackPlaybackStartTime, trackPlaybackEndTime).then(response => {
            this.vehiclePositionFromList = response.data
            console.log("AAAAAAAAA")
            console.log(this.vehiclePositionFromList)

            if (this.vehiclePositionFromList.length > 0) {
              this.vehiclePositionFromList[0].lng=this.vehiclePositionFromList[0].longitude/ 1000000.0
              this.vehiclePositionFromList[0].lat=this.vehiclePositionFromList[0].latitude/ 1000000.0
              this.vehiclePositionFromList[1].lng=this.vehiclePositionFromList[1].longitude/ 1000000.0
              this.vehiclePositionFromList[1].lat=this.vehiclePositionFromList[1].latitude/ 1000000.0
              this.trackPlaybackStartPoint = { lng: this.vehiclePositionFromList[0].lng, lat: this.vehiclePositionFromList[0].lat }
              this.center.lng = this.trackPlaybackStartPoint.longitue
              this.center.lat = this.trackPlaybackStartPoint.latitude

              this.trackPlaybackEndPoint = { lng: this.vehiclePositionFromList[1].lng, lat: this.vehiclePositionFromList[1].lat}
              console.log("BBBBBBB")
              console.log(this.trackPlaybackStartPoint)
              console.log(this.trackPlaybackEndPoint)
            }
            else{
              alert("数据为空!")
            }
          })
        }

      },
      reset() {
        this.play = false
      },
      handleSearchComplete(res) {
        console.log("SSSSSSSSS")
        console.log(res);
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
