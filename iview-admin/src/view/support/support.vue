<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4" style="margin-left:5px">    
        <Input v-model="query.animalNo" placeholder="动物编号"></Input>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <Input v-model="query.animalName" placeholder="动物名称"></Input>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <Input v-model="query.userName" placeholder="助养者名称"></Input>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <DatePicker type="date" format="yyyy-MM-dd" placeholder="助养日期" v-model="query.helpDate" @on-change="getDate" style="width:250px"></DatePicker>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getSupportTable">查询</Button>
      </Col>
    </Row>
    
    <Table border :columns="columns" :data="tableData" :height="540" style="margin-top:10px">
      <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
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
      total: 0,
      current: 1,
      pageSize: 10,
      columns: [
        { title: '动物编号', key: 'animalNo'},
        { title: '动物昵称', key: 'animalName'},
        { title: '助养者名称', key: 'userName'},
        { title: '助养日期', key: 'helpDate' },
        { title: '助养金额', key: 'helpMoney' },
        { title: '操作',slot: 'action'}
      ],
      tableData: [],
      query: {
        helpDate: '',
        animalName: '',
        animalNo: '',
        userName: ''
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
          size: this.pageSize,
          helpDate: _this.query.helpDate,
          animalNo: _this.query.animalNo,
          userName: _this.query.userName,
          animalName: _this.query.animalName,
        }
      }).then(res => {
        if(res.data.status == 0){
          for(var i = 0; i < res.data.data.records.length; i++){
            res.data.data.records[i].animalMoney = res.data.data.records[i].animalMoney/100
          }
          _this.tableData = res.data.data.records
           for(var i = 0; i <  _this.tableData.length; i++) {
             _this.tableData[i].helpMoney = _this.tableData[i].helpMoney/100
           }
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
    remove(index) {
      if(!confirm("确认删除？")) return;
      let _this = this
      axios.request({
        url: 'support/del',
        method: 'post',
        headers: config.header,
        data: [this.tableData[index].id]
      }).then(res => {
          this.$Notice.success({
            title: '成功',
            desc: false ? '' : '删除成功！'
          });
          _this.getSupportTable()
      })
    }
  }
}
</script>

<style>

</style>
