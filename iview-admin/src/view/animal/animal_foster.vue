<template>
    <div>
        <Row :gutter="16" style="margin-left:20px;">
        <Col span="12">
            <Form ref="form1" :model="adoptForm" :rules="formValidate" :label-width="80">
                <FormItem label="动物类型:" prop="animalType">
                     <Select v-model="adoptForm.animalType" placeholder="选择动物">
                        <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="宠物昵称:" prop="animalNmae">
                    <Input v-model="adoptForm.animalName"></Input>
                </FormItem>
                <FormItem label="联系电话:" prop="userTel" required>
                    <Input v-model="adoptForm.userTel" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="宠物年龄:" prop="animalAge" required>
                    <Input v-model="adoptForm.animalAge" placeholder="请输入领养原因"></Input>
                </FormItem>
                <FormItem label="宠物特征:" prop="animalDesc" required>
                    <Input v-model="adoptForm.animalDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入领养家庭环境"></Input>
                </FormItem>
                <FormItem label="宠物图片:" prop="animalProve" required>
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
            //寄养表单
            adoptForm: {
                userId: JSON.parse(localStorage.getItem("user")).id,
                applyDate: '',
                applyStatus: '待审批',
                userTel: '',
                //动物信息
                animalName: '',
                animalType: '',
                animalAge: '',
                animalDesc: '',
                animalProve: ''
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
                    this.adoptForm.animalMoney = res.data.data.animalMoney
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
            if(this.adoptForm.animalDesc == "" && this.adoptForm.animalDesc == "" && this.adoptForm.animalProve == ""&& this.adoptForm.userTel == "" && this.userAge == ""){
                alert("请输入必填信息!")
                return
            }
            axios.request({
                url: 'foster/add',
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
            this.$router.replace("myFoster") 
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
        }
    }
}
</script>