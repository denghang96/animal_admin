<template>
  <div>
    <Row type="flex" justify="start" class="code-row-bg" style="margin-bottom:22px;">
        <Col span="4">
          <Input v-model="animalNoSearch" placeholder="动物编号" style="width: 300px" />
        </Col>
        <Col span="4" offset="2">
          <Input v-model="animalNameSearch" placeholder="动物名称" style="width: 300px" />
        </Col>
        <Col span="4" offset="2">
          <Button type="primary" @click="getCommentTable">查询</Button>
        </Col>
    </Row>
    <Table border :columns="columns" :data="tableData" :height="540">
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
import config from '@/config/index'
import axios from '@/libs/api.request'
export default {
  data () {
    return {
      columns: [
        { title: '宠物图片', slot: 'animalTiltleImg', editable: true ,render: (h, params) => {
          return h('div', [
            h('img', {
              domProps: {
                'src': params.row.animalTiltleImg
              },
              style: {
                display: 'block',
                width: '30px',
                height: '30px',
                borderRadius: '3px'
              },
            })
          ])
        }},
        { title: '宠物昵称', key: 'animalName', editable: true },
        { title: '宠物编号', key: 'animalNo', editable: true },
        { title: '宠物类型', key: 'animalType', editable: true },
        { title: '用户名称', key: 'userName', sortable: true },
        { title: '联系电话', key: 'userTel', editable: true },
        { title: '评论类容', key: 'comment', sortable: true },
        { title: '操作',slot: 'action' }
      ],
      userNameSearch: '',
      animalNoSearch: '',
      animalNameSearch: '',
      tableData: [],
      userData: '',
      total: 0,
      current: 1,
      pageSize: 10
    }
  },
  created() {
      this.getCommentTable()
  },
  methods: {
    handleDelete (params) {
      alert(this.$java_url)
    },
    //查询评论
    getCommentTable(){
      axios.request({
        url: 'comment/getList',
        method: 'get',
        headers: config.header,
        params: {
          current: this.current,
          size: this.pageSize,
          userId: JSON.parse(localStorage.getItem("user")).id,
          animalNo: this.animalNoSearch,
          animalName: this.animalNameSearch
        }
      }).then(res => {
        if(res.data.status == 0){
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        }
      })
    },
    changePage(current){
      this.current = current
      this.getUserTable()
    },
    remove (index) {
      if(!confirm("确认删除？")) return;
      axios.request({
        url: 'comment/del',
        method: 'post',
        cache:false,
        headers: config.header,
        data: 
          [this.tableData[index].id]
      }).then(res => {
        if(res.status == 200){
          this.$Notice.success({
            title: '成功',
            desc: false ? '' : '删除成功！'
          });
          this.getCommentTable()
        }
      })
    }
}}
</script>

<style>

</style>
