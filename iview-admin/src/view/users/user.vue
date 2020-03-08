<template>
  <div>
    <Row type="flex" justify="start" class="code-row-bg" style="margin-bottom:22px;">
        <Col span="4">
          <Input search enter-button placeholder="输入用户名" />
        </Col>
        <Col span="4" offset="2">
          <Input search enter-button placeholder="输入手机号" />
        </Col>
        <Col span="4" offset="2" style="margin-top:10px;">
          <RadioGroup v-model="userSex">
              <Radio label="1">全部</Radio>
              <Radio label="2">男</Radio>
              <Radio label="3">女</Radio>
          </RadioGroup>
        </Col>
        <Col span="4" style="text-align:right;" offset="2">
          <Button type="success" @click="modal1 = true">新建</Button>
          <Modal
              v-model="modal1"
              title="新建用户">
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
                    <Row>
                        <Col span="11">
                            <FormItem prop="expireTime">
                                <DatePicker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="formValidate.expireTime" @on-change="getDate"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="用户类型" prop="userType">
                    <RadioGroup v-model="formValidate.userType">
                        <Radio label="2">客户</Radio>
                        <Radio label="1">管理员</Radio>
                    </RadioGroup>
                </FormItem>
               <FormItem label="手机号码" prop="userTel">
                    <Input v-model="formValidate.userTel" placeholder="请输入手机号码！"></Input>
                </FormItem>
                <FormItem label="初始金额" prop="userMoney">
                    <Input v-model="formValidate.userMoney" placeholder="请输入账号金额！"></Input>
                </FormItem>
                <FormItem>
                  <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
                  <i-button type="primary" @click="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
                </FormItem>
            </Form>
            <div slot="footer">
            </div>
          </Modal>
          <Modal
              v-model="modal2"
              title="输入金额"
              @on-ok="ok"
              @on-cancel="cancel">
              <Input v-model="userMoney2" placeholder="请输入充值金额！"></Input>
          </Modal>
        </Col>
    </Row>
    <Table border :columns="columns" :data="tableData" :height="540">
        <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="chongzhi(index)">充值</Button>
            <Button type="error" size="small" @click="remove(index)">删除</Button>
        </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>
  </div>
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
      columns: [
        { title: '用户头像', slot: 'userImage', editable: true ,render: (h, params) => {
          return h('div', [
            h('img', {
              domProps: {
                'src': params.row.userImage
              },
              style: {
                display: 'block',
                width: '30px',
                height: '30px',
                borderRadius: '3px',
                // margin: '0 auto'
              },
            })
          ])
        }},
        { title: '用户名', key: 'userName', editable: true },
        { title: '手机号', key: 'userTel', editable: true },
        { title: '性别', key: 'userSex', editable: true },
        { title: '年龄', key: 'userAge', sortable: true },
        { title: '用户类型', key: 'userType', editable: true },
        { title: '账户余额', key: 'userMoney', sortable: true },
        { title: '会员到期日期', key: 'expireTime' },
        { title: '操作',slot: 'action' }
      ],
      userSex: '1',
      tableData: [],
      userData: '',
      total: 100,
      current: 1,
      pageSize: 6,
      modal1: false,
      modal2: false,
      userMoney2: 0,
      formValidate: {
        userName: '',
        loginPwd: '',
        userTel: '',
        userType: '2',
        passwdCheck: '',
        expireTime: '',
        userMoney: 0
      },
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
      this.getUserTable()
  },
  methods: {
    handleDelete (params) {
      alert(this.$java_url)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
              axios.request({
                url: 'user/register',
                method: 'post',
                headers: config.header,
                data: {
                  userName: this.formValidate.userName,
                  userTel: this.formValidate.userTel,
                  userMoney: this.formValidate.userMoney * 100,
                  userType: this.formValidate.userType,
                  loginPwd: this.formValidate.loginPwd,
                  expireTime: this.formValidate.expireTime
                }
              }).then(res => {
                if(res.data.status == 0){
                  this.$Notice.success({
                      title: '成功',
                      desc: false ? '' : '新增成功！'
                  });
                }else{
                  this.$Notice.error({
                      title: '错误',
                      desc: false ? '' : '用户名已存在！'
                  });
                }
              })
          } else {
              this.$Message.error('Fail!')
          }
      })
    },
    handleReset (name) {
        this.$refs[name].resetFields()
    },
    //查询用户
    getUserTable(){
      axios.request({
        url: 'user/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: 10
        }
      }).then(res => {
        if(res.status == 200){
          for(var i = 0; i < res.data.data.records.length; i++){
            res.data.data.records[i].userMoney = res.data.data.records[i].userMoney/10
            res.data.data.records[i].userImage = axios.baseUrl + 'image/showImage/?path=' + res.data.data.records[i].userImage
          }
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        }
      })
    },
    changePage(current){
      this.current = current
      this.getUserTable()
    },
    getDate(value){
      this.formValidate.expireTime = value
    },
    remove (index) {
      var _this = this
      axios.request({
        url: 'user/del',
        method: 'post',
        cache:false,
        headers: config.header,
        data: 
          [this.tableData[index].id]
      }).then(res => {
        if(res.status == 200){
          this.$Notice.success({
            title: '成功',
            desc: false ? '' : '删除成功！'
          });
          _this.getUserTable()
        }
      })
    },
    //弹出充值框
    chongzhi(index){
      this.modal2 = true
      this.userData = this.tableData[index]
    },
    //确定充值
    ok () {
      var _this = this
      axios.request({
        url: 'user/update',
        method: 'post',
        cache:false,
        headers: config.header,
        data: {
          id: this.userData.id,
          userMoney: parseInt(this.userMoney2) * 10 + parseInt(this.userData.userMoney) * 10
        } 
      }).then(res => {
        if(res.status == 200){
          this.$Notice.success({
            title: '成功',
            desc: false ? '' : '充值成功！'
          });
          _this.getUserTable()
        }
      })
    },
    cancel () {}
}}
</script>

<style>

</style>
