<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form' //-c componet/login-form 登录
import { mapActions } from 'vuex'
import config from '@/config/index'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          localStorage.setItem("user",JSON.stringify(res))
          config.homeName = JSON.parse(localStorage.getItem("user")).homeName
          this.$config.homeName = config.homeName
          const header = {
            ContentType: 'application/json',
            Authorization: localStorage.getItem ('token')
          }
          this.$config.header = header
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    }
  }
}
</script>

<style>

</style>
