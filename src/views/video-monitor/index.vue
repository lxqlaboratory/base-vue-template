<template>
  <div class="el-container">
    <video-player
      class="vjs-custom-skin"
      :options="playerOptions"
    />
    <video ref="videoElement" />
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
      },
    }
  },
  methods: {
    testMethod() {
      mediaTransform('15153139702', 64, 0).then(response => {
        this.videoMonitoringResult = response.data.result
        console.log('response.data ' + response.data.result)
      })
      console.log('videoMonitoringResult ' + this.videoMonitoringResult)
      if (FlvJs.isSupported()) {
        const flvPlayer = FlvJs.createPlayer({
          type: 'flv',
          url: 'http://202.194.14.72:8080/live?port=1935&app=myapp&stream=test'
        })
        flvPlayer.attachMediaElement(this.$refs.videoElement)
        flvPlayer.load()
        flvPlayer.play()
      }
    }
  }
}
</script>

<style scoped>

</style>
