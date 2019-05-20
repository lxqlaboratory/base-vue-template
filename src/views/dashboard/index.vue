<template>
  <div style="height: calc(100vh - 34px);width: 100%;">
    <el-container style="height: calc(100vh - 34px);" >
      <el-aside width="265px"  >
        <el-input style="width:230px;margin-left: 18px;margin-bottom: 10px;margin-top: 8px;background-color:#304156;"
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
        <el-tree
          class="filter-tree"
          :data="data"
          border-radius:0px
          show-checkbox
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree2">
        </el-tree>
      </el-aside>
      <el-main style="height: calc(100vh - 34px);padding:0px;">
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
      </el-main>
    </el-container>

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

.
<script>
  import { mapGetters } from 'vuex'
  import ControlBottom from './indexcomponents/ControlBottom'
  import { getTreeVehicleFormList } from '@/api/vehicle-list-index'
  export default {
    name: 'Dashboard',
    components: {
      Controlbottom: ControlBottom
    },
    data() {
      return {
        filterText: '',
        data:{},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
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
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        getTreeVehicleFormList().then(response => {
          this.data = response.data
          console.log("this.data="+this.data )
        })
      },
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
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
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
  .el-aside {
    background-color:#304156;
  }
  .el-tree {
    background-color:#304156;
    color:#9b9b83
  }

</style>
