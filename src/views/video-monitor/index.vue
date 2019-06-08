<template>
  <div style="height: calc(100vh - 84px);">
    <el-container style="height: calc(100vh - 84px);">
      <el-aside width="265px">
        <el-input
          v-model="filterText"
          style="width:230px;margin-left: 18px;margin-bottom: 10px;margin-top: 8px;background-color:#304156;"
          placeholder="输入关键字进行过滤"
        />

        <el-tree
          ref="tree"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="reload"
        />
      </el-aside>
      <el-main>
        <!--<video-player
          class="vjs-custom-skin"
          :options="playerOptions"
        />-->
        <players v-if="isRouterAlive" ref="players" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mediaTransform } from '@/api/terminal'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
require('@videojs/http-streaming/dist/videojs-http-streaming.min')
import { mapGetters } from 'vuex'
import Players from './players/players'

export default {
  name: 'VideoMonitor',
  components: {
    players: Players
  },
  data() {
    return {
      isRouterAlive: true,
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
      filterText: '',
      data: [{}],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters([
      'carTree'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted: function() {
    this.data = this.carTree
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    testMethod() {
      mediaTransform('15153139702', 64, 0).then(response => {
        this.videoMonitoringResult = response.data.result
        console.log('response.data ' + response.data.result)
      })
      console.log('videoMonitoringResult ' + this.videoMonitoringResult)
    },
    reload(event) {
      console.log(event)
      this.isRouterAlive = !this.isRouterAlive
    }
  }
}
</script>

<style scoped>
  .el-aside {
    background-color:#304156;
  }
  .el-tree {
    background-color:#304156;
    color:#9b9b83
  }
</style>
