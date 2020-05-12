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
    
    <Table border :columns="columns" :data="tableData" :height="720" style="margin-top:10px">
    </Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>

    <!--弹出审核的模态框-->
    <Modal
        v-model="editAdoptModal"
        width="1000px"
        title="审核领养申请">
        <div slot="footer"></div>
        <Form ref="form" :model="editform" :rules="formValidate" :label-width="80">
          <FormItem label="联系人" prop="userName">
            <Input v-model="editform.userName" readonly></Input>
          </FormItem>
          <FormItem label="联系人电话" prop="adoptTel">
            <Input v-model="editform.adoptTel" readonly></Input>
          </FormItem>
          <FormItem label="家庭住址" prop="adoptAddress">
              <Input v-model="editform.adoptAddress" readonly></Input>
          </FormItem>
           <FormItem label="动物编号" prop="animalNo">
               <Input v-model="editform.animalNo" readonly></Input>
          </FormItem>
          <FormItem label="动物昵称" prop="animalName">
               <Input v-model="editform.animalName" readonly></Input>
          </FormItem>
          <FormItem label="领养原因描述" prop="adoptReason">
              <Input v-model="editform.adoptReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" readonly></Input>
          </FormItem>
          <FormItem label="家庭情况描述" prop="familyDesc">
              <Input v-model="editform.familyDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" readonly></Input>
          </FormItem>
          <FormItem label="家庭环境照片" prop="familyImg">
              <img :src="item" v-for="(item,index) in familyImgList" width="100px" height="100px" style="margin-right:5px">
          </FormItem>
          <FormItem label="是否有小孩" prop="hasChildren">
            <RadioGroup v-model="editform.hasChildren">
              <Radio label="是" disabled>
                  <span>是</span>
              </Radio>
              <Radio label="否" disabled>
                  <span>否</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="宠物运输方式" prop="traffiType">
              <Input v-model="editform.traffiType" readonly></Input>
          </FormItem>
        </Form>
    </Modal>
     <!--弹出审核的模态框-->
    <Modal
        v-model="modal2"
        title="申请结果">
        <div slot="footer"></div>
        <Card :bordered="false">
            <p slot="title" style="color:red;">{{editform.applyStatus}}</p>
            <p>{{editform.opinion}}</p>
        </Card>
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
      total: 0,
      current: 1,
      pageSize: 10,
      modal2: false,
      formValidate: {
        opinion: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      },
      columns: [
        { title: '申请人', key: 'userName'},
        { title: '动物图片', slot: 'animalTiltleImg', editable: true ,render: (h, params) => {
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
        }},
        { title: '动物昵称', key: 'animalName'},
        { title: '动物编号', key: 'animalNo'},
        { title: '动物特征', key: 'animalFeatures' },
        { title: '申请日期', key: 'applyDate' },
        { title: '申请原因', key: 'adoptReason' },
        {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
                var flag = false
                if(params.row.applyStatus == '待审批'){
                    flag = true
                }
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.editadopt(params.index)
                            }
                        }
                    }, '详情'),
                    h('Button', {
                        props: {
                            type: 'success',
                            size: 'small',
                            disabled: flag
                        },
                        on: {
                            click: () => {
                                this.result(params.index)
                            }
                        }
                    }, '申请结果')
                ]);
            }
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
        }
      ],
      query: {
        applyStatus: '',
        applyDate: ''
      },
      editAdoptModal: false,
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
          traffiType: '',
          userName: '',
          animalNo: '',
          animalName: '',
          opinion: ''
      },
      header: config.header,
      familyImgList: []
    }
  },
  created() {
    this.getAdoptTable()
  },
  methods: {
    /**
     * 详情
     */
    editadopt (index) {
      this.familyImgList = this.tableData[index].familyImg.substring(0,this.tableData[index].familyImg.length-1).split(",")
      this.editform = JSON.parse(JSON.stringify(this.tableData[index])) 
      this.editAdoptModal = true
    },
    /**
     * 审核结果
     */
    result (index) {
        this.editform = JSON.parse(JSON.stringify(this.tableData[index])) 
        this.modal2 = true
    },
    /**
     * 根据条件查询申请列表
     */
    getAdoptTable(){
      axios.request({
        url: 'adopt/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: this.pageSize,
          applyDate: this.query.applyDate,
          applyStatus: this.query.applyStatus,
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
      this.getAdoptTable()
    },

    getDate(value){
      this.query.applyDate = value
    },
  },
}
</script>

<style>

</style>
