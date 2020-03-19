<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4" style="margin-left:5px">    
        <DatePicker type="date" format="yyyy-MM-dd" placeholder="助养日期" v-model="query.helpDate" @on-change="getDate" style="width:250px"></DatePicker>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getSupportTable">查询</Button>
      </Col>
    </Row>
    
    <Table border :columns="columns" :data="tableData" :height="540" style="margin-top:10px"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :page-size="pageSize" :total="total" :current="current" @on-change="changePage" ></Page>
        </div>
    </div>
    
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
      total: 100,
      current: 1,
      pageSize: 6,
      columns: [
        { title: '动物编号', key: 'animalNo'},
        { title: '动物昵称', key: 'animalName'},
        { title: '助养者名称', key: 'userName'},
        { title: '助养日期', key: 'helpDate' },
        { title: '助养金额', key: 'helpMoney' }
      ],
      tableData: [],
      query: {
        helpDate: ''
      },
      header: config.header
    }
  },
  created() {
    this.getSupportTable()
  },
  methods: {
    /**
     * 根据条件查询助养列表
     */
    getSupportTable(){
      let _this = this
      axios.request({
        url: 'support/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: _this.current,
          size: 10,
          helpDate: _this.query.helpDate
        }
      }).then(res => {
        if(res.data.status == 0){
          for(var i = 0; i < res.data.data.records.length; i++){
            res.data.data.records[i].animalMoney = res.data.data.records[i].animalMoney/100
          }
          _this.tableData = res.data.data.records
          _this.total = parseInt(res.data.data.total)
        }
      })
    },
    /**
     * 当前页改变时
     */
    changePage(current){
      this.current = current
      this.getSupportTable()
    },
    getDate(value){
      this.query.helpDate = value
    },
  }
}
</script>

<style>

</style>
