<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="各动物占比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="动物状态数"/>
        </Card>
      </i-col>
    </Row>
    
    <Row>
      <h2 style="text-align:center">消费走势</h2>
      <Card shadow>
        <example style="height: 310px;" />
      </Card>
    </Row>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import config from '@/config/index'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [],
      pieData: [],
      barData: {}
    }
  },
  created() {
    this.getWebsiteNum()
    this.getAnimalTypeNum()
    this.getAnimalStatusNum()
  },
  methods: {
    //查询最顶部的网站相关统计总数
    getWebsiteNum() {
      let _this = this
      axios.request({
        url: 'statistics/getWebsiteNum/',
        method: 'get',
        headers: config.header
      }).then(res => {
        var websiteNumVo = res.data.data
        _this.inforCardData = [
            { title: '用户总数', icon: 'md-person-add', count: websiteNumVo.userNum, color: '#2d8cf0' },
            { title: '动物总数', icon: 'md-locate', count: websiteNumVo.animalNum, color: '#19be6b' },
            { title: '评论总数', icon: 'md-help-circle', count: websiteNumVo.commentNum, color: '#ff9900' },
            { title: '今日领养', icon: 'md-share', count: websiteNumVo.todayAdopt, color: '#ed3f14' },
            { title: '今日寄养', icon: 'md-chatbubbles', count: websiteNumVo.todayFoster, color: '#E46CBB' },
            { title: '今日助养', icon: 'md-map', count: websiteNumVo.todaySupport, color: '#9A66E4' }
          ]
      })
    },
    //获取不同类型的动物总数
    getAnimalTypeNum() {
      let _this = this
      axios.request({
        url: 'statistics/getAnimalTypeNum/',
        method: 'get',
        headers: config.header
      }).then(res => {
        var _data = res.data.data
        _this.pieData = Object.values(_data)
      })
    },
    //获取不同状态的动物总数
    getAnimalStatusNum() {
      let _this = this
      axios.request({
        url: 'statistics/getAnimalStatusNum/',
        method: 'get',
        headers: config.header
      }).then(res => {
        const _data = res.data.data
        for(let i = 0; i < _data.length; i++) {
          _this.$set(_this.barData,_data[i].status,parseInt(_data[i].num))
        }
      })
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
