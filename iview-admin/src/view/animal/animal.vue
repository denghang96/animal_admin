<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4">    
        <Select v-model="query.animalType" placeholder="选择动物" clearable>
          <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <Select v-model="query.animalStatus" placeholder="动物状态" clearable>
          <Option v-for="item in animalStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" style="margin-left:5px"><Input v-model="query.animalNo" placeholder="动物编号" /></Col>
      <Col span="4" style="margin-left:5px"><Input v-model="query.animalName" placeholder="动物昵称" /></Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getAnimalTable">查询</Button>
        <Button type="success" @click="addAnimal" style="margin-left:5px">新增</Button>
      </Col>
    </Row>
    
    <Table border :columns="columns" :data="tableData" :height="540" style="margin-top:10px">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="editAnimal(index)">编辑</Button>
          <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>
    <!--新增动物的模态框-->
    <Modal
        v-model="addAnimalModal"
        width="1000px"
        title="新增动物">
        <div slot="footer"></div>
        <Form ref="form" :model="form" :rules="formValidate" :label-width="80">
            <FormItem label="动物类型" prop="animalType">
              <Select v-model="form.animalType" placeholder="选择动物">
                <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="动物编号" prop="animalNo" required>
                <Input v-model="form.animalNo" placeholder="请输入动物编号"></Input>
            </FormItem>
            <FormItem label="动物昵称" prop="animalName">
                <Input v-model="form.animalName" placeholder="请输入动物昵称"></Input>
            </FormItem>
            <FormItem label="动物年龄" prop="animalAge">
                <Input v-model="form.animalAge" placeholder="请输入动物年龄"></Input>
            </FormItem>
            <FormItem label="项目类型" prop="projectType">
              <Select v-model="form.projectType" placeholder="项目类型">
                <Option v-for="item in projectTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="费用" prop="animalMoney">
                <Input v-model="form.animalMoney" placeholder="请输入费用"></Input>
            </FormItem>
            <FormItem label="动物习性" prop="animalFeatures">
                <Input v-model="form.animalFeatures" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入动物习性"></Input>
            </FormItem>
            <FormItem label="封面图" prop="animalTiltleImg">
                <img :src="form.animalTiltleImg" width="100px" height="100px">
            </FormItem>
            <FormItem label="动物图片" prop="animalImg">
                <img :src="item" v-for="(item, index) in imgList" width="100px" height="100px" @click="removeAddImg(index)">
            </FormItem>
            <FormItem label="录入时间" prop="animalDate" required>
                <DatePicker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="form.animalDate" @on-change="getDate"></DatePicker>
            </FormItem>
            <Upload 
              :action="fileUploadUrl"
              :on-success="handleUploadSinggleSuccess"
              :headers="header">
              <Button icon="ios-cloud-upload-outline">上传封面图片</Button>
            </Upload>
            <Upload 
              :action="fileUploadUrl"
              :on-success="handleUploadSuccess"
              :headers="header">
              <Button icon="ios-cloud-upload-outline">上传动物图片</Button>
            </Upload>
            <FormItem style="text-align:center">
              <Button type="primary" @click="handleSubmit('form')">提交</Button>
              <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </Modal>

    <!--编辑动物信息的模态框-->
    <Modal
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
        { title: '动物类型', key: 'animalType'},
        { title: '动物头像', key: 'animalTiltleImg',render: (h, params) => {
            return h('div', [
              h('img', {
                domProps: {
                  'src': params.row.animalTiltleImg
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
          }
        },
        { title: '动物编号', key: 'animalNo'},
        { title: '动物昵称', key: 'animalName' },
        { title: '动物年龄', key: 'animalAge' },
        { title: '动物昵称', key: 'animalName' },
        { title: '动物特性', key: 'animalFeatures' },
        { title: '项目类型', key: 'projectType' },
        { title: '动物状态', key: 'animalStatus' },
        { title: '金额', key: 'animalMoney' },
        { title: '录入日期', key: 'animalDate' },
        { title: '操作',slot: 'action' }
      ],
      tableData: [],
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
      query: {
        animalType: '',
        animalNo: '',
        animalName: '',
        animalStatus: ''
      },
      animalStatusList: [
        {
          value: '待领养',
          label: '待领养'
        },
        {
          value: '已领养',
          label: '已领养'
        },
        {
          value: '待助养',
          label: '待助养'
        },
        {
          value: '已助养',
          label: '已助养'
        },
        {
          value: '正在寄养',
          label: '正在寄养'
        },
        {
          value: '寄养结束',
          label: '寄养结束'
        }
      ],
      addAnimalModal: false,
      editAnimalModal: false,
      projectTypeList: [
        {
          value: '领养',
          label: '领养'
        },
        {
          value: '助养',
          label: '助养'
        },
        {
          value: '寄养',
          label: '寄养'
        },
      ],
      form: {
        id: 0,
        animalType: '',
        animalNo: '',
        animalName: '',
        animalAge: 0,
        animalImg: '',
        animalTiltleImg: '',
        animalFeatures: '',
        projectType: '',
        animalStatus: '',
        animalMoney: 0,
        animalDate: ''
      },
      editform: {
        id: 0,
        animalType: '',
        animalNo: '',
        animalName: '',
        animalAge: 0,
        animalImg: '',
        animalTiltleImg: '',
        animalFeatures: '',
        projectType: '',
        animalStatus: '',
        animalMoney: 0,
        animalDate: ''
      },
      fileUploadUrl: axios.baseUrl + 'image/upload',
      header: config.header,
      imgList: [],
      editFormImgList:[]
    }
  },
  created() {
    this.getAnimalTable()
  },
  methods: {
    /**
     * 打开新增动物的模态框
     */
    addAnimal () {
      this.addAnimalModal = true
    },
    /**
     * 打开编辑动物的模态框
     */
    editAnimal (index) {
      this.editFormImgList = this.tableData[index].animalImg.substring(0,this.tableData[index].animalImg.length-1).split(",")
      this.editform = JSON.parse(JSON.stringify(this.tableData[index])) 
      this.editAnimalModal = true
    },
    /**
     * 上传封面图片
     */
    handleUploadSinggleSuccess(res, file) {
      this.form.animalTiltleImg = axios.baseUrl + 'image/showImage/?path=' + res
    },
    /**
     * 上传动物图片
     */
    handleUploadSuccess(res, file) {
      this.imgList.push(axios.baseUrl + 'image/showImage/?path=' + res)
      this.form.animalImg = ''
      for(var i = 0; i < this.imgList.length;  i++) {
        if(i > 0) {
          this.form.animalImg = this.form.animalImg+','+ this.imgList[i] + ","
        }else {
          this.form.animalImg = this.imgList[i] + ","
        }
      }
    },
    /**
     * 新增时点击提交表单按钮
     */
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {//表单合法性进行验证
        if (valid) {
            //保存
          this.add()
        } else {
            this.$Message.error('请确认表单是否填写完整');
        }
      })
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
     * 根据条件查询动物列表
     */
    getAnimalTable(){
      axios.request({
        url: 'animal/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: 10,
          animalType: this.query.animalType,
          animalNo: this.query.animalNo,
          animalName: this.query.animalName,
          animalStatus: this.query.animalStatus,
        }
      }).then(res => {
        if(res.data.status == 0){
          for(var i = 0; i < res.data.data.records.length; i++){
            res.data.data.records[i].animalMoney = res.data.data.records[i].animalMoney/100
          }
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
     * 调用新增动物的接口
     */
    add() {
      this.form.animalMoney = this.form.animalMoney*100
      if(this.form.projectType == "领养") {
        this.form.animalStatus = "待领养"
      } else if(this.form.projectType == "寄养") {
        this.form.animalStatus = "寄养"
         this.form.animalStatus = "寄养"
      } else if(this.form.projectType == "助养") {
        this.form.animalStatus = "待助养"
      } 
      this.form.animalMoney = this.form.animalMoney*100
      axios.request({
        url: 'animal/add',
        method: 'post',
        headers: config.header,
        data: this.form
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("添加成功");
          this.getAnimalTable()
        } else {
          this.$Message.error("添加失败");
        }
      })

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
    /**
     * 编辑时上传封面图片
     */
    handleEditUploadSinggleSuccess(res, file) {
      this.editform.animalTiltleImg = axios.baseUrl + 'image/showImage/?path=' + res
    },
    /**
     * 编辑时上传动物图片
     */
    handleEditUploadSuccess(res, file) {
      this.editFormImgList.push(axios.baseUrl + 'image/showImage/?path=' + res)
      this.editform.animalImg = ''
      for(var i = 0; i < this.editFormImgList.length;  i++) {
        if(i > 0) {
          this.editform.animalImg = this.editform.animalImg+','+ this.editFormImgList[i] + ","
        }else {
          this.editform.animalImg = this.editFormImgList[i] + ","
        }
      }
    },
    /**
     * 新增时删除一张图片
     */
    removeAddImg(index) {
      this.imgList.splice(index,1); 
      this.form.animalImg = ''
      for(var i = 0; i < this.imgList.length;  i++) {
        if(i > 0) {
          this.form.animalImg = this.form.animalImg+','+ this.imgList[i] + ","
        }else {
          this.form.animalImg = this.imgList[i] + ","
        }
      }
    },
    /**
     * 删除一张图片
     */
    removeImg(index) {
      this.editFormImgList.splice(index,1); 
      this.editform.animalImg = ''
      for(var i = 0; i < this.editFormImgList.length;  i++) {
        if(i > 0) {
          this.editform.animalImg = this.editform.animalImg+','+ this.editFormImgList[i] + ","
        }else {
          this.editform.animalImg = this.editFormImgList[i] + ","
        }
      }
    },
    /**
     * 调用删除动物的接口
     */
    remove (index) {
      if(!confirm("确认删除？")) return;
      var _this = this
      axios.request({
        url: 'animal/del',
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
          _this.getAnimalTable()
        }
      })
    },
    getDate(value){
      this.form.animalDate = value
      this.editform.animalDate = value
    },
  }
}
</script>

<style>

</style>
