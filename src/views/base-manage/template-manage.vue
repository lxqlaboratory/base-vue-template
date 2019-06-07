<template>
  <div class="app-container">
    <el-button type="primary" round @click="openSave()" style="margin-bottom: 10px">增加</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="10">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" min-width="30" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="信息内容" min-width="30" align="center">
        <template slot-scope="scope">
          {{ scope.row.messageContent }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" min-width="30" align="center">
        <template slot-scope="scope">
          {{ scope.row.addTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="20" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)"  size="small">编辑</el-button>
          <el-button @click="deleteContent(scope.row)"  size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form :model="insertRow" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
          <el-form-item label="编号:">
            <el-input v-model="insertRow.id"  readonly="true" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="信息内容:">
            <el-input  v-model="insertRow.messageContent" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="添加时间:">
            <el-input  v-model="insertRow.addTime" readonly="true" style="width: 80%" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="保存" :visible.sync="dialogSaveFormVisible" width="500px">
        <el-form :model="save" label-position="left" label-width="140px" style="width: 430px; margin-left:50px;">
          <el-form-item label="信息内容:">
            <el-input  v-model="save.messageContent" style="width: 80%" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSaveFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTemplate()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMessageTemplateList,saveMessageTemplateList,deleteMessageTemplateList,editMessageTemplateList } from '@/api/template-manage'

export default {
  filters: {

  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogSaveFormVisible: false,
      insertRow:{
        id: '',
        messageContent: ''
      },
      save:{
        id: '',
        messageContent: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMessageTemplateList().then(response => {
        this.list = response.data
        console.log(this.list)
      })
      this.listLoading = false
    },
    update(){
      this.dialogFormVisible = false
      editMessageTemplateList(this.insertRow.id, this.insertRow.messageContent).then(res => {
        if(res.re==1){
          this.$message({
            message: '更新成功',
            type: 'success'
          });
        }else{
          this.$message.error('更新失败');
        }
      }).catch(e => {

      })
    },
    saveTemplate() {
      this.dialogSaveFormVisible = false
      saveMessageTemplateList(this.save.messageContent).then(res => {
        console.log(res)
        if(res.re==1){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        }else{
          this.$message.error('保存失败');
        }
        this.fetchData()
      }).catch(e => {

      })
    },
    openSave(){
      this.dialogSaveFormVisible = true
    },
    edit(item) {
      this.insertRow = item
      this.dialogFormVisible = true
    },
    deleteContent(item) {
      this.insertRow = item
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMessageTemplateList(this.insertRow.id).then(res => {
          if(res.re==1){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.fetchData()
          }else{
            this.$message.error('删除失败');
          }
        }).catch(e => {

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })

    }
  }
}
</script>
<style>
  colgroup {
    position: absolute;
    width: 100% !important;
    display: flex;
  }
  col {
    flex: 1;
    text-align: center;
  }
  table,tbody,thead {
    width: 100% !important;
  }
</style>
