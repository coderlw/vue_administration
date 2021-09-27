<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="../assets/img/avatar.png" alt="" />
      </div>
      <div class="login_form">
        <el-form :modle="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu" @blur="aaa"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-tianchongxing-" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 表单中的数据绑定对象
      loginForm: {
        username: '123',
        password: 'aaaa'
      },
      // 表单中的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度为3到12个字符串', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data } = await this.$axios.post('/login', this.loginForm);
        console.log(data);
        if (data.meta.status !== 200) return this.$message.error('登录失败，请重新登录');
        this.$message.success('恭喜你,登陆成功~');

      })
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    aaa(e) {
      console.log(this.loginForm.username);
      this.loginForm.username = e.target.value;
      this.$router.push('/home')
    }
  }
};
</script>

<style scoped>
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: relative;
  width: 450px;
  height: 300px;
  background-color: #fff;
}
.avatar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #eee;
  background-color: #eee;
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 50px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>