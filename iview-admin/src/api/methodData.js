import axios from '@/libs/api.request'
import config from '@/config/index'

/*获得用户列表*/ 
export const getUserData = () => {
    return axios.request({
      url: config.reqUrl + 'user/getList',
      method: 'get',
      headers: config.header
    })
  }
  