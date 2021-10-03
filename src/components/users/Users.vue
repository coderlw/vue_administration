<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索、添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getTableData()">
            <el-button slot="append" icon="el-icon-search" @click="getTableData(queryInfo.query)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="点击编辑" placement="top" :enterable="false">
              <el-button type='primary' icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="点击删除" placement="top" :enterable="false">
              <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type='warning' icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" :page-size="queryInfo.pagesize" :page-sizes="[1, 2, 5, 10]" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <span>
          <el-form :model="addForm" :rules="ruleFormRules" ref="ruleFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑弹窗 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialofVosible" width="50%">
        <span>
          <el-form :model="editForm" :rules="ruleFormRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer">
          <el-button @click="editDialofVosible = false">取 消</el-button>
          <el-button type="primary" @click="changeUser()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色弹窗 -->
      <el-dialog title="分配角色" :visible.sync="setDialogVisible" width="50%" @close="resetRoleClose">
        <p>当前用户: {{user.username}}</p>
        <p>当前角色: {{user.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    // 邮箱校验
    var checkEmail = (rules, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error('请输入正确的邮箱'));
    };
    // 手机号校验
    var checkMobile = (rules, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|16[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error('请输入正确的手机号'))
    };
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      tableData: [],
      total: 0,
      addDialogVisible: false,
      // 表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        mg_state: ''
      },
      // 表单校验规则
      ruleFormRules: {
        username: [
          { required: true, message: '请输入用户名', tigger: 'blur' },
          { min: 3, max: 10, message: '用户名为3~10个字符', tigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', tigger: 'blur' },
          { min: 3, max: 10, message: '密码为3~10个字符', tigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', tigger: 'blur' },
          { validator: checkEmail, tigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', tigger: 'blur' },
          { validator: checkMobile, tigger: 'blur' }
        ]
      },
      editDialofVosible: false,
      editForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      setDialogVisible: false,
      user: {},
      rolesList: [],
      selectRole: ''
    }
  },
  methods: {
    // 请求页面数据
    async getTableData() {
      const { data: res } = await this.$axios.get('users', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error('请求数据失败!');
      this.tableData = res.data.users;
      this.total = res.data.total;
    },
    // 监听表格显示数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getTableData();
    },
    // 监听表格显示页面
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getTableData();
    },
    // 修改用户状态
    async userStateChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (res.meta.status !== 200) {
        this.userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error('用户状态修改失败');
      }
      this.$message.success('用户状态修改成功');
    },
    // 重置添加用户弹窗
    addDialogClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post('users', this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败');
        }
        this.$message.success('添加用户成功');
        this.getTableData();
        this.addDialogVisible = false;
      })
    },
    // 查询用户信息
    async editUser(id) {
      console.log(id);
      const { data: res } = await this.$axios.get('users/' + id);
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败');
      this.editForm = res.data;
      this.editDialofVosible = true;
    },
    // 编辑用户信息
    changeUser() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put('users/' + this.editForm.id, this.editForm);
        if (res.meta.status !== 200) return this.$message.error('编辑用户信息失败');
        this.getTableData();
        this.$message.success('编辑用户信息成功');
        this.editDialofVosible = false;
      })
    },
    // 删除弹窗
    async removeUser(id) {
      const resComfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 成功打印 confirm、失败打印 cancel
      if (resComfirm === 'cancel') return this.$message.info('已取消删除');
      const { data: res } = await this.$axios.delete('/users/' + id);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error('删除失败');
      this.getTableData();
      this.$message.success('删除成功');
    },
    // 查询角色
    async setRole(userInfo) {
      this.user = userInfo;
      const { data: res } = await this.$axios.get('/roles');
      if (res.meta.status !== 200) return this.$message.error('获取用户角色失败');
      this.rolesList = res.data;
      console.log(this.rolesList);
      this.setDialogVisible = true;
    },
    // 分配角色
    async setUserRole() {
      if (!this.selectRole) return this.$message.error('请选择新角色');
      const { data: res } = await this.$axios.put(`users/${this.user.id}/role`, { rid: this.selectRole })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败');
      this.getTableData();
      this.$message.success('分配角色成功');
      this.setDialogVisible = false;
    },
    // 重置分配角色弹窗
    resetRoleClose() {
      this.selectRole = '';
    }
  },





  created() {
    this.getTableData();
  }

};
</script>

<style scoped>
</style>