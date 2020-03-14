<template>
    <Row style="background-color: #fff;margin-top:18px;margin-left:18px;">
        <Col span="4">
          <div style="width:250px;height:240px;">
              <div class="mc">
                  <img style="height:64px;width:64px;margin-top:25px;border-radius: 100%;box-shadow: 3px 2px 10px 0 rgba(79,5,1,.84);border: 4px solid #fff;" :src="userImage">
              </div>
              <div class="mf">
                  <div style="float:left;margin-right:10px;color:#f4ca3a;">
                      <span>手机号码：</span><span>{{userTel}}</span><br />
                      <span>性别：</span><span>{{userSex}}</span><span style="margin-left:10px;">年龄：</span><span>{{userAge}}</span>
                  </div>
                  <a class="button">修改</a>
              </div>
          </div>
        </Col>
        <Col span="12">col-12</Col>
    </Row>
</template>

<script>
import config from '@/config/index'
import axios from '@/libs/api.request'
export default {
  data () {
    return {
        userTel: '15984105495',
        userSex: '未填写',
        userAge: '未填写',
        userInfo: '',
        userImage: ''
    }
  },
  created() {
      this.getUserInfo()
  },
  methods: {
    getUserInfo (){
        axios.request({
        url: 'user/getUserInfo',
        method: 'get',
        headers: config.header
      }).then(res => {
        if(res.data.status == 0){
            var userData = res.data.data
            this.userTel = userData.userTel.substring(0,3) + '****' + userData.userTel.substring(8,4)
            this.userImage = userData.userImage
            if(userData.userSex != undefined){
                this.userSex = userData.userSex
            }
            if(userData.userAge != undefined){
                this.userAge = userData.userAge
            }
        }
      })
    }
}}
</script>
<style>
.mc{
    position: relative;
    height: 187px;
    text-align: center;
    background-color: #e2231a;
}
.mf{
    padding: 10px 20px;
    height: 56px;
    background-color:#232331;
}
.mf .button{
    float: right;
    padding: 0 10px;
    margin-top: 5px;
    height: 26px;
    line-height: 26px;
    border-radius: 14px;
    background-color:
    #f4ca3a;
    color:
    #232331;
    font-weight: 700;
    text-align: center;
}
</style>