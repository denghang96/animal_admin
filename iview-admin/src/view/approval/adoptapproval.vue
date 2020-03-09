<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4">    
        <Select v-model="query.applyStatus" placeholder="申请状态" clearable>
          <Option v-for="item in applyStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <DatePicker type="date" format="yyyy-MM-dd" placeholder="申请日期" v-model="query.applyDate" @on-change="getDate" style="width:250px"></DatePicker>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getAdoptTable">查询</Button>
      </Col>
    </Row>
    
    <Table border :columns="columns" :data="tableData" :height="540" style="margin-top:10px">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="editAnimal(index)">审核</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>

    <!--编辑动物信息的模态框-->
    <!-- <Modal
        v-model="editAnimalModal"
        width="1000px"
        title="编辑动物">
        <div slot="footer"></div>
        <Form ref="form1" :model="editform" :rules="formValidate" :label-width="80">
            <FormItem label="动物类型" prop="animalType">
              <Select v-model="editform.animalType" placeholder="选择动物">
                <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="动物编号" prop="animalNo" required>
                <Input v-model="editform.animalNo" placeholder="请输入动物编号"></Input>
            </FormItem>
            <FormItem label="动物昵称" prop="animalName">
                <Input v-model="editform.animalName" placeholder="请输入动物昵称"></Input>
            </FormItem>
            <FormItem label="动物年龄" prop="animalAge">
                <Input v-model="editform.animalAge" placeholder="请输入动物年龄"></Input>
            </FormItem>
            <FormItem label="项目类型" prop="projectType">
              <Select v-model="editform.projectType" placeholder="项目类型">
                <Option v-for="item in projectTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="费用" prop="animalMoney">
                <Input v-model="editform.animalMoney" placeholder="请输入费用"></Input>
            </FormItem>
            <FormItem label="动物习性" prop="animalFeatures">
                <Input v-model="editform.animalFeatures" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入动物习性"></Input>
            </FormItem>
            <FormItem label="封面图" prop="animalTiltleImg">
                <img :src="editform.animalTiltleImg" width="100px" height="100px">
            </FormItem>
            <FormItem label="动物图片" prop="animalImg">
                <img :src="item" v-for="(item,index) in editFormImgList" width="100px" @click="removeImg(index)" height="100px">
            </FormItem>
            <FormItem label="录入时间" prop="animalDate" required>
                <DatePicker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="editform.animalDate" @on-change="getDate"></DatePicker>
            </FormItem>
            <Upload 
              :action="fileUploadUrl"
              :on-success="handleEditUploadSinggleSuccess"
              :headers="header">
              <Button icon="ios-cloud-upload-outline">上传封面图片</Button>
            </Upload>
            <Upload 
              :action="fileUploadUrl"
              :on-success="handleEditUploadSuccess"
              :headers="header">
              <Button icon="ios-cloud-upload-outline">上传动物图片</Button>
            </Upload>
            <FormItem style="text-align:center">
              <Button type="primary" @click="handleSubmit1('form1')">提交</Button>
              <Button @click="handleReset1('form1')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </Modal> -->
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
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
        // animalNo: [
        //   { required: true, message: '请输入动物编号！', trigger: 'blur' }
        // ],
        // animalDate: [
        //   { required: true, message: '请填写日期！', trigger: 'blur' }
        // ]
      },
      columns: [
        { title: '申请人', key: 'userName'},
        { title: '动物昵称', key: 'animalName'},
        { title: '动物编号', key: 'animalNo'},
        { title: '动物昵称', key: 'animalName' },
        { title: '申请日期', key: 'applyDate' },
        { title: '申请状态', key: 'applyStatus' },
        { title: '申请原因', key: 'adoptReason' },
        { title: '操作',slot: 'action' }
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
        }
      ],
      query: {
        applyStatus: '',
        applyStatus: ''
      },
      
    //   editAnimalModal: false,

    editform: {
        id: 0,
        userId: 0,
        animalId: 0,
        applyDate: '',
        applyStatus: '',
        adoptTel: '',
        adoptAddress: '',
        adoptReason: '',
        familyDesc: '',
        familyImg: '',
        hasChildren: '',
        traffiType: ''
      },
      header: config.header,
      imgList: []
    }
  },
  created() {
    this.getAdoptTable()
  },
  methods: {
    /**
     * 打开审核的模态框
     */
    // editAnimal (index) {
    //   this.editFormImgList = this.tableData[index].animalImg.substring(0,this.tableData[index].animalImg.length-1).split(",")
    //   this.editform = JSON.parse(JSON.stringify(this.tableData[index])) 
    //   this.editAnimalModal = true
    // },

    /**
     * 编辑时点击提交表单按钮
     */
    // handleSubmit1 (name) {
    //   this.$refs[name].validate((valid) => {//表单合法性进行验证
    //     if (valid) {
    //         //保存
    //       this.edit()
    //     } else {
    //         this.$Message.error('请确认表单是否填写完整');
    //     }
    //   })
    // },
    /**
     * 重置表单
     */
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    /**
     * 根据条件查询动物列表
     */
    getAdoptTable(){
      axios.request({
        url: 'adopt/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: 10,
          applyDate: this.query.applyDate,
          applyStatus: this.query.applyStatus
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
      this.getAnimalTable()
    },
    /**
     * 调用编辑动物的接口
     */
    edit(index) {
      this.editform.animalMoney = this.editform.animalMoney*100
      if(this.editform.projectType == "领养") {
        this.editform.animalStatus = "待领养"
      } else if(this.editform.projectType == "寄养") {
        this.editform.animalStatus = "寄养"
         this.editform.animalStatus = "寄养"
      } else if(this.editform.projectType == "助养") {
        this.editform.animalStatus = "待助养"
      } 
      this.editform.animalMoney = this.editform.animalMoney*100
      axios.request({
        url: 'animal/update',
        method: 'post',
        headers: config.header,
        data: this.editform
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("编辑成功");
          this.getAnimalTable()
        } else {
          this.$Message.error("编辑失败");
        }
      })
    },

    getDate(value){
      this.query.applyDate = value
    },
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
