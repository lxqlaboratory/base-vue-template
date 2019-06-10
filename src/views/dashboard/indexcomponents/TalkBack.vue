<template>
  <div style="width: 340px">
    <audio ref="talkBackAudio" autoplay controls />
    <el-button type="primary" round style="margin-top: 20px; margin-left: 100px" @click="talkBackAction">{{ talkBack }}</el-button>
  </div>
</template>

<script>

import RecordRTC from 'recordrtc'
import { mediaTransform, realTimeMediaControl } from '@/api/terminal'

export default {
  name: 'TalkBack',
  data() {
    return {
      talkBack: '开始对讲'
    }
  },
  mounted() {
  },
  methods: {
    talkBackAction() {
      const peer = new WebSocket('ws://211.87.225.211:10004/hello')
      peer.push = peer.send
      peer.send = (data) => {
        peer.push(data)
      }
      peer.onopen = () => {
        peer.binaryType = 'blob'
        console.log('talkBack connected.')
        peer.send('start')
      }
      const audio = this.$refs.talkBackAudio
      peer.onmessage = (data) => {
        if (data.data != null) {
          audio.src = URL.createObjectURL(data.data)
        }
      }
      let recorder
      if (this.talkBack === '开始对讲') {
        mediaTransform('15153139702', 6, 2)
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
        })
        this.talkBack = '停止对讲'
      } else {
        peer.send('stop')
        realTimeMediaControl('15153139702', 6, 4, 0, 0)
        recorder.stopRecording()
        if (peer.MediaStream) peer.MediaStream.stop()
        this.talkBack = '开始对讲'
      }
    }
  }
}
</script>

<style scoped>

</style>
