<template>
  <div>
    <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4" style="text-align:right;"><Button type="success" @click="addUser">新建</Button></Col>
    </Row>
    <Card>
      <tables ref="tables" editable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete" :height="500"/>
      <Button style="margin: 10px 0;" type="primary" @click="userDelete">导出为Csv文件</Button>
    </Card>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="100" :current="1" @on-change="changePage"></Page>
        </div>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
import data from '@/config/index'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', editable: true },
        { title: 'Create-Time', key: 'createTime' },
        {
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      alert(this.$java_url)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    userDelete () {
      alert(data.reqUrl)
    },
    addUser () {
      console.log(data.header)
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
