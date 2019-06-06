<template>
  <baidu-map
    class="map"
    :center="center"
    :scroll-wheel-zoom="true"
    :zoom="zoom"
    @moving="syncCenterAndZoom"
    @moveend=""
    @zoomend=""
    style="height: 100%;width: 100%;"
    @ready="handler"
    @click="getClickInfo">
    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
    <!--<bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />-->
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
    <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />

    <bm-marker v-for="marker of carList" :position="{lng: marker.longitude, lat: marker.latitude}" @click="infoWindowOpen(marker)">
      <bm-info-window title="车辆信息" :position="{lng: marker.lng, lat: marker.lat}" :show="marker.showFlag" @close="infoWindowClose(marker)" @open="infoWindowOpen(marker)">
        <div class="BMap_bubble_content" style="width: 400px;">
          <div class="popup-basic">
            <div class="popup-basic-line">
              <div style="float: left; width: 160px;">
                <img class="popup-img" src="img/icon-frame/c.png">
                <span class="popup-span">{{marker.plateNum}}}</span>
                </div>
              <div style="float: left; width: 160px">
                <img class="popup-img" src="img/icon-frame/r16.png">
               <span class="popup-span">{{marker.driverName}}}</span>
                </div>
              </div>
          </div>
        </div>
        <!--<div>{{ marker.plateNum }} {{ marker.driverName }}</div>-->
        <div>{{ marker.speed }}{{ marker.time }}</div>
        <el-button @click="toVideoMonitoring(marker.phoneNum)">视频监控</el-button>
        <el-button @click="doTempLocationTrack">定位跟踪</el-button>
        <el-button @click="isTrackPlaybackVisible">轨迹回放</el-button>
        <el-button @click="isTalkBackVisible">语音对讲</el-button>
        <el-button @click="isPhotoShotVisible">图像监管</el-button>
        <el-button @click="isDigitBillVisible">电子运单</el-button>
        <el-button @click="isTextMsgVisible">文本下发</el-button>
      </bm-info-window>
    </bm-marker>

  </baidu-map>
</template>

<script>
    export default {
        name: "test"
    }
</script>

<style scoped>
  .popup-basic{
    border: 1px solid #f7f7f7;
    width: 100%;
    height: auto;
    background-color: #FBFBFD;
    font-size: 14px;
  }
  .popup-basic-line{
    width: 100%;
    line-height: 30px;
    border-bottom: 1px solid #eee
  }
  .popup-basic-line:after {
    content: "";
    display: block;
    clear: both;
  }
  .popup-img{
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-left: 3px;
  }
  .small-img{
    width: 16px; height: 16px;
  }
  .popup-span{
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
    font-size: 14px;
  }

  .popup-btn{
    width: 95px; float: left; margin-top: 3px;
  }
  #sele-map .l-btn-icon-left .l-btn-text{
    margin:0;
    margin-right: 20px;
  }
  .progress-bar i{
    position: absolute;
    top: 40%;
    left: 45%;
    color:#004d8d;
    font-size:80px;
    z-index:100

  }
</style>
