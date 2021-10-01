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
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 切换菜单显示与隐藏 -->
          <div class="collapse-button" @click="showMenu">|||</div>
          <el-menu :default-active="activePath" :collapse="isCollapse" :collapse-transition="false" router background-color="#1a1f26" text-color="#fff" active-text-color="#409eff" unique-opened>
            <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
              <!-- 一级菜单 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item @click="saveActivePath('/' + subItem.path)" :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menusList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '',
    }
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功');
    },
    async getMenusData() {
      const { data: res } = await this.$axios.get('menus');
      if (res.meta.status !== 200) return this.$message.erros('请求错误');
      this.menusList = res.data;
    },
    // 菜单栏显示与隐藏
    showMenu() {
      this.isCollapse = !this.isCollapse;
    },
    // 菜单项点击保持激活状态
    saveActivePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath;
    }
  },

  created() {
    this.getMenusData();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
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
.iconfont {
  margin-right: 10px;
  font-size: 25px;
}
.el-menu {
  border: 0;
}
.collapse-button {
  color: #fff;
  font-size: 15px;
  letter-spacing: 0.2em;
  line-height: 30px;
  text-align: right;
  padding-right: 20px;
}
</style>