<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
      </el-alert>
      <el-row class="car_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader v-model="selectKeys" :options="cateList" :props="cateProp" expandTrigger="hover" clearable @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button type="primary" size="mini" :disabled="selectKeys.length === 3 ? false : true" @click="addDialogVisible = true">添加属性</el-button>
            </el-col>
          </el-row>
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="item.attr_id" closable @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type='primary' icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeCate(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button type="primary" size="mini" :disabled="selectKeys.length === 3 ? false : true" @click="addDialogVisible = true">添加属性</el-button>
            </el-col>
          </el-row>
          <el-table :data="paramsList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="item in scope.row.attr_vals" :key="item.attr_id" closable>{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">

            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type='primary' icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeCate(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" @close="resetDialogClose">
        <el-form :model="addForm" :rules="addRules" ref="addRef">
          <el-form-item :label="titleText" prop="attr_name" label-width="100px">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogSub">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" @close="editDialogClose">
        <el-form :model="editForm" :rules="editRules" ref="editRef">
          <el-form-item :label="titleText" prop="attr_name" label-width="100px">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogSub">确 定</el-button>
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
      cateList: [],
      selectKeys: [],
      cateProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      paramsList: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{
          required: true, message: '请输入属性值', trigger: 'blur'
        }]
      },
      editDialogVisible: false,
      editForm: {},
      editRules: {
        attr_name: [{
          required: true, message: '请输入属性值', trigger: 'blur'
        }]
      },
      attrId: 0,
    }
  },
  computed: {
    cateId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[this.selectKeys.length - 1];
      } else {
        return null;
      }
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态属性';
      } else {
        return '静态属性';
      }
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$axios.get('categories');
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败');
      this.cateList = res.data;
    },
    handleChange() {
      this.getParamsData();
    },
    tabsHandleClick() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectKeys.length !== 3) {
        this.paramsList = [];
        return;
      }
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
      if (res.meta.status !== 200) return this.$message.error('获取参数失败');
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        item.inputVisible = false;
        item.inputValue = '';
      })
      this.paramsList = res.data;
    },
    resetDialogClose() {
      this.$refs.addRef.resetFields();
    },
    addDialogSub() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName });
        if (res.meta.status !== 201) return this.$message.error('添加属性失败');
        this.getParamsData();
        this.$message.success('添加属性成功');
        this.addDialogVisible = false;
      })
    },
    editDialogClose() {
      this.$refs.editRef.resetFields();
    },
    async editDialog(attrId) {
      this.attrId = attrId;
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } });
      if (res.meta.status !== 200) return this.$message.error('查询属性失败');
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogSub() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.attrId}`, {
          attr_name: this.editForm.attr_name, attr_sel: this.activeName, attr_vals: 'TCL电视'
        });
        if (res.meta.status !== 200) return this.$message.error('修改属性失败');
        this.getParamsData();
        this.$message.success('修改属性成功');
        this.editDialogVisible = false;
      })
    },
    async removeCate(attrId) {
      const resConfirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (resConfirm !== 'confirm') return this.$message.error('已取消删除');
      const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${attrId}`);
      if (res.meta.status !== 200) return this.$message.error('删除属性失败');
      this.getParamsData();
      this.$message.success('删除属性成功');
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue);
      this.getSaveattributes(row);
      row.inputValue = '';
      row.inputVisible = false;

    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async getSaveattributes(row) {
      console.log(row.attr_id);
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      });
      if (res.meta.status !== 200) return this.$message.error('操作属性失败');
      this.$message.success('操作属性成功');
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.getSaveattributes(row);
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style scoped>
.car_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 30%;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>