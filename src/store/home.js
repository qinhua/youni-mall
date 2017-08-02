/* eslint-disable no-unused-vars */
import config from '../config.js'
var host = config.host
// if (config.needMock) {
// import '../../mock/mock.js'
// }

import Mock from '../../mock/mock.js'
const homeApi = {
  banner: host + '/home/banner',
  topNotice: host + '/home/topNotice',
  goodsList: host + ' /home/goodsList'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {homeApi}
