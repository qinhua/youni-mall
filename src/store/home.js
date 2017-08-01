import {config} from '../config.js'
var host = config.host
const homeApi = {
  banner: host + '/home/banner',
  products: host + ' /home/goodsList',
  ads: host + '/home/ads'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {homeApi}
