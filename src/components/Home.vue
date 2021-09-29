<template>
  <div class="home-container">
    <el-container class="home-container">
      <el-header height="75px">
        <div class="logo">
          <img src="~assets/img/heima.png" alt="">
          <span class="title">黑马电商管理系统</span>
        </div>
        <span type="info" class="out" @click="loginOut">退出</span>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="2" background-color="#1a1f26" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="1">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item index="1-1"><i class="el-icon-location"></i>选项1</el-menu-item>
              <el-menu-item index="1-2"><i class="el-icon-location"></i>选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="1">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航二</span>
              </template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="1">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航三</span>
              </template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="1">
              <!-- 一级菜单 -->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航四</span>
              </template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功');
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1668c5;
}

.logo {
  display: flex;
  align-items: center;
}
.title {
  line-height: 30px;
  font-size: 25px;
  color: #fff;
  padding-left: 10px;
}
.out {
  color: #fff;
}
.el-aside {
  background-color: #1a1f26;
}
.el-main {
  background-color: #eaedf1;
}
</style>