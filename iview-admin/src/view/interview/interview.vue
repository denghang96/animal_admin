<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4" style="margin-left:5px"><Input v-model="query.animalNo" placeholder="动物编号" /></Col>
      <Col span="4" style="margin-left:5px"><Input v-model="query.userName" placeholder="领养者名称" /></Col>
      <Col span="4" style="margin-left:5px">    
        <DatePicker type="date" format="yyyy-MM-dd" placeholder="领养日期" v-model="query.adoptDate" @on-change="getDate" style="width:250px"></DatePicker>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getInterviewTable">查询</Button>
      </Col>
    </Row>
    
    <Table border :columns="columns" :data="tableData" :height="540" style="margin-top:10px">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="editInterview(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>
    

    <!--编辑动物信息的模态框-->
    <Modal
        v-model="editInterviewModal"
        width="1000px"
        title="编辑动物">
        <div slot="footer"></div>
        <Form ref="form1" :model="editform" :rules="formValidate" :label-width="80">
            <FormItem label="动物编号" prop="animalNo" required>
                <Input v-model="editform.animalNo" placeholder="请输入动物编号" readonly></Input>
            </FormItem>
            <FormItem label="回访日期" prop="adoptDate">
                <DatePicker type="date" format="yyyy-MM-dd" placeholder="回访日期" v-model="editform.adoptDate" @on-change="getDate2" style="width:250px"></DatePicker>
            </FormItem>
            <FormItem label="领养者姓名" prop="userName">
                <Input v-model="editform.userName" placeholder="领养者姓名"></Input>
            </FormItem>
            <FormItem label="联系方式" prop="userTel">
              <Input v-model="editform.userTel" placeholder="联系方式"></Input>
            </FormItem>
            <FormItem label="回访描述" prop="adoptDesc">
                <Input v-model="editform.adoptDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="回访描述"></Input>
            </FormItem>
            <FormItem style="text-align:center">
              <Button type="primary" @click="handleSubmit1('form1')">提交</Button>
              <Button @click="handleReset1('form1')" style="margin-left: 8px">重置</Button>
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
        animalNo: [
          { required: true, message: '请输入动物编号！', trigger: 'blur' }
        ],
        animalDate: [
          { required: true, message: '请填写日期！', trigger: 'blur' }
        ]
      },
      columns: [
        { title: '动物编号', key: 'animalNo'},
        { title: '回访日期', key: 'adoptDate'},
        { title: '领养者姓名', key: 'userName'},
        { title: '联系方式', key: 'userTel' },
        { title: '回访描述', key: 'adoptDesc' },
        { title: '操作',slot: 'action' }
      ],
      tableData: [],
      query: {
        userName: '',
        animalNo: '',
        adoptDate: ''
      },
      
      editInterviewModal: false,
      editform: {
        id: 0,
        userName: '',
        userTel: '',
        adoptDate: '',
        animalNo: 0,
        adoptDesc: ''
      },
      header: config.header
    }
  },
  created() {
    this.getInterviewTable()
  },
  methods: {
    /**
     * 打开编辑回访的模态框
     */
    editInterview (index) {
      this.editform = JSON.parse(JSON.stringify(this.tableData[index])) 
      this.editInterviewModal = true
    },

    /**
     * 编辑时点击提交表单按钮
     */
    handleSubmit1 (name) {
      this.$refs[name].validate((valid) => {//表单合法性进行验证
        if (valid) {
            //保存
          this.edit()
        } else {
            this.$Message.error('请确认表单是否填写完整');
        }
      })
    },
    /**
     * 重置表单
     */
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    /**
     * 根据条件查询回访列表
     */
    getInterviewTable(){
      axios.request({
        url: 'interview/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: 10,
          userName: this.query.userName,
          animalNo: this.query.animalNo,
          adoptDate: this.query.adoptDate
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
      this.getInterviewTable()
    },

    /**
     * 调用编辑动物的接口
     */
    edit(index) {
      this.editform.adoptDate = this.dateFormat("YYYY-mm-dd", new Date(this.editform.adoptDate))
      axios.request({
        url: 'interview/update',
        method: 'post',
        headers: config.header,
        data: this.editform
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("编辑成功");
          this.editInterviewModal = false
          this.getInterviewTable()
        } else {
          this.$Message.error("编辑失败");
        }
      })
    },
    /**
     * 调用删除回访的接口
     */
    remove (index) {
      if(!confirm("确认删除？")) return;
      var _this = this
      axios.request({
        url: 'interview/del',
        method: 'post',
        cache:false,
        headers: config.header,
        data: 
          [this.tableData[index].id]
      }).then(res => {
        if(res.data.status == 0){
          this.$Notice.success({
            title: '成功',
            desc: false ? '' : '删除成功！'
          });
          _this.getInterviewTable()
        }
      })
    },
    getDate(value){
      this.query.adoptDate = value
    },
    getDate1(value){
      this.form.adoptDate = value
    },
    getDate2(value){
      this.editform.adoptDate = value
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
  }
}
</script>

<style>

</style>
