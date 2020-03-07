import axios from '@/libs/api.request'
import config from '@/config/index'

export const getTableData = () => {
    return axios.request({
      url: config.reqUrl + 'user/getList',
      method: 'get',
      headers: config.headers,
      param: {
          userName: 'wyl'
      }
    })
  }