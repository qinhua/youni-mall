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
  detail: host + '/goods/view',
  appraise: host + '/goods/appraise',
  sellerGoods: host + '/user/goodsList'
}
const nearbyApi = {
  sellerList: host + '/seller/list',
  sellerDetail: host + '/seller/view'
}
const ticketApi = {
  tickets: host + '/home/list',
  list: host + '/waterTicket/list',
}
const orderApi = {
  list: host + '/order/list',
  add: host + '/order/add',
  score: host + '/order/score',
  del: host + '/order/del',
  push: host + '/order/push',
  cancel: host + '/order/cancel',
  updateOrder: host + '/home/updateOrder'
}
const userApi = {
  userInfo: host + '/user/userInfo',
  bind: host + '/user/bindPhone',
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
  del: host + '/cart/del',
  clear: host + '/cart/clear'
}
const commonApi = {
  wxAuth: host + '/weixin/auth',
  wxPay: host + '/weixin/payTest',
  dict: host + '/common/dictList',
  addUser: host + '/user/add',
  sendSms: host + '/common/sendSms'
}
// console.log('当前域名：%c' + host, 'color:red;font-size:14px;font-weight:bold')
export {commonApi,cartApi,homeApi, nearbyApi, ticketApi, orderApi, userApi, goodsApi}
