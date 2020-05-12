<template>
    <div>
        <div style="width:100%;height:35px;margin-left:15px;margin-top:5px;">
            <Row class="code-row-bg">
                <Col span="4">    
                    <Select v-model="query.animalType" placeholder="宠物类型" clearable>
                    <Option v-for="item in animalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="4" style="margin-left:5px">    
                    <Select v-model="query.animalStatus" placeholder="动物状态" clearable>
                    <Option v-for="item in animalList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col span="4" style="margin-left:5px">
                    <Button type="primary" @click="getAnimalTableQuery">查询</Button>
                </Col>
            </Row>
        </div>
        <Scroll :on-reach-bottom="handleReachBottom" height="750" loading-text="加载更多">
            <Card style="width:350px;display: inline-block; margin: 10px 15px;" v-for="(item,index) in tableData">
                <p slot="title">
                    <Icon :type="item.type"></Icon>
                    {{item.projectType}}
                </p>
                <a href="#" slot="extra" @click.prevent="changeLimit">
                    <Icon type="ios-loop-strong"></Icon>
                    {{item.animalName}}
                </a>
                <ul>
                <div style="text-align:center">
                    <img :src="item.animalTiltleImg" style="width:200px;height:200px;">
                    <h3>
                        <span style="margin-right:22px;">类型：{{item.animalType}}</span>
                        <span style="margin-right:22px;">年龄：{{item.animalAge}}</span>
                        <span style="margin-right:22px;color:red;">￥{{item.animalMoney}}</span>
                    </h3>
                </div>
                </ul>
                <div style="margin-top:10px;">
                    <Button  type="error" style="margin-right:100px;" @click="clickBtn(index)">{{item.label}}</Button>
                    <Button  type="default" style="" @click="detail(index)">宠物详情</Button>
                </div>
            </Card>
        </Scroll>
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
    </div>
</template>
<script>
import config from '@/config/index'
import axios from '@/libs/api.request'
export default {
    data(){
        return {
            limitNum: 5,
            limitFrom: 0,
            tableData:[],
            current:  1,
            total: 10,
            query: {
                animalType: '',
                animalNo: '',
                animalName: '',
                animalStatus: '待助养,待领养'
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
            animalList2: [
                {
                    value: '待领养',
                    label: '领养'
                },
                {
                    value: '待助养',
                    label: '助养'
                }
            ],
            tableDataIndex: 0
        }
    },
    created() {
        this.getAnimalTable()
    },
    methods: {
        changeLimit () {
            this.limitFrom = this.limitFrom === 0 ? 5 : 0;
        },
        getAnimalTableQuery() {
            this.tableData = []
            if(this.query.animalStatus == undefined){
                this.query.animalStatus = '待助养,待领养'
            }
            this.current = 1
            this.getAnimalTable()
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
                size: 8,
                animalType: this.query.animalType,
                animalNo: this.query.animalNo,
                animalName: this.query.animalName,
                animalStatus: this.query.animalStatus
                }
            }).then(res => {
                if(res.data.status == 0){
                for(var i = 0; i < res.data.data.records.length; i++){
                    res.data.data.records[i].animalMoney = res.data.data.records[i].animalMoney/100
                    if(res.data.data.records[i].animalStatus == "待助养"){
                        this.$set(res.data.data.records[i],"label","我要帮助它！")
                        this.$set(res.data.data.records[i],"type","ios-paw-outline")
                    }else{
                        this.$set(res.data.data.records[i],"label","我要带它回家！")
                        this.$set(res.data.data.records[i],"type","ios-paw")
                    }
                }
                    this.tableData = this.tableData.concat(res.data.data.records)
                    this.total = parseInt(res.data.data.total)
                    this.current = parseInt(res.data.data.current) + 1
                }
            })
        },
        //加载更多
        handleReachBottom(){
            return new Promise(resolve => {
                setTimeout(() => {
                    this.getAnimalTable()
                    resolve()
                }, 2000)
            })
         },
         //点击领养助养按钮
         clickBtn(index){
             this.tableDataIndex = index
             if(this.tableData[index].animalStatus == "待助养"){
                axios.request({
                    url: 'user/checkPayPwd',
                    method: 'get',
                    headers: config.header
                }).then(res => {
                    if(res.data.status == "1"){
                        this.$Message.error('请先设置支付密码！')
                        this.modal1 = true
                        
                    }else{
                        this.modal2 = true
                        this.payMoney = this.tableData[index].animalMoney
                        this.payAnimal.animalId = this.tableData[index].id
                    }
                })
             }else{
                this.$router.push({  
                    path: '/animal-adopt',   
                    name: 'animal-adopt',  
                    params: {   
                        id: this.tableData[index].id
                    }
                })
             }
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
                url: 'user/checkPayPwdIsOk',
                method: 'get',
                headers: config.header,
                params: {
                    'payPwd': this.payAnimal.payPwd
                }
            }).then(res => {
                if(res.data.status == 1){
                    this.$Message.error('支付密码错误!')
                }else{
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
                }
            })
         },
         cancel2(){

         },
         //跳转到宠物详情界面
         detail(index){
             this.$router.push({  
                path: '/animal-detail',   
                name: 'animal-detail',  
                params: {   
                    id: this.tableData[index].id
                }
            }) 
         }
    }
}
</script>