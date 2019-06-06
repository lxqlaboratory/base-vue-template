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
          :data="vehicleList"
          show-checkbox
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="getCurryClick"
          @check-change="getChecked"
        />
      </el-aside>
      <el-main style="height: calc(100vh - 34px);padding:0px;">
        <baidu-map :center="center" :zoom="zoom" style="height: 100%;width: 100%;" @ready="handler" @click="getClickInfo">
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
          <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />-->
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
          <bm-circle :center="center" :radius="radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></bm-circle>
          <bm-marker v-for="marker of carList" :position="{lng: marker.longitude, lat: marker.latitude}" title="杨培林" @click="infoWindowOpen(marker)">
            <bm-info-window title="车辆信息" :position="{lng: marker.lng, lat: marker.lat}" :show="marker.showFlag" @close="infoWindowClose(marker)" @open="infoWindowOpen(marker)">
              <div><i class="el-icon-s-opportunity">{{ marker.plateNum?marker.plateNum:"数据为空" }} </i></div>
              <div><i class="el-icon-s-custom">{{ marker.driverName?marker.driverName:"数据为空" }}</i></div>
              <div><i class="el-icon-s-flag">{{ marker.speed?marker.speed+"km/h":"速度为空" }}</i></div>
              <div><i class="el-icon-time">{{ marker.time?marker.time:"时间为空"}}</i></div>
              <el-row>
                <el-button @click="toVideoMonitoring(marker.phoneNum)"><i class="el-icon-video-camera">视频监控</i></el-button>
              <el-button @click="doTempLocationTrack"><i class="el-icon-s-promotion">定位跟踪</i></el-button>
              <el-button @click="isTrackPlaybackVisible"><i class="el-icon-s-marketing">轨迹回放</i></el-button>
              </el-row>
              <el-row>
              <el-button @click="isTalkBackVisible"><i class="el-icon-phone">语音对讲</i></el-button>
              <el-button @click="isPhotoShotVisible"><i class="el-icon-picture">图像监管</i></el-button>
              <el-button @click="isDigitBillVisible"><i class="el-icon-s-ticket">电子运单</i></el-button>
              </el-row>
              <el-row>
              <el-button @click="isTextMsgVisible"><i class="el-icon-s-order">文本下发</i></el-button>
              <el-button @click="toTerminalParam(marker.phoneNum)"><i class="el-icon-menu">终端参数</i></el-button>
              </el-row>
            </bm-info-window>
          </bm-marker>


        </baidu-map>
        <audio ref="audio" style="display:none" controls="controls">
          <source src="../../assets/mp3/alarm.mp3" type="audio/mpeg">
        </audio>
        <!-- dialog -->
        <el-dialog title="文本下发" :visible.sync="textMsgVisible">
          <el-input
            v-model="textMsg"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
          />
          <el-button @click="sendTextMsg">发送</el-button>
        </el-dialog>
        <el-dialog title="电子运单" :visible.sync="digitBillVisible">
          暂时还没有电子运单
        </el-dialog>
        <el-dialog title="语音对讲" :visible.sync="talkBackVisible">
          <el-button @click="talkBackAction">{{ talkBack }}</el-button>
        </el-dialog>

        <el-dialog title="图像监管" :visible.sync="photoShotVisible">
          <el-date-picker
            v-model="photoShotTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
          />
          <el-button>查询图片</el-button>
          <el-radio-group v-model="radio">
            <el-radio :label="1">车前</el-radio>
            <el-radio :label="2">司机</el-radio>
            <el-radio :label="3">罐左侧</el-radio>
            <el-radio :label="4">罐右侧</el-radio>
          </el-radio-group>
          <el-button @click="cameraShot">图片采集</el-button>
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
        <control-bottom ref="controlBottom" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ControlBottom from './indexcomponents/ControlBottom'
import { getTreeVehicleFormList, getVehiclePositionFromList } from '@/api/vehicle-list-index'
import { cameraPhoto, mediaTransform, realTimeMediaControl, textMsg, tempLocationTrack, getTerminalParam } from '@/api/terminal'
import BmLushu from '../../../node_modules/vue-baidu-map/components/extra/Lushu.vue'
import Stomp from 'stompjs'
import RecordRTC from 'recordrtc'
export default {
  name: 'Dashboard',
  components: {
    BmLushu,
    controlBottom: ControlBottom
  },
  data() {
    return {
      /* direction: {
        url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif',
        size: { width: 300, height: 157 }
      }, */
      radio: 1,
      photoShotTime: '',
      textMsg: '',
      trackPlaybackStartTime: '',
      trackPlaybackEndTime: '',
      filterText: '',
      vehicleList: [],
      carList: [], // 车辆列表
      currentCarInfo: {}, // 当前infoWindow对应的车辆信息
      socketPlateNum: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      infoWindowShow: false,
      infoWindow: {
        show: false,
        contents: '视频监控'
      },
      center: { lng: 0, lat: 0 },
      radius:0,//画圈的半径
      zoom: 13,
      videoMonitoringVisible: false,
      trackPlaybackVisible: false,
      talkBackVisible: false,
      photoShotVisible: false,
      digitBillVisible: false,
      textMsgVisible: false,
      talkBack: '开始对讲',
      vehicleInfo: [{
        plateNum: '鲁YPL666',
        driverName: '杨培林',
        speed: '666km/h',
        time: '2018-12-25 10:49:48'
      }],
      checkedNode: {},
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
      ],
      //* *****************************************//

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    'carListShow': function() {
      return this.carList.filter(item => {
        this.plateNumList.forEach(item2 => {
          if (item2 === item.plateNum) { return true }
        })
        return false
      })
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
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
    setTimeout(() => {
      this.webSocket()
    }, 2000)

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
        mediaTransform('15153139702', 6, 2)
      } else {
        recorder.stopRecording()
        if (peer.MediaStream) peer.MediaStream.stop()
        peer.send('stop')
        this.talkBack = '开始对讲'
        realTimeMediaControl('15153139702', 6, 4, 0, 0)
      }
    }
  },
  methods: {
    fetchData() {
      getTreeVehicleFormList().then(response => {
        this.vehicleList = response.data
        this.$store.dispatch('ChangeCarTree', this.vehicleList).then()
        console.log('treeList has alrady enter AAA')
        console.log(this.vehicleList)
        const arr = this.vehicleList[0]['children']
        const dataList = []
        let n = 0
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]['children'].length !== 0) {
            for (let j = 0; j < arr[i]['children'].length; j++) {
              dataList[n++] = arr[i]['children'][j]
            }
          }
        }
        this.$store.dispatch('ChangeCarList', dataList).then()
        console.log('treeList has alrady enter')
        console.log(dataList)
        this.carList = dataList
        this.carList.forEach(item => {
          this.$set(item, 'showFlag', false)
        })
      })
    },
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
    },
    toVideoMonitoring(phoneNum) {
      mediaTransform(phoneNum, 1, 0).then()
      this.$router.push({ path: '/videoMonitor/videoMonitor' })
    },
    toTerminalParam(phoneNum) {
      getTerminalParam(phoneNum).then()
      this.$router.push({ path: '/terminalControl/terminalParam' })
    },
    isTrackPlaybackVisible() {
      this.trackPlaybackVisible = !this.trackPlaybackVisible
    },
    isTalkBackVisible() {
      this.talkBackVisible = !this.talkBackVisible
    },
    isPhotoShotVisible() {
      this.photoShotVisible = !this.photoShotVisible
    },
    isDigitBillVisible() {
      this.digitBillVisible = !this.digitBillVisible
    },
    isTextMsgVisible() {
      this.textMsgVisible = !this.textMsgVisible
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },
    webSocket() {
      const ws = new WebSocket('ws://202.194.14.72:15674/ws')
      var ref = this
      const client = Stomp.over(ws)
      const on_connect = function() {
        console.log('connected')
        client.subscribe('/exchange/jt808/location', function(message) {
          const p = JSON.parse(message.body)
          console.log('ref.carList.filter进入')
          const terminalPhone = p.terminalPhone
          console.log(ref.carList)
          ref.carList.filter(item => {
            if (item.phoneNum == terminalPhone) {
              ref.socketPlateNum = item.plateNum
              // 设置 carList 的值   "latitude" : 36665736, "longitude" : 117132753
              item.longitude = p.longitude/1000000.0
              item.latitude = p.latitude/1000000.0
              item.ACC = p.ACC
              item.receiveData=1//代表了已经接收到了信息
              console.log(item.longitude+"--->"+item.latitude)
              console.log('terminalPhone')
              if (p.overSpeeding === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆超速',
                  type: 'error',
                  duration: 8000
                })
                console.log('车辆超速')
                /* insertViolation(terminalPhone, '超速',p.longitude, p.latitude).then(res => {

                }).catch(e => {

                })*/
                ref.$refs.audio.play()
              }
              if (p.overTired === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '疲劳驾驶',
                  type: 'error',
                  duration: 8000
                })
                /* insertViolation(terminalPhone, '疲劳驾驶',p.longitude, p.latitude).then(res => {

                }).catch(e => {

                })*/
                ref.$refs.audio.play()
              }
              if (p.dangeous === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '危险预警',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.GNSSFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + 'GNSS模块发生故障',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.GNSSAntennaFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + 'GNSS天线未接或被剪断',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.GNSSAntennaShortCircuit === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + 'GNSS天线短路',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.terminalMainPowerUndervoltage === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '终端主电源欠压',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.terminalMainPowerFailure === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '终端主电源掉电',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.TerminalLCDFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '终端LED或显示屏故障',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.TTSFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + 'TTS模块故障',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.cameraFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '摄像头故障',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.ICCardFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '道路运输证IC卡模块故障',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.driveTimeout === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '当天累积驾驶超时',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.parkingOvertime === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '超时停车',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.roadTimeout === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '路段行驶时间/不足',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.roadFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '路线偏离报警',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.VSSFault === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆VSS故障',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.vehicleOilException === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆油量异常',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.vehicleTheft === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆被盗',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.vehicleIllegalIgnition === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆非法点火',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.vehicleIllegalShift === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆非法位移',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.collisionWarning === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '碰撞预警',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.rolloverWarning === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '侧翻预警',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.illegalOpenDoor === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '非法开门报警',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.isLocation === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '未定位',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.speeding === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '超速预警',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.tired === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '疲劳预警',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.throughArea === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '进出区域',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.throughRoad === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '进出路线',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.encrypt === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '经纬度未经保密插件加密',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.vehicleOil === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆油路断开',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.vehicleCircut === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆电路断开',
                  type: 'error',
                  duration: 8000
                })
              }
              if (p.doorLock === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车门解锁',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.frontDoorOpen === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '门开(前门)',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.middleDoorOpen === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '门开(中门)',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.endDoorOpen === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '门开(后门)',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.driverDoorOpen === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '门开(驾驶席门)',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.otherDoorOpen === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '门开(自定义)',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.GPS === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '未使用 GPS 卫星进行定位',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.beidou === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '未使用北斗卫星进行定位',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.GLONASS === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '未使用 GLONASS 卫星进行定位',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.Galileo === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '未使用 Galileo 卫星进行定位',
                  type: 'warning',
                  duration: 8000
                })
              }
            }
          })
        })
        client.subscribe('/exchange/jt808/digitWaybill', function(message) {
          const p = JSON.parse(message.body)
          // console.log(p)
        })
        client.subscribe('/exchange/jt808/driverIdentity', function(message) {
          const p = JSON.parse(message.body)
          // console.log(p)
        })
      }
      const on_error = function() {
        console.log('error')
      }
      client.connect('admin', '123', on_connect, on_error, 'jt808')

      setInterval(this.changeControlBottom, 15000)
    },
    changeControlBottom() {
      console.log('console.log(this.carList[0].receiveData)')
      console.log(this.carList[0].receiveData)
      if(this.carList[0].receiveData==0||this.carList[0].receiveData===0){
        console.log('receiveData_Enter A')
        this.carList[0].longitude = (116.404 + Math.random() / 20).toFixed(3)
        this.carList[0].latitude = (39.915 + Math.random() / 20).toFixed(3)
      }
      if(this.carList[1].receiveData==0||this.carList[1].receiveData===0){
        console.log('receiveData_Enter B')
        this.carList[1].longitude = (116.404 + Math.random() / 20).toFixed(3)
        this.carList[1].latitude = (39.915 + Math.random() / 20).toFixed(3)
      }
      console.log(this.carList[2].receiveData)
      if(this.carList[2].receiveData==0||this.carList[2].receiveData===0){
        console.log('receiveData_Enter C')
        this.carList[2].longitude = (116.404 + Math.random() / 20).toFixed(3)
        this.carList[2].latitude = (39.915 + Math.random() / 20).toFixed(3)
      }
      },
    infoWindowClose(marker) {
      marker.showFlag = false
    },
    infoWindowOpen(marker) {
      marker.showFlag = true
      this.currentCarInfo = marker
      console.log(this.currentCarInfo)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getChecked() {
      this.checkedNodes = this.$refs.tree2.getCheckedNodes()
      // console.log(this.checkedNodes)
      this.checkedNodes.forEach(item => {
        if (item.plateNum !== null) { this.plateNumList2.push(item.plateNum) }
      })
      this.plateNumList = new Set(this.plateNumList2)
      console.log(this.plateNumList)
      // this.doLocation()
    },
    getCurryClick(event) {
      // this.checkedNode = this.$refs.tree2.getCurrentNode
      console.log(event)
      this.center.lng = event.longitude
      this.center.lat = event.latitude
      this.radius=500
      let that=this;
      var t = setTimeout(function (){
        that.radius=0 //半径设置成0圈就没啦
        console.log(that.radius)
      }, 2000);
    },

    /* doLocation() {
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
    }, */
    // 轨迹回放用到的方法
    trackPlaybackDraw() {
      getVehiclePositionFromList(this.trackPlaybackStartTime, this.trackPlaybackEndTime).then(response => {
        this.vehiclePositionFromList = response.data
        if (this.vehiclePositionFromList.length() > 0) {
          console.log(this.vehiclePositionFromList)
          console.log(this.vehiclePositionFromList[0])
          this.trackPlaybackStartPoint = { lng: this.vehiclePositionFromList[0].lng, lat: this.vehiclePositionFromList[0].lat }
          this.trackPlaybackEndPoint = { lng: this.vehiclePositionFromList[ this.vehiclePositionFromList.length() - 1].lng, lat: this.vehiclePositionFromList[ this.vehiclePositionFromList.length() - 1].lat }
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
    },
    // ////////////////////////////////////////////
    // terminal
    messageHandler(response) {
      switch (response.data.result) {
        case -1:
          this.$message.error('消息发送失败')
          break
        case 0:
          this.$message({
            message: '消息发送成功',
            type: 'success'
          })
          break
        case 1:
          this.$message.error('消息发送失败, 未知原因')
          break
        case 2:
          this.$message.error('消息发送失败, 消息有误')
          break
        case 3:
          this.$message.error('消息发送失败, 不支持')
          break
      }
    },
    cameraShot() {
      const loading = this.$loading({
        lock: true,
        text: '消息发送中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      cameraPhoto('15153139702', this.radio).then(response => {
        console.log(response.data.result)
        loading.close()
        this.messageHandler(response)
      }).catch(() => {
        loading.close()
      })
    },
    sendTextMsg() {
      const loading = this.$loading({
        lock: true,
        text: '消息发送中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      textMsg('15153139702', 0, this.textMsg).then(response => {
        loading.close()
        this.messageHandler(response)
      }).catch(() => {
        loading.close()
      })
    },
    doTempLocationTrack() {
      const loading = this.$loading({
        lock: true,
        text: '消息发送中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      tempLocationTrack('15153139702', 0, this.textMsg).then(response => {
        loading.close()
        this.messageHandler(response)
      }).catch(() => {
        loading.close()
      })
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
  .el-aside {
    background-color:#304156;
  }
  .el-tree {
    background-color:#304156;
    color:#9b9b83
  }

</style>
