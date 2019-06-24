<template>
  <div>
    <el-tabs style="height: 450px; width: 768px" v-model="activeName" type="border-card" :tab-position="left" :stretch="true">
      <el-tab-pane label="今日违章情况" name="first" >
        <el-table :data="violationList" border fit highlight-current-row height="380" style="margin-top:10px">
          <el-table-column align="center" label="ID" min-width="15">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="车牌号" min-width="30" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.plateNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="违章时间" min-width="40" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.violationTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="违章类型" min-width="30" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.violationParameterName }} </span>
            </template>
          </el-table-column>
          <el-table-column label="位置" min-width="50" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.location }} </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="离线情况" name="second" >
        <el-table :data="offlineList" height="380" border fit highlight-current-row style="margin-top:10px">
          <el-table-column align="center" label="ID" min-width="15">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="车牌号" min-width="30" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.plateNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="30" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.is_online }}</span>
            </template>
          </el-table-column>
          <el-table-column label="离线时长" min-width="50" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.subTime }} </span>
            </template>
          </el-table-column>
          <el-table-column label="上次在线时间" min-width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.time }} </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="信息发送" name="third" >
        <el-table :data="textMsgList" height="380" border fit highlight-current-row style="margin-top:10px">
          <el-table-column align="center" label="ID" min-width="15">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="车牌号" min-width="30" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.plateNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发送内容" min-width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发送时间" min-width="40" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.addTime }} </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getViolationTodayList,getOfflineList ,getTodayVehicleTextMsgInfo} from '@/api/warning-right'
export default {
  name: 'WarningRight',
  data() {
    return {
      activeName: 'first',
      violationList:[],
      offlineList:[],
      textMsgList:[],
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    fetchData() {
      getViolationTodayList().then(response => {
        this.violationList = response.data
      }),
      getOfflineList().then(response => {
        this.offlineList = response.data
      }),
      getTodayVehicleTextMsgInfo().then(response => {
        this.textMsgList = response.data
      })
    },
  }
}
</script>

<style scoped>

</style>
