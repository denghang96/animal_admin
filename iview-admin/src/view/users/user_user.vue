<template>
    <Row :gutter="60" style="margin-top:20px;">
        <Col span="8">
        <h3 style="margin-bottom:20px;margin-left:15px;">基本信息:</h3>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="用户名称" prop="userName">
                    <Input v-model="formValidate.userName" placeholder="请输入用户名称"></Input>
                </FormItem>
                <FormItem label="初始密码" prop="loginPwd">
                    <Input type="password" v-model="formValidate.loginPwd" placeholder="请输入密码！"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwdCheck">
                    <Input type="password" v-model="formValidate.passwdCheck" placeholder="请再次输入密码！"></Input>
                </FormItem>
                <FormItem label="到期日期">
                    <span>{{formValidate.expireTime}}</span>
                </FormItem>
                <FormItem label="用户类型" prop="userType">
                    <span>{{formValidate.expireTime}}</span>
                </FormItem>
               <FormItem label="手机号码" prop="userTel">
                    <Input v-model="formValidate.userTel" placeholder="请输入手机号码！"></Input>
                </FormItem>
                <FormItem label="账号余额" prop="userMoney">
                    <Input v-model="formValidate.userMoney" placeholder="请输入账号金额！"></Input>
                </FormItem>
                <FormItem>
                  <i-button type="primary" @click="handleSubmit('formValidate')">修改</i-button>
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
        userImg: '../img/1.jpg'
      },
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
        loginPwd: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
          { type: 'string', min: 6, message: '密码最少为六位！', trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, message: '请再次输入密码！', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        expireTime: [
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
        userMoney: [
          { type: 'number', message: '请输入数字!', trigger: 'blur' }
        ]
      }
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
            
            this.formValidate = userData
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