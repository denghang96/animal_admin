<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4">    
        <Select v-model="query.animalType" placeholder="选择动物">
          <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" offset = "1">    
        <Select v-model="query.animalStatus" placeholder="动物状态">
          <Option v-for="item in animalStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" offset = "1"><Input v-model="query.animalNo" placeholder="动物编号" /></Col>
      <Col span="4" offset = "1"><Input v-model="query.animalName" placeholder="动物昵称" /></Col>
      <Col span="4" offset = "1"><Button type="success" @click="addAnimal">新增</Button></Col>
    </Row>
    
    <Card style="margin-top:10px">
      <tables ref="tables" editable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" :height="500"/>
    </Card>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
    </div>
    <!--新增动物的模态框-->
    <Modal
        v-model="addAnimalModal"
        width="1000px"
        title="新增动物">
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
                <img :src="item" v-for="item in imgList" width="100px" height="100px">
            </FormItem>
            <FormItem label="录入时间" prop="animalDate">
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
              :headers="header"
              multiple="true">
              <Button icon="ios-cloud-upload-outline">上传动物图片</Button>
            </Upload>
            <FormItem>
              <Button type="primary" @click="handleSubmit('form')">提交</Button>
              <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
import config from '@/libs/api.request'
import axios from '@/libs/api.request'
import api from '@/config/index'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      formValidate: {
        animalNo: [
          { required: true, message: '请输入动物编号！', trigger: 'blur' }
        ],
      },
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
          value: '寄养',
          label: '寄养'
        },
        {
          value: '寄养结束',
          label: '寄养结束'
        }
      ],
      addAnimalModal: false,
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
      fileUploadUrl: config.baseUrl + 'image/upload',
      header: api.header,
      imgList: []
    }
  },
  methods: {
    /**
     * 打开新增动物的模态框
     */
    addAnimal () {
      this.addAnimalModal = true
    },
    /**
     * 上传封面图片
     */
    handleUploadSinggleSuccess(res, file) {
      this.form.animalTiltleImg = config.baseUrl + 'image/showImage/?path=' + res
    },
    /**
     * 上传动物图片
     */
    handleUploadSuccess(res, file) {
      this.imgList.push(config.baseUrl + 'image/showImage/?path=' + res)
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
     * 点击提交表单按钮
     */
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {//表单合法性进行验证
        if (valid) {
            //保存
          this.add()
        } else {
            this.$Message.error('Fail!');
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
        headers: api.header,
        data: this.form
      }).then(res => {
        if(res.data.status == 0) {
          this.$Message.success("添加成功");
        } else {
          this.$Message.error("添加失败");
        }
      })

    },
    getDate(value){
      this.form.animalDate = value
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
