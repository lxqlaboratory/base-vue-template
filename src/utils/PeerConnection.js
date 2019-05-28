import RecordRTC from '../../node_modules/recordrtc/RecordRTC'
export default {
  PeerConnection(socketURL) {
    this.userid = Math.round(Math.random() * 9999999999) + 9999999999
    if (!socketURL) console.log('Socket-URL is mandatory.')
    let recorder
    this.startTransmitting = (stream) => {
      recorder = RecordRTC(stream, {
        type: 'audio',
        recorderType: StereoAudioRecorder,
        disableLogs: true,
        timeSlice: 1000,
        ondataavailable: function(blob) {
          // invokeSaveAsDialog(blob, 'audio.wav');
          socket.send(blob)
        },
        desiredSampRate: 16000,

        numberOfAudioChannels: 1
      })
      recorder.startRecording()
      socket.send('start')
    }

    this.close = () => {
      recorder.stopRecording()
      if (this.MediaStream) this.MediaStream.stop()
      socket.send('stop')
    }

    let socket = socketURL
    if (typeof socketURL === 'string') {
      socket = new WebSocket(socketURL)
      socket.push = socket.send
      socket.send = (data) => {
        // socket.push(JSON.stringify(data));

        socket.push(data)
      }
    }
    socket.onopen = () => {
      socket.binaryType = 'blob'
      console.log('websocket connection opened.')
    }
    socket.onmessage = onmessage
  }
}
