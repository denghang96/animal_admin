<template>
    <div>
        <Scroll :on-reach-bottom="handleReachBottom" height="500" loading-text="加载更多">
            <Card style="width:350px;display: inline-block; margin: 15px;" v-for="(item,index) in tableData">
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
                    <Button  type="default" style="">宠物详情</Button>
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
                animalStatus: ''
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
                animalStatus: "待助养,待领养",
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
                this.current = parseInt(res.data.data.current)
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
                url: 'support/add',
                method: 'post',
                headers: config.header,
                data: this.payAnimal
            }).then(res => {
                console.log(res)
                this.$Message.success(this.tableData[this.tableDataIndex].animalName + '感谢你!')
                this.tableData = []
                this.getAnimalTable()
            })
         },
         cancel2(){

         }
    }
}
</script>