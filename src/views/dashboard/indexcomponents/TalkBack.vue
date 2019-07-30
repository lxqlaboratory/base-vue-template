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
      talkBack: '开始对讲',
      peer: null,
      recorder: null,
      stream: null
    }
  },
  created() {
  },
  mounted() {
    this.peer = new WebSocket('ws://127.0.0.1:10004/hello')
    this.peer.push = this.peer.send
    this.peer.send = (data) => {
      this.peer.push(data)
    }
    this.peer.onopen = () => {
      this.peer.binaryType = 'blob'
    }
    const audio = this.$refs.talkBackAudio
    this.peer.onmessage = (data) => {
      if (data.data != null) {
        audio.src = URL.createObjectURL(data.data)
      }
    }
    this.peer.onclose = () => {
      console.log('closed')
    }
  },
  destroyed() {
    this.peer.close()
  },
  methods: {
    async talkBackAction() {
      if (this.talkBack === '开始对讲') {
        this.peer.send('start')
        this.stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        this.recorder = new RecordRTC(this.stream, {
          type: 'audio',
          recorderType: RecordRTC.StereoAudioRecorder,
          disableLogs: true,
          timeSlice: 1000,
          ondataavailable: (blob) => {
            this.peer.send(blob)
          },
          desiredSampRate: 8000,
          numberOfAudioChannels: 1
        })
        mediaTransform('15153139702', 6, 2)
        this.recorder.startRecording()
        this.talkBack = '停止对讲'
      } else {
        this.peer.send('stop')
        realTimeMediaControl('15153139702', 6, 4, 0, 0)
        if (this.stream) {
          this.stream.stop()
          this.stream = null
        }
        this.recorder.stopRecording()
        this.recorder = null
        this.talkBack = '开始对讲'
      }
    }
  }
}
</script>

<style scoped>

</style>
