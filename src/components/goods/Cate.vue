<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateData" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border stripe class="tree-table">
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:blue"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <template slot="to" slot-scope="scope">
          <el-button type='primary' icon="el-icon-edit" size="mini" @click="editDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 5, 10, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="resetForm">
        <span>
          <el-form :model="addForm" :rules="addRules" ref="addRef">
            <el-form-item label="分类名称:" prop="cat_name" label-width="100px">
              <el-input v-model="addForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类:" label-width="100px">
              <el-cascader v-model="selectKeys" expandTrigger='hover' :options="parentCateList" :props="cascaderProp" @change="handleSelect" clearable change-on-select></el-cascader>
            </el-form-item>
          </el-form>
        </span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCateVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateSub">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" @close="resetEditForm">
        <el-form :model="editForm" ref="editRef">
          <el-form-item label="分类名称" label-width="100px">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateSub">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateData: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'to'
        }
      ],
      addCateVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addRules: {
        cat_name: [
          { required: true, message: '请输入要添加的分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      selectKeys: [],
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editForm: {
        cat_id: 0,
        cat_name: ''
      },
      editDialogVisible: false,
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$axios.get('categories', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败');
      this.cateData = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async openAddCateDialog() {
      const { data: res } = await this.$axios.get('categories', { params: { type: 2 } });
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败');
      this.parentCateList = res.data;
      this.addCateVisible = true;
    },
    handleSelect() {
      if (this.selectKeys.length > 0) {
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addForm.cat_level = this.selectKeys.length;
      } else {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
    },
    resetForm() {
      this.$refs.addRef.resetFields();
      this.selectKeys = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;
    },
    // 添加分类
    addCateSub() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post('categories', this.addForm);
        if (res.meta.status !== 201) return this.$message.error('创建分类失败');
        this.getGoodsList();
        this.$message.success('创建分类成功');
        this.addCateVisible = false;
      })
    },
    // 查询编辑数据
    async editDialog(id) {
      const { data: res } = await this.$axios.get('categories/' + id);
      if (res.meta.status !== 200) return this.$message.error('查询分类失败');
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    resetEditForm() {
      this.$refs.editRef.resetFields();
    },
    // 编辑分类名称
    async editCateSub() {
      const { data: res } = await this.$axios.put('categories/' + this.editForm.cat_id, this.editForm);
      if (res.meta.status !== 200) return this.$message.error('编辑分类失败');
      this.getGoodsList();
      this.$message.success('编辑分类成功');
      this.editDialogVisible = false;
    },
    // 删除分类
    async removeCate(id) {
      const resConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (resConfirm !== 'confirm') return this.$message.error('已取消删除');
      const { data: res } = await this.$axios.delete('categories/' + id);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error('删除失败');
      this.getGoodsList();
      this.$message.success('删除成功');
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style scoped>
.tree-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>
