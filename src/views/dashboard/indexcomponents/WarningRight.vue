<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="违章处理" name="first" >用户管理</el-tab-pane>
      <el-tab-pane label="离线预警" name="second" >配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'WarningRight',
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>

</style>
