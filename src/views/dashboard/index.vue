<template>
  <div style="height: calc(100vh - 34px);width: 100%;">
    <baidu-map :center="center" :zoom="zoom" style="height: 100%;width: 100%;" @ready="handler" @click="getClickInfo">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT" />
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
    </baidu-map>
    <!--地图右侧弹出-->
    <div class="mapright" />

    <div class="mapbottom">
      <div class="item-mapbottom">
        <svg-icon icon-class="tree" />
        智能选车
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="tree" />
        智能选车
      </div>

      <div class="item-mapbottom">
        <svg-icon icon-class="tree" />
        智能选车
      </div>
      <div class="item-mapbottom">
        <svg-icon icon-class="tree" />
        智能选车
      </div>
      <div class="item-mapbottom-right">
        <svg-icon icon-class="arrow-up" />
        <svg-icon icon-class="maxscreen" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 13
    }
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
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted: function() {
    // this.enableScrollWheelZoom(true);
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.center.lng = 113.822348
      this.center.lat = 22.635538
      this.zoom = this.zoom
    },
    getClickInfo(e) {
      console.log(e.point.lng)
      console.log(e.point.lat)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
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

  .bm-view {
    width: 100%;
    height: 300px;
  }

  .mapbottom {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4.5vh;
    border-top: 1px solid gray;
    width: 100%;
    background-color: ghostwhite;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    z-index: 99;
  }

  .item-mapbottom {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    min-width: 10vw;
    color: black;
  }
  .item-mapbottom svg{
    margin-right: 5px !important;
    height: 1.2em !important;
    width: 1.2em !important;
  }
  .item-mapbottom-right{
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .item-mapbottom-right svg{
    margin-right: 15px !important;
    height: 1.5em !important;
    width: 1.5em !important;
  }
  .mapright{
    position: absolute;
    z-index: 99;
    bottom: 40vh;
    right: -8vw;
    background-color: white;
    border: 1px solid whitesmoke;
    border-radius: 7px;
    height: 40vh;
    width: 10vw;
  }

</style>
