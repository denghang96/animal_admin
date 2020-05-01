<template>
  <div>
    <Row class="code-row-bg">
      <Col span="4" style="margin-left:5px">    
        <DatePicker type="date" format="yyyy-MM-dd" placeholder="助养日期" v-model="query.consumeDate" @on-change="getDate" style="width:250px"></DatePicker>
      </Col>
      <Col span="4" style="margin-left:5px">    
        <Select v-model="query.type" placeholder="项目类型" clearable>
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col span="4" style="margin-left:5px">
        <Button type="primary" @click="getConsumeTable">查询</Button>
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
      total: 0,
      current: 1,
      pageSize: 10,
      columns: [
        { title: '用户名', key: 'userName'},
        { title: '消费类型', key: 'type'},
        { title: '动物编号', key: 'animalNo' },
        { title: '动物名称', key: 'animalName' },
        { title: '消费日期', key: 'consumeDate'},
        { title: '消费金额', key: 'money' }
      ],
      tableData: [],
      query: {
        consumeDate: '',
        type: ''
      },
      header: config.header,
      typeList: [
        {
          value: '领养',
          label: '领养'
        },
        {
          value: '助养',
          label: '助养'
        },
        {
          value: '寄养',
          label: '寄养'
        },
      ],
    }
  },
  created() {
    this.getConsumeTable()
  },
  methods: {
    /**
     * 根据条件查询助养列表
     */
    getConsumeTable(){
      let _this = this
      axios.request({
        url: 'consume/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: this.pageSize,
          consumeDate: this.query.consumeDate,
          type: this.query.type,
          userId: JSON.parse(localStorage.getItem("user")).id
        }
      }).then(res => {
        if(res.data.status == 0){
          this.tableData = res.data.data.records
          _this.total = parseInt(res.data.data.total)
        }
      })
    },
    /**
     * 当前页改变时
     */
    changePage(current){
      this.current = current
      this.getConsumeTable()
    },
    getDate(value){
      this.query.consumeDate = value
    },
  }
}
</script>

<style>

</style>
