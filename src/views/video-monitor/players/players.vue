<template>
  <div class="video-div">
    <video ref="channel1" class="video1" autoplay muted />
    <video ref="channel2" class="video2" autoplay muted />
    <video ref="channel3" class="video3" autoplay muted />
    <video ref="channel4" class="video4" autoplay muted />
  </div>
</template>

<script>

import FlvJs from 'flv.js'
import { mediaTransform, realTimeMediaControl } from '@/api/terminal'
export default {
  name: 'Players',
  data() {
    return {}
  },
  props:{
    phonenum:{
      type:String,
      default:function () {
        return '23021181479'
      }
    }
  },
  mounted: function() {
    mediaTransform('23021181479', 1, 1).then(response => {
      console.info(response.data.result)
      if (FlvJs.isSupported()) {
        const flvPlayer1 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          //url: 'http://http://58.56.251.230:8079/live?port=1935&app=myapp&stream='+this.phonenum+'_1'
          url: 'http://58.56.251.230:8079/live?port=1935&app=myapp&stream=23021181479_1'
        })
        const flvPlayer2 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'http://58.56.251.230:8079/live?port=1935&app=myapp&stream=23021181479_2'
        })
        const flvPlayer3 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'http://58.56.251.230:8079/live?port=1935&app=myapp&stream=23021181479_3'
        })
        const flvPlayer4 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'hhttp://58.56.251.230:8079/live?port=1935&app=myapp&stream=23021181479_4'
        })
        flvPlayer1.attachMediaElement(this.$refs.channel1)
        flvPlayer2.attachMediaElement(this.$refs.channel2)
        flvPlayer3.attachMediaElement(this.$refs.channel3)
        flvPlayer4.attachMediaElement(this.$refs.channel4)
        flvPlayer1.load()
        flvPlayer2.load()
        flvPlayer3.load()
        flvPlayer4.load()
      }
    })
  },
  destroyed: function() {
    realTimeMediaControl('23021181479', 1, 0, 0, 0).then()
  }
}

</script>

<style scoped>
  .video-div {
    position: absolute;
    top: 0;
    left: 265px;
    padding: 0;
    width: 960px;
    height: 860px;
  }
  .video1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 470px;
    height: 400px;
    background-color: black;
  }
  .video2 {
    position: absolute;
    top: 0;
    left: 471px;
    width: 470px;
    height: 400px;
    background-color: black;
  }
  .video3 {
    position: absolute;
    top: 401px;
    left: 0;
    width: 470px;
    height: 400px;
    background-color: black;
  }
  .video4 {
    position: absolute;
    top: 401px;
    left: 471px;
    width: 470px;
    height: 400px;
    background-color: black;
  }
</style>
