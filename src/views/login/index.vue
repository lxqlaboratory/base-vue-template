<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div style="margin-top: -3%;margin-bottom: 3%;text-align: right">
        <span class="find_Pwd" @click="findPwd">忘记登录密码?</span>
      </div>
      <div type="flex">
      <div>
        <span>验证码：</span>
        <input type="text" id="code" v-model="code" class="code"  placeholder="请输入您的验证码" />
      </div>
      <div class="login-code" @click="refreshCode">
        <!--验证码组件-->
        <s-identify :identifyCode="identifyCode"></s-identify>
      </div>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <el-row type="flex">
        <el-col>
          <el-checkbox class="login_remember " v-model="checked">记住密码</el-checkbox>
        </el-col>
        <el-col align="right">
          <span class="register" @click="doRegister">免费注册</span>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login } from "../../api/user";
import SIdentify from '../../components/Sidentify/index'

export default {
  name: 'Login',
  components : { SIdentify },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'chy',
        password: '2'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      identifyCodes: '1234567890',
      identifyCode: '',
      code: '',
      loading: false,
      passwordType: 'password',
      redirect: '/home'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created(){
    this.refreshCode();
  },
  mounted(){
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if(this.code == ""){
          alert("请输入验证码!")
          return;
        }
        if(this.identifyCode !== this.code){
          this.code = '';
          this.refreshCode();
          alert("请输入正确的验证码");
          return;
        }
        if (valid) {
          this.loading = true;
           login({
              loginName: this.loginForm.username,
              password: this.loginForm.password
            }).then(resp=> {
              if (resp && resp.reCode == 0) {
                this.loading = false
                this.$store.commit('user/SET_NAME')
                this.$store.commit('user/SET_TOKEN')
                this.$router.push({ path: this.redirect || '/home' })
              }
            });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    doRegister(){
      console.log("success")
      this.$router.push({
        path:"/register"
      });
    },
    findPwd(){

    },
    //验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
          ];
      }
      console.log(this.identifyCode);
    },
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .register {
    font-size: 14px;
    line-height: 22px;
    color: #1ab2ff;
    cursor: pointer;
    text-align: right;
    text-indent: 8px;
  }
  .register:hover {
    color: #2c2fd6;
  }
  .find_Pwd{
    font-size: 14px;
    line-height: 22px;
    color: whitesmoke;
    cursor: pointer;
    text-align: right;
    text-indent: 8px;
  }
  .find_Pwd:hover{
    color: #20a0ff;
  }
  .code{
    width:124px;
    height:31px;
    border:1px solid rgba(186,186,186,1);
  }
  .login-code{
    cursor: pointer;
  }
}
</style>
