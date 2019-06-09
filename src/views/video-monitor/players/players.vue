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
  mounted: function() {
    mediaTransform('15153139702', 1, 1).then(response => {
      if (FlvJs.isSupported()) {
        const flvPlayer1 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=15153139702_1'
        })
        const flvPlayer2 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=test'
        })
        const flvPlayer3 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=test'
        })
        const flvPlayer4 = FlvJs.createPlayer({
          cors: true,
          withCredentials: false,
          isLive: true,
          type: 'flv',
          url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=test'
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
    realTimeMediaControl('15153139702', 1, 0, 0, 0).then()
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
