<template>
  <div style="width: 750px">
    <el-row :gutter="40">
      <el-col :span="18">
        <el-date-picker
          v-model="photoShotTime"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
        />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" round @click="getPhotoList">查询图片</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="40" style="margin-top: 10px">
      <el-col :span="16" style="margin-top: 10px">
        <el-radio-group v-model="radio">
          <el-radio :label="1">车前</el-radio>
          <el-radio :label="2">司机</el-radio>
          <el-radio :label="3">罐左侧</el-radio>
          <el-radio :label="4">罐右侧</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="6" offset="2">
        <el-button type="danger" round @click="cameraShot">图片采集</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="12">
        <!--el-image :src="src" />-->
        <el-carousel height="300px" direction="vertical" :autoplay="false">
          <el-carousel-item v-for="item in listPhotoSrc" :key="item">
            <el-image :src="item" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="12">
        <!-- TODO -->
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getVehiclePhotoInfoList } from '@/api/photo-info'

export default {
  name: 'PhotoManager',
  data() {
    return {
      listPhotoSrc: [],
      photoShotTime: '',
      radio: 1
    }
  },
  props: {
    terminalPhone: {
      type: String, required: true
    }
  },
  methods: {
    // photo
    timeFormatToString(time) {
      // 2019-07-15 12:00:00
      // 190608000000
      return time.substring(2, 4) + time.substring(5, 7) + time.substring(8, 10) +
        time.substring(11, 13) + time.substring(14, 16) + time.substring(17, 19)
    },
    // ////////////////////////////////////////////
    // photo
    getPhotoList() {
      if (this.photoShotTime == '') {
        this.$message({
          showClose: true,
          message: '必须输入开始时间和结束时间',
          type: 'error'
        })
      } else {
        console.log(this.photoShotTime[0].toLocaleString())
        this.timea = this.timeFormatToString(this.photoShotTime[0].toLocaleString())
        this.timeb = this.timeFormatToString(this.photoShotTime[1].toLocaleString())
        console.log(this.timea)

        getVehiclePhotoInfoList(this.terminalPhone, this.timea, this.timeb).then(response => {
          console.log(response.data)
          this.listPhotoSrc = []
          const listData = response.data
          listData.filter(item => {
            this.listPhotoSrc.push('http://58.56.251.230:8080/photos/' + this.terminalPhone + '/' + item + '.jpg')
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
