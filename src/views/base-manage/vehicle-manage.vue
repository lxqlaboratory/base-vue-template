<template>
  <div class="app-container">
    车牌号：
    <el-select v-model="plateNumQuery" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.plateNum"
        :label="item.plateNum"
        :value="item.plateNum"
      />
    </el-select>
    车队：
    <el-select v-model="fleetNameQuery" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.plateNum"
        :label="item.fleetName"
        :value="item.fleetName"
      />
    </el-select>
    <el-table
      :data="tableList"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车牌号"width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.plateNum }}
        </template>
      </el-table-column>
      <el-table-column label="所属车队" width="250" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fleetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="司机姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.driverName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="司机电话" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="随车电话" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="年审时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="距离年审天数" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="二级维护时间" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="距二级维护天数" width="150" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="业主电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="押运员电话" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="安全员电话" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="亲属电话" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="公司法人电话" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCarList } from '@/api/vehicle-manage'
import ElInput from '../../../node_modules/element-ui/packages/input/src/input.vue'

export default {
  components: { ElInput },
  filters: {

  },
  data() {
    return {
      list: [
        //        {
        //
        //
        //        }
      ],
      plateNumQuery: '',
      fleetNameQuery: ''

    }
  },
  computed: {
    'tableList': function() {
      return this.list.filter(item => {
        if (!this.plateNumQuery || item.plateNum == this.plateNumQuery) { return true }
        return false
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getCarList().then(response => {
        console.log(response)
        this.list = response.data
      })
    }
  }
}
</script>
