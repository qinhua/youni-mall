/* eslint-disable no-unused-vars */
import config from '../config.js'

var host = config.host
/*挂在一些必要的数据到window对象*/
window.youniMall = {
  host: host
}
// if (config.needMock) {
// import '../../mock/mock.js'
// }
//import '../../mock/mock.js'
const homeApi = {
  banner: host + '/home/banner',
  topNotice: host + '/home/topNotice',
  goodsList: host + '/home/goodsList'
}
const goodsApi = {
  detail: host + '/goods/detail',
  appraise: host + '/goods/appraise'
}
const nearbyApi = {
  shopsList: host + '/home/shopsList',
  sellerList: host + '/seller/list'
}
const ticketApi = {
  tickets: host + '/home/list',
  list: host + '/ticket/list'
}
const orderApi = {
  add: host + '/order/add',
  score: host + '/order/score',
  orders: host + '/home/order',
  updateOrder: host + '/home/updateOrder'
}
const userApi = {
  userInfo: host + '/user/userInfo',
  updateName: host + '/user/updateName',
  couponList: host + '/user/couponList',
  addressList: host + '/user/addressList',
  setAddress: host + '/user/setAddress',
  setDefaultAddress: host + '/user/setDefaultAddress',
  delAddress: host + '/user/delAddress',
}
const cartApi = {
  view: host + '/cart/view',
  add: host + '/cart/add',
  minus: host + '/cart/subtract',
  update: host + '/cart/udpateNum',
  del: host + '/cart/del'
}
const commonApi = {
  dict: host + '/common/dictList'
}
console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
console.log('当前API：%c' + JSON.stringify(homeApi, null, 2), 'color:orange;font-size:14px')
export {commonApi,cartApi,homeApi, nearbyApi, ticketApi, orderApi, userApi, goodsApi}
