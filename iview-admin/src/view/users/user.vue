<template>
  <div>
    <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4" style="text-align:right;">
          <Button type="success" @click="modal1 = true">新建</Button>
          <Modal
              v-model="modal1"
              title="新建用户"
              @on-ok="ok"
              @on-cancel="cancel">
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
                                <DatePicker type="date" placeholder="选择日期" v-model="formValidate.expireTime"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="用户类型" prop="userType">
                    <RadioGroup v-model="formValidate.userType">
                        <Radio label="1">客户</Radio>
                        <Radio label="2">管理员</Radio>
                    </RadioGroup>
                </FormItem>
               <FormItem label="手机号码" prop="userTel">
                    <Input v-model="formValidate.userTel" placeholder="请输入手机号码！"></Input>
                </FormItem>
                <FormItem label="初始金额" prop="userMoney">
                    <Input v-model="formValidate.userMoney" placeholder="请输入账号金额！"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                </FormItem>
            </Form>
          </Modal>
        </Col>
    </Row>
    <Card>
      <tables ref="tables" editable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" :height="500"/>
      <Button style="margin: 10px 0;" type="primary" @click="userDelete">导出为Csv文件</Button>
    </Card>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables'

import data from '@/config/index'
import { getTableData } from '@/api/methodData'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
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
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', editable: true },
        { title: 'Create-Time', key: 'createTime' },
        {
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: [],
      modal1: false,
      formValidate: {
        userName: '',
        loginPwd: '',
        userTel: '',
        userType: '1',
        passwdCheck: '',
        expireTime: '',
        userMoney: '0.00'
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
      }
    }
  },
  create() {
    getTableData().then (res =>{
      console.log(res)
    })
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
    userDelete () {
      alert(data.reqUrl)
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
              console.log(this.formValidate)
          } else {
              this.$Message.error('Fail!')
          }
      })
    },
    handleReset (name) {
        this.$refs[name].resetFields()
    },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}}
</script>

<style>

</style>
