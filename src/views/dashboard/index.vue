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

          <bm-marker v-for="marker of markers" :position="{lng: marker.lng, lat: marker.lat}" title="杨培林" @click="infoWindowOpen">
            <bm-info-window title="车辆信息" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
              <div>{{ vehicleInfo.plateNum }} {{ vehicleInfo.driverName }}</div>
              <div>{{ vehicleInfo.speed }}{{ vehicleInfo.time }}</div>
              <el-button @click="isVideoMonitoringVisible">视频监控</el-button>
              <el-button @click="testMethod">定位跟踪</el-button>
              <el-button @click="isTrackPlaybackVisible">轨迹回放</el-button>
              <el-button @click="isTalkBackVisible">语音对讲</el-button>
            </bm-info-window>
          </bm-marker>

        </baidu-map>
        <!--地图右侧弹出-->
        <el-dialog title="视频监控" :visible.sync="videoMonitoringVisible">
          <video-player
            class="vjs-custom-skin"
            :options="playerOptions">
          </video-player>
          <video ref="videoElement"></video>
        </el-dialog>

        <el-dialog title="语音对讲" :visible.sync="talkBackVisible">
          <el-button @click="talkBackAction">{{ talkBack }}</el-button>
        </el-dialog>

        <el-dialog title="轨迹回放" width="80vw;" :visible.sync="trackPlaybackVisible">
          <el-input v-model="trackPlaybackStartTime" type="date" size="small" placeholder="请输入开始时间" suffix-icon="el-icon-date" />
          <el-input v-model="trackPlaybackEndTime" type="date" size="small" placeholder="请输入结束时间" suffix-icon="el-icon-date" />
          <el-button @click="trackPlaybackDraw">查询</el-button>
          <el-button @click="trackPlaybackStart">开始</el-button>
          <el-button @click="trackPlaybackStop">停止</el-button>
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
        </el-dialog>
      </el-main>
      <controlbottom />
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ControlBottom from './indexcomponents/ControlBottom'
import { getTreeVehicleFormList, getVehiclePositionFromList, getSelectedVehiclePosition } from '@/api/vehicle-list-index'
import BmLushu from '../../../node_modules/vue-baidu-map/components/extra/Lushu.vue'
import Stomp from 'stompjs'
import RecordRTC from 'recordrtc'
import FlvJs from 'flv.js'
import { mediaTransform } from '@/api/terminal'

import videoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

require('@videojs/http-streaming/dist/videojs-http-streaming.min')

export default {
  name: 'Dashboard',
  components: {
    BmLushu,
    Controlbottom: ControlBottom,
    videoPlayer
  },
  data() {
    return {
      /**
       * terminal result
       * 0：成功∕确认
       * 1：失败
       * 2：消息有误
       * 3：不支持
       */
      videoMonitoringResult: 1,
      //
      playerOptions: {
        sources: [{
          withCredentials: false,
          type: 'application/x-mpegURL',
          src: 'http://202.194.14.72:8080/hls/test.m3u8'
        }],
        controlBar: {
          timeDivider: false,
          durationDisplay: false
        },
        flash: { hls: { withCredentials: false }},
        html5: { hls: { withCredentials: false }}
      },
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
        }
      ],
      center: { lng: 0, lat: 0 },
      zoom: 13,
      videoMonitoringVisible: false,
      trackPlaybackVisible: false,
      talkBackVisible: false,
      talkBack: '开始对讲',
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
      play: false,
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
        /* { lng: 116.404844, lat: 39.911836 },
        { lng: 116.308102, lat: 40.056057 }*/
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

    const ws = new WebSocket('ws://202.194.14.72:15674/ws')
    const client = Stomp.over(ws)
    const on_connect = function() {
      console.log('connected')
      client.subscribe('JT808Server_LocationData_Queue', function(message) {
        const p = JSON.parse(message.body)
        console.log(p)
      })
      client.subscribe('JT808Server_DriverIdentity_Queue', function(message) {
        const p = JSON.parse(message.body)
        console.log(p)
      })
      client.subscribe('JT808Server_DigitWaybill_Queue', function(message) {
        const p = JSON.parse(message.body)
        console.log(p)
      })
    }
    const on_error = function() {
      console.log('error')
    }
    client.connect('admin', '123', on_connect, on_error, 'jt808')

    const peer = new WebSocket('ws://211.87.225.203:10004/hello')
    peer.push = peer.send
    peer.send = (data) => {
      peer.push(data)
    }
    peer.onopen = () => {
      peer.binaryType = 'blob'
      console.log('talkBack connected.')
    }
    let recorder
    this.talkBackAction = () => {
      if (this.talkBack === '开始对讲') {
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        }).then(function(stream) {
          peer.MediaStream = stream
          recorder = RecordRTC(stream, {
            type: 'audio',
            recorderType: RecordRTC.StereoAudioRecorder,
            disableLogs: true,
            timeSlice: 1000,
            ondataavailable: (blob) => {
              peer.send(blob)
            },
            desiredSampRate: 8000,
            numberOfAudioChannels: 1
          })
          recorder.startRecording()
          peer.send('start')
        }).catch(function(error) {
          console.log(error)
        })
        this.talkBack = '停止对讲'
      } else {
        recorder.stopRecording()
        if (peer.MediaStream) peer.MediaStream.stop()
        peer.send('stop')
        this.talkBack = '开始对讲'
      }
    }
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
    },
    testMethod() {
      mediaTransform('15153139702', 64, 0).then(response => {
        this.videoMonitoringResult = response.data.result
        console.log('response.data ' + response.data.result)
      })
    },
    isVideoMonitoringVisible() {
      this.videoMonitoringVisible = !this.videoMonitoringVisible
      console.log('hello')
      mediaTransform('15153139702', 64, 0).then(response => {
        this.videoMonitoringResult = response.data.result
      })
      console.log('videoMonitoringResult ' + this.videoMonitoringResult)
      if (FlvJs.isSupported()) {
        var flvPlayer = FlvJs.createPlayer({
          type: 'flv',
          url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=test'
        })
        flvPlayer.attachMediaElement(this.$refs.videoElement)
        flvPlayer.load()
        flvPlayer.play()
      }
    },
    isTrackPlaybackVisible() {
      this.trackPlaybackVisible = !this.trackPlaybackVisible
    },
    isTalkBackVisible() {
      this.talkBackVisible = !this.talkBackVisible
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
            if (response.data != null) {
              this.markers.push({
                lng: response.data.longitude,
                lat: response.data.latitude
              })
              this.center.lng = response.data.longitude
              this.center.lat = response.data.latitude
            }
          })
          this.markers = Array.from(new Set(this.markers))
          console.log(this.markers)
        }
      )
    },
    // 轨迹回放用到的方法
    trackPlaybackDraw() {
      getVehiclePositionFromList(this.trackPlaybackStartTime, this.trackPlaybackEndTime).then(response => {
        this.vehiclePositionFromList = response.data
        if (this.vehiclePositionFromList.style() > 0) {
          console.log(this.vehiclePositionFromList)
          console.log(this.vehiclePositionFromList[0])
          this.trackPlaybackStartPoint = { lng: this.vehiclePositionFromList[0].lng, lat: this.vehiclePositionFromList[0].lat }
          this.trackPlaybackEndPoint === { lng: this.vehiclePositionFromList[ this.vehiclePositionFromList.style() - 1].lng, lat: this.vehiclePositionFromList[ this.vehiclePositionFromList.style() - 1].lat }
          console.log('this.trackPlaybackStartPoint=' + this.trackPlaybackStartPoint)
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
    trackPlaybackStart() {
      this.play = true
    },
    trackPlaybackStop() {
      this.play = false
    }
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
