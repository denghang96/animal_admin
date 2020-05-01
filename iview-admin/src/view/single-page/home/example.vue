<template>
    <div ref="dom"></div>
</template>

<script>
import axios from '@/libs/api.request'
import config from '@/config/index'
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null,
      date:[],
      series:[
        // {
        //   name: '领养',
        //   type: 'line',
        //   stack: '总量',
        //   areaStyle: { normal: {
        //     color: '#10A6FF'
        //   } },
        //   data: [257, 358, 278, 234, 290, 330, 310]
        // },
        // {
        //   name: '寄养',
        //   type: 'line',
        //   stack: '总量',
        //   areaStyle: { normal: {
        //     color: '#0C17A6'
        //   } },
        //   data: [379, 268, 354, 269, 310, 478, 358]
        // },
        // {
        //   name: '助养',
        //   type: 'line',
        //   stack: '总量',
        //   areaStyle: { normal: {
        //     color: '#4608A6'
        //   } },
        //   data: [320, 332, 301, 334, 390, 330, 320]
        // }
      ]
    }
  },
  watch: {
    date: {
      handler() {
        this.drowDom()
      },deep:true
    },
    series: {
      handler() {
        this.drowDom()
      },deep:true
    },
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  created() {
    this.getMoneyNum()
  },
  methods: {
    //获取类型的消费曲线图
    getMoneyNum() {
      let _this = this
      axios.request({
        url: 'statistics/getMoneyNum/',
        method: 'get',
        headers: config.header
      }).then(res => {
        const _data = res.data.data
        _this.date = _data[0].date
        for(let i = 0; i < _data.length; i++) {
          let color = '#10A6FF'
          if(i==0) {
            color = '#10A6FF'
          } else if(i==1) {
            color = '#0C17A6'
          } else if(i==2) {
            color = '#4608A6'
          }else {
            color = '#587543'
          }
          let param = {
            name: _data[i].type,
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {
              color: color
            } },
            data: _data[i].money
          }
          _this.series.push(param)
          console.log(_this.series)
          //_this.$set(_this.barData,_data[i].status,parseInt(_data[i].num))
        }
      })
    },
    drowDom() {
      const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.date
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: this.series
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
    }
  },
  mounted () {
    this.drowDom()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
