<template>
  <div class="app-container">
    车队名称：
    <el-select v-model="companyNameQuery"  style="margin-bottom: 10px" filterable placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.companyName"
        :label="item.companyName"
        :value="item.companyName"
      />
    </el-select>
    <el-button type="primary" round @click="openSave()" style="margin-bottom: 10px">增加</el-button>
    <el-table
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" min-width="5">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="车队名称"min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column label="详细住址" min-width="30" align="center">
        <template slot-scope="scope" >
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="车队负责人" min-width="10" align="center">
        <template slot-scope="scope" >
          {{ scope.row.manager }}
        </template>
      </el-table-column>
      <el-table-column label="负责人电话" min-width="20" align="center">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
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
          <el-form-item label="公司编号:">
            <el-input v-model="insertRow.companyId"  readonly="true" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="公司名称:">
            <el-input  v-model="insertRow.companyName" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所在省:">
            <el-input  v-model="insertRow.province" readonly="true"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所在市:">
          <el-input  v-model="insertRow.city" readonly="true"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所在区:">
          <el-input  v-model="insertRow.town" readonly="true"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地址:">
            <el-input  v-model="insertRow.address"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话:">
            <el-input  v-model="insertRow.telephone" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="负责人:">
            <el-input  v-model="insertRow.manager" style="width: 80%" autocomplete="off" />
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
          <el-form-item label="公司名称:">
            <el-input  v-model="save.companyName" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地址:">
            <el-input  v-model="save.address"  style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话:">
            <el-input  v-model="save.telephone" style="width: 80%" autocomplete="off" />
          </el-form-item>
          <el-form-item label="负责人:">
            <el-input  v-model="save.manager" style="width: 80%" autocomplete="off" />
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
import { getFleetList,editFleet,saveFleet, deleteFleet} from '@/api/fleet-manage'

export default {
  filters: {

  },

  data() {
    return {
      list: [],
      listLoading: true,
      companyNameQuery: '',
      dialogFormVisible: false,
      dialogSaveFormVisible: false,
      insertRow:{
        companyId: '',
        companyName: '',
        province: '',
        city:'',
        town:'',
        address:'',
        telephone:'',
        manager:'',
      },
      save:{
        companyId: '',
        companyName: '',
        province: '',
        city:'',
        town:'',
        address:'',
        telephone:'',
        manager:'',
      },
    }
  },
  computed: {
    'tableList': function() {
      return this.list.filter(item => {
        if (!this.companyNameQuery || item.companyName == this.companyNameQuery) { return true }
        return false
      })
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getFleetList().then(response => {
        this.list = response.data
      })
      this.listLoading = false
    },
    update(){
      this.dialogFormVisible = false
      editFleet(this.insertRow.companyId, this.insertRow.companyName,this.insertRow.address, this.insertRow.telephone
      ,this.insertRow.manager).then(res => {
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
      saveFleet(this.save.companyName,this.save.address,this.save.telephone,this.save.manager).then(res => {
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
        deleteFleet(this.insertRow.companyId).then(res => {
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
