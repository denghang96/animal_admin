<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4">
        <Select v-model="query.animalType" placeholder="动物类型">
          <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select v-model="query.applyStatus" placeholder="申请状态" clearable>
          <Option v-for="item in applyStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <DatePicker type="date" format="yyyy-MM-dd" placeholder="申请日期" v-model="query.applyDate" @on-change="getDate" style="width:250px"></DatePicker>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getFosterTable">查询</Button>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="success" @click="addFoster">我要寄养</Button>
      </Col>
    </Row>
    
    <Table border :columns="columns" :data="tableData" :height="540" style="margin-top:10px">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.applyStatus!='待审批'" @click="editFoster(index)">查看详情</Button>
        <Button type="primary" size="small" style="margin-right: 5px" v-if="row.applyStatus=='待审批'" @click="editFoster(index)">审核</Button>
        <Button type="success" size="small" style="margin-right: 5px" v-if="row.applyStatus=='审批通过'" @click="arrive(index)">宠物到店</Button>
        <Button type="success" size="small" style="margin-right: 5px" v-if="row.applyStatus=='正在寄养'" @click="settleOpen(index)">结算</Button>
        <Button type="error" size="small" style="margin-right: 5px" v-if="row.applyStatus!='已结算'" @click="reset(index)">重置状态</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>
    <!--弹出提交申请的模态框-->
    <Modal
        v-model="addFosterModal"
        width="1000px"
        title="审核寄养申请">
        <div slot="footer"></div>
        <Form ref="form" :model="addform" :rules="formValidate" :label-width="80">
          <FormItem label="联系人" prop="userName">
            <Input v-model="addform.userName" readonly></Input>
          </FormItem>
          <FormItem label="联系电话" prop="userTel">
            <Input v-model="addform.userTel" readonly></Input>
          </FormItem>
          <FormItem label="申请日期" prop="applyDate">
            <Input v-model="addform.applyDate" readonly></Input>
          </FormItem>
           <FormItem label="动物类型" prop="animalType">
               <Input v-model="addform.animalType" readonly></Input>
          </FormItem>
          <FormItem label="动物年龄" prop="animalAge">
               <Input v-model="addform.animalAge" readonly></Input>
          </FormItem>
          <FormItem label="动物简介" prop="animalDesc">
              <Input v-model="addform.animalDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" readonly></Input>
          </FormItem>
          <FormItem label="动物健康证明" prop="animalProve">
                <img :src="item" v-for="(item,index) in editFormImgList" width="100px" @click="showLargeImg(index)" height="100px">
          </FormItem>
          <FormItem label="寄养单价/天" prop="applyPrice">
              <Input type="number" v-model="addform.applyPrice"></Input>
          </FormItem>
          <FormItem label="审核意见" prop="opinion">
              <Input v-model="addform.opinion" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
          </FormItem>
          <FormItem style="text-align:center">
            <Button type="primary" @click="handleSubmit('form','审批通过')" v-if="isShow">审核通过</Button>
            <Button type="error" @click="handleSubmit('form','审批未通过')" v-if="isShow" style="margin-left: 8px">审核不通过</Button>
          </FormItem>
        </Form>
    </Modal>
    <!--弹出审核的模态框-->
    <Modal
        v-model="editFosterModal"
        width="1000px"
        title="审核寄养申请">
        <div slot="footer"></div>
        <Form ref="form" :model="editform" :rules="formValidate" :label-width="80">
          <FormItem label="联系人" prop="userName">
            <Input v-model="editform.userName" readonly></Input>
          </FormItem>
          <FormItem label="联系电话" prop="userTel">
            <Input v-model="editform.userTel" readonly></Input>
          </FormItem>
          <FormItem label="申请日期" prop="applyDate">
            <Input v-model="editform.applyDate" readonly></Input>
          </FormItem>
           <FormItem label="动物类型" prop="animalType">
               <Input v-model="editform.animalType" readonly></Input>
          </FormItem>
          <FormItem label="动物年龄" prop="animalAge">
               <Input v-model="editform.animalAge" readonly></Input>
          </FormItem>
          <FormItem label="动物简介" prop="animalDesc">
              <Input v-model="editform.animalDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" readonly></Input>
          </FormItem>
          <FormItem label="动物健康证明" prop="animalProve">
                <img :src="item" v-for="(item,index) in editFormImgList" width="100px" @click="showLargeImg(index)" height="100px">
          </FormItem>
          <FormItem label="寄养单价/天" prop="applyPrice">
              <Input type="number" v-model="editform.applyPrice"></Input>
          </FormItem>
          <FormItem label="审核意见" prop="opinion">
              <Input v-model="editform.opinion" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
          </FormItem>
          <FormItem style="text-align:center">
            <Button type="primary" @click="handleSubmit('form','审批通过')" v-if="isShow">审核通过</Button>
            <Button type="error" @click="handleSubmit('form','审批未通过')" v-if="isShow" style="margin-left: 8px">审核不通过</Button>
          </FormItem>
        </Form>
    </Modal>
    <Modal
      v-model="settleModal"
      width="300px"
      title="选择结算日期">
        <div slot="footer"></div>
        <Form ref="formsettle" :model="editform" :rules="formValidate" :label-width="80">
          <FormItem label="宠物名称" prop="animalName">
            <Input v-model="settleform.animalName"  title="宠物名称" readonly></Input>
          </FormItem>
          <FormItem label="寄养单价" prop="animalSingleMoney">
            <Input v-model="settleform.animalSingleMoney"  title="寄养单价" readonly></Input>
          </FormItem>
          <FormItem label="寄养日期" prop="arriveDate">
               <DatePicker type="date" format="yyyy-MM-dd" placeholder="寄养日期" v-model="settleform.arriveDate" readonly></DatePicker>
          </FormItem>
          <FormItem label="结算日期" prop="settleDate">
               <DatePicker type="date" format="yyyy-MM-dd" placeholder="选择结算日期" v-model="settleform.settleDate" @on-change="getDate2" ></DatePicker>
          </FormItem>
          <FormItem label="用户余额" prop="userMoney">
            <Input v-model="settleform.userMoney"  title="用户余额" readonly></Input>
          </FormItem>
          <FormItem label="消费总额" prop="animalMoney">
            <Input v-model="settleform.animalTotleMoney"  title="消费总额" readonly></Input>
          </FormItem>
          <FormItem style="text-align:center">
            <Button type="primary" @click="handleSettle('formsettle','直接结算')">直接结算</Button>
            <Button type="error" v-if="settleform.animalTotleMoney > settleform.userMoney" @click="handleSettle('formsettle','混合结算')"style="margin-left: 8px">混合结算</Button>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import axios from '@/libs/api.request'
import config from '@/config/index'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
  return {
      total: 100,
      current: 1,
      pageSize: 6,
      formValidate: {
        opinion: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      },
      columns: [
        { title: '申请人', key: 'userName'},
        { title: '动物昵称', key: 'animalName'},
        { title: '动物类型', key: 'animalType'},
        { title: '动物年龄', key: 'animalAge' },
        { title: '申请日期', key: 'applyDate' },
        { title: '申请状态', key: 'applyStatus' },
        { title: '预留电话', key: 'userTel' },
        { title: '操作',slot: 'action', width: 250}
      ],
      animalList: [
        {
            value: '猫',
            label: '猫'
        },
        {
            value: '狗',
            label: '狗'
        },
        {
            value: '鼠',
            label: '鼠'
        },
        {
            value: '其他',
            label: '其他'
        }
      ],
      tableData: [],
      applyStatusList: [
        {
            value: '待审批',
            label: '待审批'
        },
        {
            value: '审批通过',
            label: '审批通过'
        },
        {
            value: '审批未通过',
            label: '审批未通过'
        },
        {
            value: '正在寄养',
            label: '正在寄养'
        },
        {
            value: '已结算',
            label: '已结算'
        }
      ],
      query: {
        animalType: '',
        applyStatus: '',
        applyDate: ''
      },
      editFosterModal: false,
      addFosterModal: false,
      addform: {
          id: 0,
          userId: 0,
          animalName: '',
          userName: '',
          applyDate: '',
          animalType: '',
          animalAge: '',
          animalDesc: '',
          animalProve: '',
          applyStatus: '',
          userTel: '',
          applyPrice: 0,
          opinion: ''
      },
      editform: {
          id: 0,
          userId: 0,
          animalName: '',
          userName: '',
          applyDate: '',
          animalType: '',
          animalAge: '',
          animalDesc: '',
          animalProve: '',
          applyStatus: '',
          userTel: '',
          applyPrice: 0,
          opinion: ''
      },
      header: config.header,
      editFormImgList: [],
      isShow: true,
      arriveModal: false,
      arriveform: {
        id: 0,
        arriveDate: '',
        animalNo: ''
      },
      arriveform: {
        id: 0,
        arriveDate: '',
        animalNo: ''
      },
      settleModal: false,
      settleform: {
        fosterId: 0,
        animalName: '',
        userMoney: '',
        settleDate: '',
        animalSingleMoney: '',
        animalTotleMoney: '',
        settleType: '',
        arriveDate: ''
      }
    }
  },
  created() {
    this.getFosterTable()
  },
  methods: {
    /**
     * 进入寄养申请界面
     */
    addFoster () {
      this.$router.push({  
            path: '/animalFoster',   
            name: 'animalFoster',
            params: {   
                id: ''
            }
        })
    },
    /**
     * 打开审核的模态框
     */
    editFoster (index) {
      this.editFormImgList = this.tableData[index].animalProve.split(",")
      this.editFormImgList.pop()
      this.editform = JSON.parse(JSON.stringify(this.tableData[index])) 
      if(this.editform.applyStatus != "待审批") this.isShow = false
      this.editFosterModal = true
    },

    /**
     * 编辑时点击提交表单按钮
     */
    handleSubmit (name,status) {
      this.$refs[name].validate((valid) => {//表单合法性进行验证
        if (valid) {
          this.editform.applyStatus = status
            //保存
          this.edit()
        } else {
            this.$Message.error('请确认表单是否填写完整');
        }
      })
    },

    /**
     * 根据条件查询申请列表
     */
    getFosterTable(){
      axios.request({
        url: 'foster/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: this.pageSize,
          applyDate: this.query.applyDate,
          applyStatus: this.query.applyStatus,
          animalType: this.query.animalType,
          userId: JSON.parse(localStorage.getItem("user")).id
        }
      }).then(res => {
        if(res.data.status == 0){
          this.tableData = res.data.data.records
          this.total = parseInt(res.data.data.total)
        }
      })
    },
    /**
     * 当前页改变时
     */
    changePage(current){
      this.current = current
      this.getFosterTable()
    },
    /**
     * 调用编辑动物的接口
     */
    edit() {
      axios.request({
        url: 'foster/sh',
        method: 'post',
        headers: config.header,
        data: this.editform
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("操作成功");
          
        } else {
          this.$Message.error("操作失败");
        }
        this.getFosterTable()
        this.editFosterModal = false
      })
    },
    /**
     * 点击宠物到店，弹出模态框
     */
    arrive(index) {
      this.arriveModal = true
      this.arriveform.applyId = this.tableData[index].id
    },
    /**
     * 宠物到店提交
     */
    ok() {
      axios.request({
        url: 'foster/arrive',
        method: 'post',
        headers: config.header,
        data: this.arriveform
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("操作成功");
        } else {
          this.$Message.error("操作失败");
        }
        this.getFosterTable()
        this.arriveModal = false
      })
    },
    /**
     * 重置审批状态
     */
    reset(index) {
      if(!confirm("确认将状态重置为待审批状态吗")) {
        return
      }
      axios.request({
        url: 'foster/reset',
        method: 'get',
        headers: config.header,
        params: {
          fosterId: this.tableData[index].id
        }
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("操作成功");
          this.isShow = true
        } else {
          this.$Message.error("操作失败");
        }
        this.getFosterTable()
      })
    },
    /**
     * 结算
     */
    settleOpen(index) {
      this.settleModal = true
      this.settleform.animalName = this.tableData[index].animalName
      this.settleform.fosterId = this.tableData[index].id
      this.settleform.settleDate =this.dateFormat("YYYY-mm-dd", new Date())
      this.getMoney()
    },
    /**
     * 查询应付费与用户余额
     */
    getMoney() {
      axios.request({
        url: 'foster/getMoney',
        method: 'get',
        headers: config.header,
        params: {
          fosterId: this.settleform.fosterId,
          settleDate: this.dateFormat("YYYY-mm-dd", new Date(this.settleform.settleDate))
        }
      }).then(res => {
        this.settleform.userMoney = res.data.data.userMoney
        this.settleform.animalSingleMoney = res.data.data.animalSingleMoney
        this.settleform.animalTotleMoney = res.data.data.animalTotleMoney
        this.settleform.arriveDate = res.data.data.arriveDate
      })
    },
    /**
     * 提交结算
     */
    handleSettle (name,type) {
      this.$refs[name].validate((valid) => {//表单合法性进行验证
        if (valid) {
          this.settleform.settleType = type
          this.settle()
        } else {
            this.$Message.error('请确认表单是否填写完整');
        }
      })
    },
    settle() {
      this.settleform.settleDate = this.dateFormat("YYYY-mm-dd", new Date(this.settleform.settleDate))
      axios.request({
        url: 'foster/settle',
        method: 'post',
        headers: config.header,
        data: this.settleform
      }).then(res => {
         this.$Message.success('结算成功！');
      })
    },
    getDate(value){
      this.query.applyDate = value
    },
    getDate1(value){
      this.arriveform.arriveDate = value
    },
    getDate2(value) {
      this.settleform.settleDate = value
      this.getMoney()
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
      };
      return fmt;
    }
  },
}
</script>

<style>

</style>
