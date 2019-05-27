<template>    <!-- 全局提示框 -->
  <el-dialog title="违章信息" :visible.sync="visible">
    {{message}}
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      message: ""
    }
  }
}
</script>

