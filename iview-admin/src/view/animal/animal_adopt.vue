<template>
    <div>
        <Row :gutter="16" style="margin-left:20px;">
        <Col span="12">
            <Form ref="form1" :model="adoptForm" :rules="formValidate" :label-width="80">
                <FormItem label="动物类型:" prop="animalType">
                     <Input v-model="adoptForm.animalType" disabled></Input>
                </FormItem>
                <FormItem label="动物昵称:" prop="animalNmae">
                    <Input v-model="adoptForm.animalName" disabled></Input>
                </FormItem>
                <FormItem label="领养价格:" prop="animalMoney">
                    <Input v-model="adoptForm.animalMoney" disabled></Input>
                </FormItem>
                <FormItem label="联系电话:" prop="adoptTel" required>
                    <Input v-model="adoptForm.adoptTel" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="联系地址:" prop="adoptAddress" required>
                    <Input v-model="adoptForm.adoptAddress" placeholder="请输入联系地址"></Input>
                </FormItem>
                <FormItem label="运输方式:" prop="traffiType" required>
                    <Input v-model="adoptForm.traffiType" placeholder="请输入运输方式"></Input>
                </FormItem>
                <FormItem label="是否有小孩" prop="hasChildren">
                    <RadioGroup v-model="adoptForm.hasChildren">
                        <Radio label="是">是</Radio>
                        <Radio label="否">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="领养原因:" prop="adoptReason" required>
                    <Input v-model="adoptForm.adoptReason" placeholder="请输入领养原因"></Input>
                </FormItem>
                <FormItem label="领养家庭环境描述:" prop="familyDesc" required>
                    <Input v-model="adoptForm.familyDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入领养家庭环境"></Input>
                </FormItem>
                <FormItem label="领养家庭环境图片:" prop="familyImg" required>
                    <img :src="item" v-for="(item,index) in editFormImgList" width="100px" @click="removeImg(index)" height="100px">
                </FormItem>
                <FormItem label="申请时间:" prop="applyDate" required>
                    <DatePicker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="adoptForm.applyDate" @on-change="getDate"></DatePicker>
                </FormItem>
                <Upload 
                :action="fileUploadUrl"
                :on-success="handleEditUploadSuccess"
                :headers="header">
                <Button icon="ios-cloud-upload-outline">上传家庭环境图片</Button>
                </Upload>
                <FormItem style="text-align:center">
                <Button type="primary" @click="handleSubmit1('adoptForm')">提交</Button>
                <Button @click="handleReset1('adoptForm')" style="margin-left: 8px">重置</Button>
                <Button @click="back()" style="margin-left: 8px">返回</Button>
                </FormItem>
            </Form>
        </Col>
        <Col span="6">
            <Modal
                v-model="modal1"
                title="设置支付密码"
                @on-ok="ok"
                @on-cancel="cancel">
                <Input v-model="form.payPwd" type="password" placeholder="请输入密码！" style="width: 300px" required/>
            </Modal>
            <Modal
                v-model="modal2"
                title="输入支付密码"
                @on-ok="ok2"
                @on-cancel="cancel2">
                <h3 style="color:red;">￥{{payMoney}}</h3>
                <Input v-model="payAnimal.payPwd" type="password" placeholder="请输入密码！" style="width: 300px" required/>
            </Modal>
        </Col>
    </Row>
        
    </div>
</template>
<style>
.c{
    text-align: center;
}
</style>
<script>
import config from '@/config/index'
import axios from '@/libs/api.request'
export default {
    data(){
        return{
            value1: 0,
            animalData: {},
            animalImgs: [],
            form:{
                amimalId: '',
                comment: '',
            },
            modal1: false,
            modal2: false,
            payMoney: 0,
            form: {
                payPwd: ''
            },
            payAnimal: {
                payPwd: '',
                animalId: ''
            },
            //领养表单
            adoptForm: {
                userId: JSON.parse(localStorage.getItem("user")).id,
                animalId: this.$route.params.id,
                applyDate: '',
                applyStatus: '待审批',
                adoptTel: '',
                adoptAddress: '',
                adoptReason: '',
                familyDesc: '',
                familyImg: '',
                hasChildren: '',
                traffiType: '',
                //动物信息
                animalName: '',
                animalMoney: '',
                animalType: ''
            },
            formValidate: {
                animalName: [
                { required: true, message: '请输入动物编号！', trigger: 'blur' }
                ],
                applyDate: [
                { required: true, message: '请填写日期！', trigger: 'blur' }
                ]
            },
            fileUploadUrl: axios.baseUrl + 'image/upload',
            current: 1,
            imgList: [],
            editFormImgList:[]
        }
    },
    created(){
        this.getAnimalData()
        this.getComment()
    },
    methods:{
        getAnimalData(){
            this.form.amimalId = this.$route.params.id
            axios.request({
                url: 'animal/getById',
                method: 'get',
                headers: config.header,
                params: {
                    id: this.$route.params.id,
                }
            }).then(res => {
                if(res.data.status == 0){
                    this.adoptForm.animalName = res.data.data.animalName
                    this.adoptForm.animalMoney = res.data.data.animalMoney / 100
                    this.adoptForm.animalType = res.data.data.animalType

                }
            })
        },
        handleReachBottom(){

        },
        handleEditUploadSuccess(res, file) {
            this.editFormImgList.push(axios.baseUrl + 'image/showImage/?path=' + res)
            this.adoptForm.familyImg = ''
            for(var i = 0; i < this.editFormImgList.length;  i++) {
                if(i > 0) {
                this.adoptForm.familyImg = this.adoptForm.familyImg+','+ this.editFormImgList[i] + ","
                }else {
                this.adoptForm.familyImg = this.editFormImgList[i] + ","
                }}
            },
        /**
         * 删除一张图片
         */
        removeImg(index) {
            this.editFormImgList.splice(index,1); 
            this.adoptForm.familyImg = ''
            for(var i = 0; i < this.editFormImgList.length;  i++) {
                if(i > 0) {
                this.adoptForm.familyImg  = this.adoptForm.familyImg +','+ this.editFormImgList[i] + ","
                }else {
                this.adoptForm.familyImg  = this.editFormImgList[i] + ","
                }
            }
        },
        handleSubmit1(){
            axios.request({
                url: 'adopt/add',
                method: 'post',
                headers: config.header,
                data: this.adoptForm
            }).then(res => {
                if(res.data.status == 0) {
                    this.$Message.success("提交申请成功，请耐心等待审批！");
                    this.back()
                }
            })
        },
        /**
         * 重置表单
         */
        handleReset1 (name) {
            this.$refs[name].resetFields();
        },
        getDate(value){
            this.adoptForm.applyDate = value
        },
        //返回
        back(){
            this.$router.replace("animalHome") 
        },
        comment(){
            axios.request({
                url: 'comment/add',
                method: 'post',
                headers: config.header,
                data: this.form
            }).then(res => {
                this.$Message.success("操作成功！")
            })
        },
        ok(){
             axios.request({
                url: 'user/setPayPwd',
                method: 'post',
                headers: config.header,
                data:this.form
            }).then(res => {
                if(res.data.status == "1"){
                    this.$Message.error('设置密码失败！')
                }else{
                    this.$Message.success('设置密码成功！')
                }
            })
         },
         cancel(){

         },
         ok2(){
             axios.request({
                url: 'support/add',
                method: 'post',
                headers: config.header,
                data: this.payAnimal
            }).then(res => {
                this.$Message.success(this.tableData[this.tableDataIndex].animalName + '感谢你!')
                this.tableData = []
                this.getAnimalTableQuery()
            })
         },
         cancel2(){

         },
    }
}
</script>