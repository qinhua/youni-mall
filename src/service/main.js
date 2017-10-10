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
}
const goodsApi = {
  list: host + '/home/goodsList',
  detail: host + '/goods/view',
  sellerGoods: host + '/user/goodsList',
  saleConfigList: host + '/goods/listSaleConfig'
}
const nearbyApi = {
  sellerList: host + '/seller/list',
  sellerDetail: host + '/seller/view'
}
const ticketApi = {
  list: host + '/home/ticketList',
  user: host + '/userTicket/list',
  add: host + '/userTicket/add',
  repay: host + '/userTicket/payTicket',
  calcPrice: host + '/userTicket/calcuPrice',
  exchange: host + '/order/ticketExchange'
}
const orderApi = {
  list: host + '/order/list',
  add: host + '/order/add',
  view: host + '/order/view',
  repay: host + '/order/payOrder',
  score: host + '/order/score',
  del: host + '/order/del',
  push: host + '/order/remind',
  cancel: host + '/order/cancel',
  calcPrice: host + '/order/calcuPrice',
  getCoupon: host + '/order/getCoupon',
  updateOrderStatus: host + '/order/userStopOrder'
}
const userApi = {
  get: host + '/user/get',
  bind: host + '/user/bindPhone',
  updateName: host + '/user/updateName',
  orderCount: host + '/order/userCount',
  couponList: host + '/userCoupon/list',
  platformCoupon: host + '/platformCoupon/list',
  userCoupon: host + '/userCoupon/add',
  addressList: host + '/user/addressList',
  setAddress: host + '/user/setAddress',
  setDefaultAddress: host + '/user/setDefaultAddress',
  delAddress: host + '/user/delAddress'
}
const depositApi = {
  list: host + '/userDeposit/list',
  add: host + '/userDeposit/add'
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
export {commonApi, cartApi, homeApi, nearbyApi, ticketApi, orderApi, userApi, depositApi, goodsApi}
