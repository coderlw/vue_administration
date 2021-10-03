<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scpoe">
            <el-row :class="['vcenter','btBorder' , index1 === 0 ? 'topBorder' :'']" v-for="(item1, index1) in scpoe.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="removeRole(scpoe.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="['vcenter','leftborder', index2 === 0 ? '' :'topBorder']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRole(scpoe.row,item2.id)" type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRole(scpoe.row,item3.id)" v-for="(item3) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type='primary' icon="el-icon-edit" size="mini" @click="selectRole(scope.row.id)">编辑</el-button>
            <el-button type='danger' icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)">删除</el-button>
            <el-button type='warning' icon="el-icon-setting" size="mini" @click="setRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加弹窗 -->
      <el-dialog title="添加用户角色" :visible.sync="addDialogVisible" @close="resetForm" width="50%">
        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑用角色" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="editForm" :rules="addRules" ref="editRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserRole">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="分配权限" :visible.sync="setRightVisible" width="50%" @close="resetTree">
        <el-tree :data="rightsList" :props="treeProps" ref="treeRef" node-key="id" show-checkbox default-expand-all :default-checked-keys="checkedKeys"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editForm: {
        roleId: 0,
        roleName: '',
        roleDesc: ''
      },
      editDialogVisible: false,
      setRightVisible: false,
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      checkedKeys: [],
      roleId: 0
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('/roles');
      if (res.meta.status !== 200) return this.$message.error('获取用户角色失败');
      this.rolesList = res.data;
    },
    resetForm() {
      this.$refs.addRef.resetFields();
    },
    addUserRoles(valid) {
      console.log(valid);
      this.$refs.addRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.post('/roles', this.addForm);
        if (res.meta.status !== 201) return this.$message.error('添加用户角色失败');
        this.addForm = res.data;
        this.getRolesList();
        this.$message.success('添加用户角色成功');
        this.addDialogVisible = false;
      })
    },
    async selectRole(roleId) {
      const { data: res } = await this.$axios.get('roles/' + roleId);
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败');
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editUserRole() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put('roles/' + this.editForm.roleId, this.editForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('编辑用户信息失败');
        this.getRolesList();
        this.$message.success('编辑用户信息成功');
        this.editDialogVisible = false;
      })
    },
    async removeUser(id) {
      const resComfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 成功打印 confirm、失败打印 cancel
      if (resComfirm === 'cancel') return this.$message.info('已取消删除');
      const { data: res } = await this.$axios.delete('roles/' + id);
      if (res.meta.status !== 200) return this.$message.error('删除失败');
      this.getRolesList();
      this.$message.success('删除成功');
    },
    async removeRole(row, roleId) {
      const rusult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (rusult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(`roles/${row.id}/rights/${roleId}`);
      if (res.meta.status !== 200) return this.message.error('删除角色权限失败')
      // this.getRolesList();
      row.children = res.data;
      this.$message.success('删除角色权限成功')
    },
    async setRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$axios.get('/rights/tree');
      if (res.meta.status !== 200) return this.$message.error('获取用户权限失败');
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.getLeafKeys(role, this.checkedKeys)
      this.setRightVisible = true;
    },
    // 递归选择已有权限
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      })
    },
    // 重置权限
    resetTree() {
      this.checkedKeys = [];
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const keysStr = keys.join(',');
      const { data: res } = await this.$axios.post('roles/' + this.roleId + '/rights', { rids: keysStr });
      if (res.meta.status !== 200) return this.$message.error('修改用户权限失败');
      this.getRolesList();
      this.$message.success('修改用户权限成功');
      this.setRightVisible = false;
    }

  },
  created() {
    this.getRolesList();
  }
};
</script>

<style scoped>
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.topBorder {
  border-top: 1px solid #eee;
}
.btBorder {
  border-bottom: 1px solid #eee;
}
.leftborder {
  border-left: 1px solid #eee;
}
</style>