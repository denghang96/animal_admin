<template>
    <div>
        <Card style="width:350px;display: inline-block; margin-right: 15px;" v-for="item in tableData">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                Classic film
            </p>
            <a href="#" slot="extra" @click.prevent="changeLimit">
                <Icon type="ios-loop-strong"></Icon>
                {{item.animalName}}
            </a>
            <ul>
            <div style="text-align:center">
                <img :src="item.animalImg">
                <h3>A high quality UI Toolkit based on Vue.js</h3>
            </div>
            </ul>
        </Card>
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
                animalStatus: this.query.animalStatus,
                }
            }).then(res => {
                console.log(res)
                if(res.data.status == 0){
                for(var i = 0; i < res.data.data.records.length; i++){
                    res.data.data.records[i].animalMoney = res.data.data.records[i].animalMoney/100
                }
                this.tableData = res.data.data.records
                this.total = parseInt(res.data.data.total)
                }
            })
        },
    }
}
</script>
