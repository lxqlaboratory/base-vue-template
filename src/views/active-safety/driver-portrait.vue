<template>
  <div class="app-container" style="height: calc(100vh - 1px);">
  <div class="div-a">
    <div style="height:10%;margin-top: 10px;text-align:center">企业名称：鑫华汽车运输公司 近一年报警总数</div>
    <div class="chart" style="height:90%;margin-bottom: 10px"></div>
  </div>
  <div class="div-b">
    <div class="block" style="margin-left: 40px;">
      <span class="demonstration">日期</span>
      <el-date-picker style="margin-left: 20px;"
        v-model="monthvalue"
        type="month"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <el-table
      :data="list"
      height="220"
      border
      style="width: 100%;margin-top: 10px;">
      <el-table-column
        prop="violationParameterName"
        label="报警类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="count"
        label="报警数量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="rate"
        label="报警占比">
      </el-table-column>
    </el-table>
  </div>
  <div class="div-c">
    <div class="chart2" style="height:100%;margin-bottom: 10px">
    </div>
  </div>
  <div class="div-d">
    <div class="chart4" style="height:100%;margin-bottom: 10px"></div>
  </div>
  </div>
</template>

<script>
  import { getViolationInfoByParameterAndMonth } from '@/api/active-safety'
  import { getViolationInfoByMonth } from '@/api/active-safety'
export default {

  created() {
    this.fetchData()
  },
  data() {
    return {
      monthvalue:null,
      tableData: [],
      list:[],
      treelist:[],
      treelista:['08-07', '08-08', '08-09', '08-10', '08-11', '08-12', '08-13'],
      treelistb:[10, 52, 200, 334, 390, 330, 220]
    }
  },
  methods: {
    fetchData() {
      getViolationInfoByParameterAndMonth().then(response => {
        this.list = response.data

      }),
      getViolationInfoByMonth().then(response => {
           this.treelist = response.data;
           console.log(this.treelist)
        this.treelista.push('06-01'
        )
        this.treelistb.push(555)
           this.treelist.forEach(item=>{

         })
      })
    },
    // 初始化echartlegendArr
    initChart () {
      var myChart = this.$echarts.init(document.querySelector('.chart'));
      myChart.setOption({
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : this.treelista,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'总共',
            type:'bar',
            barWidth: '60%',
            data:this.treelistb
          }
        ]
      });
    },
    initChart2 () {
      var myChart = this.$echarts.init(document.querySelector('.chart2'));
      myChart.setOption({
        backgroundColor: '#45515a',
        //标题
        title: {
          text: '流量来源',
          subtext:'饼图示例',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc',
            fontStyle:'italic'//标题字体
          }
        },
        //弹窗，响应鼠标指向，显示具体细节
        tooltip : {
          trigger: 'item',//以具体项目触发弹窗
          /*
          内容格式器，一共有abcd四个代号，例如在饼图中，{a}指系列，即流量来源，{b}指数据项目，如搜索引擎，{c}指数值，如
          value，{d}百分比。{x}本身代表了相应字符，可以和其他字符拼凑，在弹窗中显示
          */
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        //图例，选择要显示的项目
        legend:{
          orient:'vertical',
          left:'left',
          textStyle:{
            color:'#c8c8d0'
          },
          data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']  //注意要和数据的name相对应
        },
        //工具箱
        //视觉映射组件，将数据映射到视觉元素上
        visualMap: {
          show: false,
          min: 10,
          max: 650,
          dimension: 0, //选取数据的维度，如人数据：[身高，体重]，则1代表将体重进行映射，默认值为数组的最后一位
          // seriesIndex: 4, //选取数据集合中的哪个数组，如{一班}，{二班}，默认选取data中的所有数据集
          inRange: {
            //选定了要映射的对象，用inRange详细写要渲染的具体细节，[x，y]中x指最小值对应的量（亮度，饱和度等），y指最大值对应的量，其余的按各自value线性渲染
            color:['red'],
            colorLightness: [0,1],
            colorSaturation:[0,1]
          }
        },
//数据
        series : [
          {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
              {value:335, name:'直接访问'},
              {value:310, name:'邮件营销'},
              {value:274, name:'联盟广告'},
              {value:235, name:'视频广告'},
              {value:400, name:'搜索引擎'}
            ].sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',//角度和半径展现百分比，'area'只用半径展现
            label: { //饼图图形的文本标签
              normal: {  //下同，normal指在普通情况下样式，而非高亮时样式
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {  //引导线样式
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.5, //0-1，越大越平滑弯曲
                length: 10,  //从块到文字的第一段长
                length2: 20  //拐弯到文字的段长
              }
            },
            itemStyle: { //图例样式
              normal: {
                color: '#97413c',
                shadowBlur: 50,//阴影模糊程度
                shadowColor: 'rgba(0, 0, 0, 0.5)'//阴影颜色，一般黑
              }
            },

            animationType: 'scale', //初始动画效果，scale是缩放，expansion是展开
            animationEasing: 'elasticOut', //初始动画缓动效果
            animationDelay: function (idx) {  //数据更新动画时长，idx限定了每个数据块从无到有的速度
              return Math.random() * 200;
            }
          }
        ]
      });
    },
    initChart4 () {
      var myChart = this.$echarts.init(document.querySelector('.chart4'));
      myChart.setOption({
        title: {
          text: '堆叠区域图'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[120, 132, 101, 134, 90, 230, 210]
          },
          {
            name:'联盟广告',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[220, 182, 191, 234, 290, 330, 310]
          },
          {
            name:'视频广告',
            type:'line',
            stack: '总量',
            areaStyle: {},
            data:[150, 232, 201, 154, 190, 330, 410]
          },
          {
            name:'直接访问',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[320, 332, 301, 334, 390, 330, 320]
          },
          {
            name:'搜索引擎',
            type:'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {normal: {}},
            data:[820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
      this.initChart2()
      this.initChart4()
    })
  },
  watch: {
    monthvalue(val) {
      var y = this.monthvalue.getFullYear();
      var m = this.monthvalue.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = this.monthvalue.getDate();
      d = d < 10 ? ('0' + d) : d;
      /*var h = this.monthvalue.getHours();
      var minute = this.monthvalue.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      var second= this.monthvalue.getSeconds();
      second = minute < 10 ? ('0' + second) : second;
      */
      var data1=y + '-' + m + '-' + d;
      console.log("this.monthvalue="+this.monthvalue)
      console.log("data1="+data1)
    }
  }
}
</script>
<style>
  .div-a{ height:40%;float:left;width:49%;box-shadow:0px 0px 10px #aaa;}
  .div-b{ height:40%;float:right;width:49%;box-shadow:0px 0px 10px #aaa;}
  .div-c{ height:50%;float:left;width:49%;margin-top:20px;box-shadow:0px 0px 10px #aaa;}
  .div-d{ height:50%;float:right;width:49%;margin-top:20px;box-shadow:0px 0px 10px #aaa;}
</style>
