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
          node-key="id"
          :default-checked-keys="[1,2,3,4,5]"
          :filter-node-method="filterNode"
          @node-click="getCurryClick"
          @check-change="getChecked"
        />
      </el-aside>
      <el-main style="height: calc(100vh - 34px);padding:0px;">
        <baidu-map
          class="map"
          :center="center"
          :scroll-wheel-zoom="true"
          :zoom="zoom"
          style="height: 100%;width: 100%;"
          @moving="syncCenterAndZoom"
          @moveend=""
          @zoomend=""
          @ready="handler"
          @click="getClickInfo"
        >
          <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT" />
          <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />-->
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
          <bm-circle
            :center="center"
            :radius="radius"
            stroke-color="blue"
            :stroke-opacity="1"
            :stroke-weight="2"
          />
          <bm-marker
            v-for="marker of carList"
            :position="{lng: marker.longitude, lat: marker.latitude}"
            :icon="{url: marker.imageUrl, size: {width: 30, height: 30}}"
            :title="marker.plateNum"
            @click="infoWindowOpen(marker)"
          >
            <bm-label
              :content="marker.plateNum"
              :position="{lng: marker.longitude, lat: marker.latitude}"
              :offset="{width: -20, height: 25}"
              :label-style="{color : 'black',
                             borderColor: '#CDBA96',
                             backgroundColor: null,
                             fontSize : '12px',
                             height : '20px',
                             lineHeight : '20px',
                             fontFamily:'微软雅黑'}"
            />
            <bm-info-window
              :position="{lng: marker.lng, lat: marker.lat}"
              :show="marker.showFlag"
              @close="infoWindowClose(marker)"
              @open="infoWindowOpen(marker)"
            >
              <div class="BMap_bubble_content" style="width: 480px;">
                <div class="popup-basic">
                  <div class="popup-basic-line">
                    <div style="float: left; width: 200px;">
                      <span class="svg-container">
                        <svg-icon icon-class="carNum" />
                      </span>
                      <span class="popup-span">{{ marker.plateNum }}</span>
                    </div>
                    <div style="float: left; width: 200px">
                      <span class="svg-container">
                        <svg-icon icon-class="driver" />
                      </span>
                      <span class="popup-span">{{ marker.driverName }}</span>
                    </div>
                  </div>
                  <div class="popup-basic-line">
                    <div style="float: left; width: 200px;">
                      <span class="svg-container">
                        <svg-icon icon-class="speed1" />
                      </span>
                      <span class="popup-span">{{ marker.speed }}km/h</span>
                    </div>
                    <div style="float: left; width: 200px">
                      <span class="svg-container">
                        <svg-icon icon-class="time1" />
                      </span>
                      <span class="popup-span">{{ marker.time }}</span>
                    </div>
                  </div>
                  <div class="popup-basic-line" style="border-bottom: none; height:auto">
                    <span class="svg-container">
                      <svg-icon icon-class="direct" />
                    </span>
                    <span class="popup-span" style="width:90%;font-weight:normal">{{ locationDetailInfo }}</span>
                  </div>
                  <div class="popup-basic-line" style="border-bottom: none; float: left; height: 10%; margin-top:3px">
                    <div v-for="item in weatherInfo" style="float: left;">
                      <img :src="weatherInfo.dayPictureUrl" class="popup-img" style="height: 20px; width: 28px;">
                      <img :src="weatherInfo.nightPictureUrl" class="popup-img" style="height: 20px; width: 28px;">
                      <span class="popup-span" style="font-weight:normal">{{ weatherInfo.weather }}</span>
                      <span class="popup-span" style="font-weight:normal">{{ weatherInfo.dushu }}</span>
                      <span class="popup-span" style="font-weight:normal">{{ weatherInfo.wind }}</span>
                    </div>
                  </div>
                </div>
                <div style="width: 100%; height: 28%; float: left; padding-top: 8px; margin-top:5px">
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="videoMonitor" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="toVideoMonitoring(marker.phoneNum)">视频监控</span>
                  </div>
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="direct" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="doTempLocationTrack(marker.phoneNum)">定位跟踪</span>
                  </div>
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="trackplay" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="isTrackPlaybackVisible(marker.phoneNum)">轨迹回放</span>
                  </div>
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="voice" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="isTalkBackVisible(marker.phoneNum)">语音对讲</span>
                  </div>
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="picture" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="isPhotoShotVisible(marker.phoneNum)">图像监管</span>
                  </div>
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="bill" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="isDigitBillVisible(marker.phoneNum)">电子运单</span>
                  </div>
                  <div class="popup-btn">
                    <span class="svg-container">
                      <svg-icon icon-class="text" />
                    </span>
                    <span class="popup-span" style="margin-left: 2px;font-weight:normal" @click="isTextMsgVisible(marker.phoneNum)">文本下发</span>
                  </div>
                </div>
              </div>
            </bm-info-window>
          </bm-marker>

        </baidu-map>

        <audio ref="audio" style="display:none" controls="controls">
          <source src="../../assets/mp3/alarm.mp3" type="audio/mpeg">
        </audio>

        <!-- dialog -->
        <el-dialog title="文本下发" width="435px" :visible.sync="textMsgVisible">
          短信模板：
          <el-select v-model="messageQuery" style="margin-left: 10px;width:310px;margin-bottom: 10px" filterable placeholder="请选择" @change="fnMessageSelect">
            <el-option
              v-for="item in templateList"
              :key="item.messageContent"
              :label="item.messageContent"
              :value="item.messageContent"
            />
          </el-select>
          <el-input
            v-model="textMsg"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            style="margin-bottom: 10px"
          />
          <el-button type="primary" round style="margin-left: 310px" @click="sendTextMsg">发送</el-button>
        </el-dialog>

        <el-dialog title="电子运单" :visible.sync="digitBillVisible">
          暂时还没有电子运单
        </el-dialog>

        <el-dialog title="语音对讲" width="340px" :visible.sync="talkBackVisible">
          <talk-back v-if="talkBackVisible" />
        </el-dialog>

        <el-dialog title="图像监管" width="750px" :visible.sync="photoShotVisible">
          <photo-manager />
        </el-dialog>

        <el-dialog title="轨迹回放" width="800px" :visible.sync="trackPlaybackVisible">
          <TrackPlayback v-if="trackPlaybackVisible"/>
        </el-dialog>
        <control-bottom ref="controlBottom" @selectrow="tableselectrow" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ControlBottom from './indexcomponents/ControlBottom'
import TalkBack from './indexcomponents/TalkBack'
import TrackPlayback from './indexcomponents/TrackPlayback'
import PhotoManager from './indexcomponents/PhotoManager'
import { getTreeVehicleFormList, getVehiclePositionFromList } from '@/api/vehicle-list-index'
import { cameraPhoto, textMsg, tempLocationTrack, getTerminalParam } from '@/api/terminal'
import BmLushu from '../../../node_modules/vue-baidu-map/components/extra/Lushu.vue'
import Stomp from 'stompjs'
import { getWeatherInfo } from '@/api/weather'
import { getLocationDetailInfo } from '@/api/location'
import { getMessageTemplateList } from '@/api/template-manage'

export default {
  name: 'Dashboard',
  components: {
    BmLushu,
    controlBottom: ControlBottom,
    talkBack: TalkBack,
    TrackPlayback:TrackPlayback,
    photoManager: PhotoManager
  },
  data() {
    return {
      srcAudio: '',
      phoneNum: '',
      textMsg: '',
      trackPlaybackStartTime: '',
      trackPlaybackEndTime: '',
      filterText: '',
      vehicleList: [],
      messageQuery: '',
      templateList: [],
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
      radius: 0, // 画圈的半径
      zoom: 13,
      videoMonitoringVisible: false,
      trackPlaybackVisible: false,
      talkBackVisible: false,
      photoShotVisible: false,
      digitBillVisible: false,
      textMsgVisible: false,
      weatherInfo: [{
        dayPictureUrl: '',
        nightPictureUrl: '',
        weather: '',
        dushu: '',
        wind: ''
      }],
      direction: 0,
      // imageUrl: require("@/icons/svg/icon-car/"+this.getImgPath(0)),
      locationDetailInfo: '',
      checkedNode: {},
      checkedNodes: [],
      plateNumList: [],
      plateNumList2: [],
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
    this.direction = 0
    this.$store.commit('app/hideNavbar')
    this.fetchData()
    setTimeout(() => {
      this.webSocket()
    }, 2000)
  },
  mounted() {
  },
  methods: {
    getImgPath(direction,is_online) { // 获取markerImg的路径
      //console.log('getImgPath')
      //console.log(is_online)
      //console.log(direction)
      let pic = (direction + 22.5) / 45 + 1
      if (pic > 8) {
        pic = 8
      }
      if(typeof(is_online) == "undefined"){
        return parseInt(pic) + '.png'
      }
      if(is_online === '熄火'){
        return parseInt(pic+8) + '.png'
      }
      else if(is_online === '离线'){
        return parseInt(pic+16) + '.png'
      }
      else{
        return parseInt(pic) + '.png'
      }
    },
    tableselectrow(rowplateNum) {
      this.carList.forEach(item => {
        if (rowplateNum == item.plateNum) {
          //console.log('item.latitude+item.longitude')
          //console.log(item.latitude)
          if(typeof(item.latitude) == "undefined"||typeof(item.longitude) == "undefined"){
            this.$message({
              showClose: true,
              message: '[' + item.plateNum + ']' + '定位信息未找到',
              type: 'error',
              duration: 8000
            })
          }else{
          this.center.lng = item.longitude
          this.center.lat = item.latitude
          this.radius = 800
          const that = this
          var t = setTimeout(function() {
            that.radius = 0 // 半径设置成0圈就没啦
            console.log(that.radius)
          }, 1000)
          }
        }
      })
    },
    _getLocationDetailInfo({ lng, lat }) {
      getLocationDetailInfo({ lng, lat }).then(response => {
        const addressComponent = response.result.addressComponent
        const info = addressComponent.province + ',' + addressComponent.city + ',' + addressComponent.district + ',' +
          addressComponent.street + '' + addressComponent.street_number + '' + addressComponent.direction
        const pois = response.result.pois.reverse()
        let seInfo = ''; let neInfo = ''; let swInfo = ''; let nwInfo = ''
        pois.forEach(item => {
          if (item.direction == '东南') {
            seInfo = ',' + item.name + '' + item.direction + '约' + item.distance + '米'
          } else if (item.direction == '东北') {
            neInfo = ',' + item.name + '' + item.direction + '约' + item.distance + '米'
          } else if (item.direction == '西南') {
            swInfo = ',' + item.name + '' + item.direction + '约' + item.distance + '米'
          } else if (item.direction == '西北') {
            nwInfo += ',' + item.name + '' + item.direction + '约' + item.distance + '米'
          }
        })
        this.locationDetailInfo = info + seInfo + neInfo + swInfo + nwInfo + '.'
        return info + seInfo + neInfo + swInfo + nwInfo + '.'
      })
    },
    _getWeatherInfo({ lng, lat }) {
      getWeatherInfo({ lng, lat }).then(response => {
        this.weatherInfo.dayPictureUrl = response.results[0].weather_data[0].dayPictureUrl
        this.weatherInfo.nightPictureUrl = response.results[0].weather_data[0].nightPictureUrl
        this.weatherInfo.weather = response.results[0].weather_data[0].weather
        this.weatherInfo.dushu = response.results[0].weather_data[0].date.substring(14, response.results[0].weather_data[0].date.length - 1)
        this.weatherInfo.wind = response.results[0].weather_data[0].wind
        console.log()
      }).catch((err) => {
        console.log(err)
      })
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    fetchData() {
      getTreeVehicleFormList().then(response => {
        this.vehicleList = response.data
        this.$store.dispatch('ChangeCarTree', this.vehicleList).then()
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
        this.carList = dataList
        console.log(this.carList)
        this.changeControlBottom();

      }),
      getMessageTemplateList().then(response => {
        this.templateList = response.data
      })
    },
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
    },
    toVideoMonitoring(phoneNum) {
      // mediaTransform(phoneNum, 1, 0).then()
      this.$router.push({ path: '/videoMonitor/videoMonitor' })
    },
    toTerminalParam(phoneNum) {
      getTerminalParam(phoneNum).then()
      this.$router.push({ path: '/terminalControl/terminalParam' })
    },
    isTrackPlaybackVisible(phoneNum) {
      this.phoneNum=phoneNum
      this.trackPlaybackVisible = !this.trackPlaybackVisible
    },
    isTalkBackVisible(phoneNum) {
      this.talkBackVisible = !this.talkBackVisible
      this.phoneNum=phoneNum
    },
    isPhotoShotVisible(phoneNum) {
      this.phoneNum=phoneNum
      this.photoShotVisible = !this.photoShotVisible
    },
    isDigitBillVisible(phoneNum) {
      this.phoneNum=phoneNum
      this.digitBillVisible = !this.digitBillVisible
    },
    isTextMsgVisible(phoneNum) {
      this.phoneNum=phoneNum
      this.textMsgVisible = !this.textMsgVisible
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
      this._getWeatherInfo({ lng: e.point.lng, lat: e.point.lat })
      this._getLocationDetailInfo({ lng: e.point.lng, lat: e.point.lat })
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
              var resultPoint =ref.$gpsToBaiduPoint.GpsToBaiduPoint(p.latitude / 1000000.0, p.longitude / 1000000.0)
              console.log(resultPoint)
              item.longitude = resultPoint[1]
              item.latitude = resultPoint[0]
              item.acc = p.ACC
              item.direction = p.direction
              item.speed = p.speed/10.0
              item.elevation = p.elevation
              item.receiveData = 1// 代表了已经接收到了信息
              item.simulation = p.simulation
              item.wirelessIntensity = p.wirelessIntensity
              item.satellitesNum = p.satellitesNum
              console.log(item.longitude + '--->' + item.latitude)
              // p.time=190610093043
              item.time = '20' + p.time.substring(0, 2) + '-' + p.time.substring(2, 4) + '-' + p.time.substring(4, 6) +
                ' ' + p.time.substring(6, 8) + ':' + p.time.substring(8, 10) + ':' + p.time.substring(10, 12)
              console.log(item.time)
              const currentTime = ref.$getCurrentTime.getCurrentTime()
              const minutes = ref.$timeCompareMinute.timeCompareMinute(item.time, currentTime)
              if (minutes < 1) {
                item.is_online = '在线'
              } else {
                item.is_online = '离线'
              }
              console.log('minutes')
              console.log(item.time)
              console.log(currentTime)
              console.log(minutes)
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
                  message: '[' + ref.socketPlateNum + ']' + '进入区域',
                  type: 'warning',
                  duration: 8000
                })
              }
              if (p.throughRoad === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '进入路线',
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
          const terminalPhone = p.terminalPhone
          ref.carList.filter(item => {
            if (item.phoneNum == terminalPhone) {
              item.driverName = p.driverName
              item.qualificationCode = p.qualificationCode
              item.authorityName = p.authorityName
            }
          })
        })
      }
      const on_error = function() {
        console.log('error')
      }
      client.connect('admin', '123', on_connect, on_error, 'jt808')

      setInterval(this.changeControlBottom, 15000)
    },
    changeControlBottom() {
      this.carList.forEach(item => {
        if(item.receiveData == 0 || item.receiveData === 0){
          item.acc = false
          item.direction = '1'
          item.speed = 0
          item.is_online = '离线'
          //item.longitude=116.98695649121092
          //item.latitude=38.65221385853693
        }
        this.$set(item, 'showFlag', false)
        this.$set(item, 'imageUrl', require('@/icons/svg/icon-car/' + this.getImgPath(item.direction,item.is_online)))
        // this._getLocationDetailInfo({ lng:item.longitude, lat: item.latitude })
        //console.log(this._getLocationDetailInfo({lng:item.longitude,lat:item.latitude}))
        //this._getLocationDetailInfo({lng:item.longitude,lat:item.latitude})
        this.$set(item, 'locationDetail',  this._getLocationDetailInfo({ lng:item.longitude, lat: item.latitude }))
      })
    },
    infoWindowClose(marker) { // infoWindow关闭
      marker.showFlag = false
    },
    infoWindowOpen(marker) { // infoWindow打开
      marker.showFlag = true
      this.currentCarInfo = marker // 记录当前infoWindow的车辆信息
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getChecked() { // 获取树上选中的节点
      this.checkedNodes = this.$refs.tree2.getCheckedNodes()
      // console.log(this.checkedNodes)
      this.checkedNodes.forEach(item => {
        if (item.plateNum !== null) { this.plateNumList2.push(item.plateNum) }
      })
      this.plateNumList = new Set(this.plateNumList2)
      console.log(this.plateNumList)
      // this.doLocation()
    },
    getCurryClick(event) { // 获取树上刚刚被点击的结点
      // this.checkedNode = this.$refs.tree2.getCurrentNode
      console.log(event)
      this.center.lng = event.longitude
      this.center.lat = event.latitude
      this.radius = 800
      const that = this
      var t = setTimeout(function() {
        that.radius = 0 // 半径设置成0圈就没啦
        //console.log(that.radius)
      }, 1000)
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
      cameraPhoto(this.phoneNum, this.radio).then(response => {
        console.log(response.data.result)
        loading.close()
        this.messageHandler(response)
      }).catch(() => {
        loading.close()
      })
    },
    fnMessageSelect() {
      this.textMsg = this.messageQuery
    },
    sendTextMsg() {
      const loading = this.$loading({
        lock: true,
        text: '消息发送中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      textMsg(this.phoneNum, 0, this.textMsg).then(response => {
        loading.close()
        this.messageHandler(response)
      }).catch(() => {
        loading.close()
      })
    },
    doTempLocationTrack(phoneNum) {
      const loading = this.$loading({
        lock: true,
        text: '消息发送中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      tempLocationTrack(phoneNum, 0, this.textMsg).then(response => {
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
  .popup-basic{
    border: 1px solid #f7f7f7;
    width: 100%;
    height: auto;
    background-color: #FBFBFD;
    font-size: 20px;
  }
  .popup-basic-line{
    width: 100%;
    line-height: 40px;
    border-bottom: 1px solid #eee
  }
  .popup-basic-line:after {
    content: "";
    display: block;
    clear: both;
  }
  .popup-img{
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-left: 3px;
  }
  .small-img{
    width: 30px; height: 30px;
  }
  .popup-span{
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
    font-size: 16px;
  }
  .popup-span:hover {
     color: #2878d6;
   }

  .popup-btn{
    width: 100px; float: left; margin-top: 5px;margin-bottom: 5px;margin-left: 10px;
  }
  #sele-map .l-btn-icon-left .l-btn-text{
    margin:0;
    margin-right: 20px;
  }
  .progress-bar i{
    position: absolute;
    top: 40%;
    left: 45%;
    color:#004d8d;
    font-size:80px;
    z-index:100

  }
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
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
