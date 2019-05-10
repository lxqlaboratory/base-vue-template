<template>
  <div style="height: calc(100vh - 34px);width: 100%;">
    <baidu-map :center="center" :zoom="zoom" style="height: 100%;width: 100%;" @ready="handler" @click="getClickInfo">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />-->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />

      <bm-marker :position="markerPoint" @click="infoWindowOpen">
        <bm-info-window title="Test" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
          {{ infoWindow.contents }}
          <el-button @click="isVideoMonitoringVisible">视频监控</el-button>
        </bm-info-window>
      </bm-marker>

    </baidu-map>
    <!--地图右侧弹出-->

    <el-dialog title="视频监控" :visible.sync="videoMonitoringVisible">
      <video-player
        ref="videoPlayer"
        class="video-player vjs-custom-skin"
        :playsinline="true"
        :options="playerOptions"
      />
    </el-dialog>
    <controlbottom />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ControlBottom from './indexcomponents/ControlBottom'

export default {
  name: 'Dashboard',
  components: {
    Controlbottom: ControlBottom
  },
  data() {
    return {
      infoWindowShow: false,
      infoWindow: {
        show: false,
        contents: '视频监控'
      },
      markerPoint: {
        lng: 116.404,
        lat: 39.900
      },
      center: { lng: 0, lat: 0 },
      zoom: 13,
      videoMonitoringVisible: false,

      playerOptions: {
      // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/dash+xml',
          src: 'http://202.194.14.72:8080/dash/test.mpd'
        }],
        // poster: "poster.jpg", // 你的封面地址
        width: document.documentElement.clientWidth
      // notSupportedMessage: '此视频暂无法播放，请稍后再试'
      //  controlBar: {
      //   timeDivider: true,
      //   durationDisplay: true,
      //   remainingTimeDisplay: false,
      //   fullscreenToggle: true //全屏按钮
      //  }
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  activated: function() {
    this.$store.commit('app/hideNavbar')
  },
  deactivated: function() {
    this.$store.commit('app/showNavbar')
  },
  created: function() {
    this.$store.commit('app/hideNavbar')
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = this.zoom
    },
    isVideoMonitoringVisible() {
      this.videoMonitoringVisible = !this.videoMonitoringVisible
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },

    infoWindowClose() {
      this.infoWindow.show = false
    },
    infoWindowOpen() {
      this.infoWindow.show = true
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

</style>
