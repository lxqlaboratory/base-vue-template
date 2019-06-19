<template>
  <audio ref="audio" style="display:none" controls="controls">
    <source src="../../../assets/mp3/alarm.mp3" type="audio/mpeg">
  </audio>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'WarningMessage',
  data() {
    return {

    }
  },
  created() {
  },
  mounted() {
    setTimeout(() => {
      this.webSocket()
    }, 2000)
    //setInterval(this.changeControlBottom, 15000)
  },
  destroyed() {
    this.peer.close()
  },
  computed: {
    ...mapGetters([
      'carList'
    ])
  },
  methods: {
    webSocket(){
      console.log('进入WarningMessage')
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
              //console.log(item.time)
              const currentTime = ref.$getCurrentTime.getCurrentTime()
              const minutes = ref.$timeCompareMinute.timeCompareMinute(item.time, currentTime)
              if (minutes < 1) {
                item.is_online = '在线'
              } else {
                item.is_online = '离线'
              }
              if(typeof(item.identityTime) != "undefined") {
                const currentTimeDate = new Date()
                const startTime = ref.$timeCompareMinute.strDateToDate(item.identityTime)
                //console.log(startTime)
                //console.log(currentTime)
                //console.log(currentTimeDate)
                const timeStr = ref.$timeCompareMinute.diffTime(startTime, currentTimeDate)
                item.subTime = timeStr
                //console.log('timeStr')
                //console.log(timeStr)
              }
              console.log('minutes')
              //console.log(item.time)
              //console.log(currentTime)
              console.log(minutes)

              //ref.$getWarningMessage.getWarningMessage(p,ref.socketPlateNum)
              if (p.overSpeeding === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '车辆超速',
                  type: 'error',
                  duration: 8000
                })
                console.log('车辆超速')
                ref.$refs.audio.play()
              }
              if (p.overTired === true) {
                ref.$message({
                  showClose: true,
                  message: '[' + ref.socketPlateNum + ']' + '疲劳驾驶',
                  type: 'error',
                  duration: 8000
                })
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
              //下面进行上线时间判断
              let timeStart = '20' + p.time.substring(0, 2) + '-' + p.time.substring(2, 4) + '-' + p.time.substring(4, 6) +
                ' ' + p.time.substring(6, 8) + ':' + p.time.substring(8, 10) + ':' + p.time.substring(10, 12)
              if (p.state === 1) {
                item.identityTime = timeStart
              }
            }
          })
        })
      }
      const on_error = function() {
        console.log('error')
      }
      client.connect('admin', '123', on_connect, on_error, 'jt808')
    }

  }
}
</script>

<style scoped>

</style>
