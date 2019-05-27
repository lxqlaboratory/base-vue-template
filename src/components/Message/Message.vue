<template>    <!-- 全局提示框 -->
  <el-dialog title="警示信息" :visible.sync="visible" size="small"
             :show-close="true"
             :close-on-click-modal="false" @close='closeDialog'>
    {{message}}
    <audio ref="music" loop autoplay>
      <source src="../../assets/mp3/alarm.mp3" type="audio/mpeg">
    </audio>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
      music:{
        isPlay:false,
        currentTime:0,
        maxTime:0,
        volume:100
      }
    }
  },
  mounted(){
    this.$nextTick(()=>{
      setInterval(this.listenMusic,1000)
    })
  },
  methods: {
    listenMusic() {
      if (!this.$refs.music) {
        return
      }
      if (this.$refs.music.readyState) {
        this.music.maxTime = this.$refs.music.duration
      }
      this.music.isPlay = !this.$refs.music.paused
      this.music.currentTime = this.$refs.music.currentTime
    },
    closeDialog(){
      //将音乐关停掉
      if(this.$refs.music.paused){
        this.$refs.music.play()
      }else{
        this.$refs.music.pause()
      }
      this.music.isPlay=!this.$refs.music.paused


    }
  }
}
</script>

