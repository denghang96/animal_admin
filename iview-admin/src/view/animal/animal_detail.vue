<template>
    <div>
        <Row :gutter="16">
        <Col span="15">
            <Card style="width:850px;margin-left:25px;">
            <p slot="title">
                <Icon type="ios-paw"></Icon>
                详情
            </p>
            <a href="#" slot="extra" @click="back()">
                <Icon type="ios-loop-strong"></Icon>
                返回
            </a>
            <List>
                <ListItem>宠物姓名： {{animalData.animalName}}</ListItem>
                <ListItem>宠物年龄： {{animalData.animalAge}}</ListItem>
                <ListItem>宠物类型： {{animalData.animalType}}</ListItem>
                <ListItem>需要金额： {{animalData.animalMoney}}</ListItem>
                <ListItem>宠物特征： {{animalData.animalFeatures}}</ListItem>
                <ListItem>宠物图片：
                        <div style="width:200px;">
                            <Carousel v-model="value1" loop :height="200">
                                <CarouselItem v-for="item in animalImgs">
                                    <img :src="item">
                                </CarouselItem>
                            </Carousel>
                        </div>
                </ListItem>
            </List>
        </Card>
        </Col>
        <Col span="6">
            <Scroll :on-reach-bottom="handleReachBottom" :height="510">
                <List>
                    <ListItem v-for="item in comments">
                        <ListItemMeta :avatar="item.userImage" :title="item.userName" :description="item.comment" />
                        <template slot="action">
                            <li>
                                <span>2020-03-10</span>
                            </li>
                        </template>
                    </ListItem>
                </List>
            </Scroll>
            <div >
                <Input v-model="form.comment" @on-search="comment()" search enter-button="评论" placeholder="输入点什么吧" />
            </div>
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
            current: 1,
            comments: []
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
                    if(res.data.data.animalImg != "" && res.data.data.animalImg != undefined){
                        this.animalImgs = res.data.data.animalImg.split(",")
                        this.animalImgs.pop()
                    }
                    this.animalData = res.data.data
                }
            })
        },
        getComment(){
           axios.request({
                url: 'comment/getList',
                method: 'get',
                headers: config.header,
                params: {
                    amimalId: this.$route.params.id,
                    current: this.current
                }
            }).then(res => {
                if(res.data.status == 0){
                    this.comments = res.data.data.records
                }
            }) 
        },
        handleReachBottom(){

        },
        //返回
        back(){
            this.$router.replace("animal_user") 
        },
        comment(){
            axios.request({
                url: 'comment/add',
                method: 'post',
                headers: config.header,
                data: this.form
            }).then(res => {
                this.$Message.success("操作成功！")
                this.getComment()
            })
        }
    }
}
</script>