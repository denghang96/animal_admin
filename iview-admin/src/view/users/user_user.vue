<template>
    <Row :gutter="60" style="margin-top:20px;">
        <Col span="8">
        <h3 style="margin-bottom:20px;margin-left:15px;">基本信息:</h3>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="用户名称" prop="userName">
                    <Input v-model="formValidate.userName" placeholder="请输入用户名称"></Input>
                </FormItem>
                <FormItem label="手机号码" prop="userTel">
                    <Input v-model="formValidate.userTel" placeholder="请输入手机号码！"></Input>
                </FormItem>
                <FormItem label="用户年龄" prop="userAge">
                    <Input v-model="formValidate.userAge" placeholder="请输入自己年龄!"></Input>
                </FormItem>
                <FormItem label="用户性别" prop="userAge">
                    <RadioGroup v-model="formValidate.userSex">
                        <Radio label="男">男</Radio>
                        <Radio label="女">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="到期日期">
                    <span>{{formValidate.expireTime}}</span>
                </FormItem>
                <FormItem label="用户类型" prop="userType">
                    <span>{{formValidate.userType}}</span>
                </FormItem>
                <FormItem label="账号余额" prop="userMoney">
                    <span>{{formValidate.userMoney}}</span>
                </FormItem>
                <FormItem>
                  <i-button type="primary" @click="handleSubmit('formValidate')" style="margin-left:15px;">修改</i-button>
                </FormItem>
            </Form>
        </Col>
        <Col span="6">
          <Row>
            <Col span="8"><h3 style="margin-bottom:20px;margin-left:15px;">登录密码:</h3></Col>
            <Col span="16"><i-button type="text" @click="loginPwdUpdate" style="margin-left:15px;color:red;float:right;">修改</i-button></Col>
          </Row>
          <Form ref="formValidate" :model="password1" :rules="ruleValidate" :label-width="80" style="margin-bottom:75px;">
                <FormItem label="原密码" prop="loginPwd">
                    <Input type="password" v-model="password1.loginPwd" required></Input>
                </FormItem>
                <FormItem label="新密码" prop="loginPwdNew">
                    <Input type="password" v-model="password1.loginPwdNew" required></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwdCheck1">
                    <Input type="password" v-model="password1.passwdCheck1" required></Input>
                </FormItem>
            </Form>
            <Row>
              <Col span="8"><h3 style="margin-bottom:20px;margin-left:15px;">支付密码:</h3></Col>
              <Col span="16"><i-button type="text" @click="payPwdUpdate" style="margin-left:15px;color:red;float:right;">修改</i-button></Col>
            </Row>
            <Form ref="formValidate" :model="password2" :rules="ruleValidate" :label-width="80">
                  <FormItem label="原密码" prop="payPwd" v-if="payPwdOld">
                      <Input type="password"  v-model="password2.payPwd" required></Input>
                  </FormItem>
                  <FormItem label="新密码" prop="payPwdNew">
                      <Input type="password" v-model="password2.payPwdNew" required></Input>
                  </FormItem>
                  <FormItem label="确认密码" prop="passwdCheck2">
                      <Input type="password" v-model="password2.passwdCheck2" required></Input>
                  </FormItem>
              </Form>
        </Col>
        <Col span="8">
            <h3 style="margin-bottom:20px;margin-left:15px;">头像信息:</h3>
            <div style="width:500px;height:450px;background-color:#ffffff;position:relative;">
                <div style="padding-top:20px;margin-left:15px;">
                    <Upload 
                    :action="fileUploadUrl"
                    :on-success="handleEditUploadSuccess"
                    :headers="header">
                    <Button style="float:left;" icon="ios-cloud-upload-outline">上传头像图片</Button>
                    </Upload>
                </div>
                <div style="position:absolute;top:20px;right:30px;">
                  <Button type="success" @click="saveImg">保存</Button>
                </div>
                <div style="width:400px;height:150px;margin: 0 auto;background-color:#f9f9f9;">
                      <div style="width:50px;height:50px;margin: 0 auto;padding-top:50px;">
                          <img :src="userImg2" style="width:50px;height:50px;">
                      </div>
                </div>
                <h3 style="margin-bottom:15px;margin-left:15px;margin-top:15px;">系统默认头像:</h3>
                <div style="padding-left:3rem;">
                    <div v-for="(item,index) in imgData.slice(0, 5)" style="margin:15px;float:left;" @click="changeImg(item.value)">
                        <img :src="item.value" style="width:50px;height:50px;">
                    </div>
                </div>
                <div style="padding-left:3rem;">
                    <div v-for="(item,index) in imgData.slice(5, 10)" style="margin:15px;float:left;" @click="changeImg(item.value)">
                        <img :src="item.value" style="width:50px;height:50px;">
                    </div>
                </div>
                    
            </div>
        </Col>
    </Row>
</template>

<script>
import config from '@/config/index'
import axios from '@/libs/api.request'
export default {
  data () {
      const validatePass = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请输入密码！'));
      } else {
          if (this.formValidate.passwdCheck !== '') {
              // 对第二个密码框单独验证
              this.$refs.formValidate.validateField('passwdCheck');
          }
          callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
          callback(new Error('请再次输入你的密码！'));
      } else if (value !== this.formValidate.loginPwd) {
          callback(new Error('两次输入的密码不一致!'));
      } else {
          callback();
      }
    };
    return {
        formValidate: {
          userName: '',
          loginPwd: '',
          userTel: '',
          userType: '2',
          passwdCheck: '',
          expireTime: '',
          userMoney: 0,
          userImg: '../img/1.jpg',
          userAge: '',
          userSex: '',
          payPwd: ''
        },
      password1: {
        loginPwd: '',
        passwdCheck1: '',
        loginPwdNew: ''
      },
      password2: {
        payPwd: '',
        payPwdNew: '',
        passwdCheck2: ''
      },
      payPwdOld: false,
      userImg2: require('../img/1.jpg'),
      imgData: [
        {value: require('../img/1.jpg')},
        {value: require('../img/2.jpg')},
        {value: require('../img/3.jpg')},
        {value: require('../img/4.jpg')},
        {value: require('../img/5.jpg')},
        {value: require('../img/9.jpg')},
        {value: require('../img/10.jpg')},
        {value: require('../img/11.jpg')},
        {value: require('../img/12.jpg')},
        {value: require('../img/13.jpg')}
      ],
      fileUploadUrl: axios.baseUrl + 'image/upload',
      header: config.header,
      imgList: [],
      editFormImgList:[],
      ruleValidate: {
        userName: [
          { required: true, message: '请输入用户名称！', trigger: 'blur' }
        ],
        userTel: [
          { required: true, message: '请输入手机号码！', trigger: 'blur' },
          { type: 'number', message: '请正确输入手机格式!', trigger: 'blur', transform(value){
            var str = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(!str.test(value)){
              return false;
            }else{
              return Number(value);
            }
          } }
        ],
        userAge: [
          {type: 'number', message: '请正确输入年龄格式!', trigger: 'blur',
            transform(value){
              var str = /^\d+$/
              if(!str.test(value)){
                if(value == ""){
                  return ""
                }
                return false
              }else{
                if(Number(value) > 150){
                  return false
                }
                return Number(value)
              }
            } 
          }
        ]
      }
    }
  },
  created() {
      this.getUserInfo()
      this.checkPayPwd()
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
            userData.userType = userData.userType == '1' ? '管理员' : '普通用户'
            userData.userMoney = userData.userMoney/100
            this.formValidate = userData
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
              axios.request({
                url: 'user/update',
                method: 'post',
                headers: config.header,
                data: {
                  userName: this.formValidate.userName,
                  userTel: this.formValidate.userTel,
                  userAge: this.formValidate.userAge,
                  userSex: this.formValidate.userSex
                }
              }).then(res => {
                if(res.data.status == 0){
                  this.$Notice.success({
                      title: '成功',
                      desc: false ? '' : '修改成功！'
                  });
                  this.getUserTable()
                }else{
                  this.$Notice.error({
                      title: '错误',
                      desc: false ? '' : '修改失败！'
                  });
                }
              })
          } else {
              this.$Message.error('请正确输入信息!')
          }
      })
    },
    loginPwdUpdate () {
      if(this.password1.loginPwd == ""){
        alert("请先输入原密码！")
        return
      }else{
        if(this.password1.loginPwdNew.trim().length < 6){
          alert("新密码长度不得小于6位!")
          return
        }else{
          if(this.password1.passwdCheck1 == ""){
            alert("请确认密码！")
            return
          }else{
            if(this.password1.loginPwdNew != this.password1.passwdCheck1){
              alert("两次输入密码不一样！")
              return
            }
            else{
              axios.request({
                url: 'user/rePwd',
                method: 'post',
                headers: config.header,
                data: {
                  loginPwd: this.password1.loginPwdNew,
                  oldPwd: this.password1.loginPwd
                }
              }).then(res => {
                if(res.data.status == 0){
                  this.$Notice.success({
                      title: '成功',
                      desc: false ? '' : '修改成功！'
                  })
                }else{
                  this.$Notice.error({
                      title: '错误',
                      desc: false ? '' : '修改失败！原密码不正确!'
                  })
                }
              })
            }
          }
        }
      }
    },
    payPwdUpdate () {
      if(this.password2.payPwd == "" && this.payPwdOld){
        alert("请先输入原密码！")
        return
      }else{
        if(this.password2.payPwdNew.trim().length < 6){
          alert("新密码长度不得小于6位!")
          return
        }else{
          if(this.password2.passwdCheck2 == ""){
            alert("请确认密码！")
            return
          }else{
            if(this.password2.payPwdNew != this.password2.passwdCheck2){
              alert("两次输入密码不一样！")
              return
            }
            else{
              axios.request({
                url: 'user/rePayPwd',
                method: 'post',
                headers: config.header,
                data: {
                  payPwd: this.password2.payPwdNew,
                  oldPwd: this.password2.payPwd
                }
              }).then(res => {
                if(res.data.status == 0){
                  this.$Notice.success({
                      title: '成功',
                      desc: false ? '' : '修改成功！'
                  })
                }else{
                  this.$Notice.error({
                      title: '错误',
                      desc: false ? '' : '修改失败！原密码不正确!'
                  })
                }
              })
            }
          }
        }
      }
    },
    checkPayPwd(){
      axios.request({
        url: 'user/checkPayPwd',
        method: 'get',
        headers: config.header
      }).then(res => {
        if(res.data.status == 0){
          this.payPwdOld = true
        }else{
          this.payPwdOld = false
        }
      })
    },
    handleEditUploadSuccess(res, file) {
        this.editFormImgList.push(axios.baseUrl + 'image/showImage/?path=' + res)
        this.userImg2 = axios.baseUrl + 'image/showImage/?path=' + res
    },
    changeImg (value) {
      this.userImg2 = value
    },
    saveImg () {
      if(this.userImg2 != ""){
        axios.request({
          url: 'user/update',
          method: 'post',
          headers: config.header,
          data: {
            userImage: this.userImg2
          }
        }).then(res => {
          if(res.data.status == 0) {
            this.$Message.success("修改成功")
          } else {
            this.$Message.error("修改失败")
          }
        })
      }
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