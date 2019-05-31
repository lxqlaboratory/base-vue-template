<template>
  <div>
    <el-container>
      <video-player
        class="vjs-custom-skin"
        :options="playerOptions"
      />
      <el-main class="video-div">
        <video ref="channel1" class="video1" />
        <video ref="channel2" class="video2" />
        <video ref="channel3" class="video3" />
        <video ref="channel4" class="video4" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mediaTransform } from '@/api/terminal'
import FlvJs from 'flv.js'
import videoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
require('@videojs/http-streaming/dist/videojs-http-streaming.min')

export default {
  name: 'VideoMonitor',
  components: {
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
      }
    }
  },
  mounted: function() {
    if (FlvJs.isSupported()) {
      const flvPlayer1 = FlvJs.createPlayer({
        cors: true,
        withCredentials: false,
        isLive: true,
        type: 'flv',
        url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=test'
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
      flvPlayer1.play()
      flvPlayer2.load()
      flvPlayer2.play()
      flvPlayer3.load()
      flvPlayer3.play()
      flvPlayer4.load()
      flvPlayer4.play()
    }
  },
  methods: {
    testMethod() {
      mediaTransform('15153139702', 64, 0).then(response => {
        this.videoMonitoringResult = response.data.result
        console.log('response.data ' + response.data.result)
      })
      console.log('videoMonitoringResult ' + this.videoMonitoringResult)
    }
  }
}
</script>

<style scoped>
  .video-div {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    width: 960px;
    height: 860px;
    z-index: 9999;
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
