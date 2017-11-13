<template>
  <div class="confirm-order" v-cloak>

    <div class="scroll-view">
      <div class="pick-address" data-from="confirm_order">
        <div class="wrap" v-if="address" @click="toAddress(1)" v-cloak>
          <i class="fa fa-map-marker i-map"></i>
          <div class="txt-con">
            <h3>收货人：{{address.name}}<span>{{address.phone}}</span></h3>
            <p>地址：{{address.address}}</p>
            <p>门牌号：{{address.houseCode}}</p>
          </div>
          <i class="fa fa-angle-right i-right"></i>
        </div>
        <div class="add-address" data-from="confirm_order" v-else @click="toAddress(2)"><i class="fa fa-plus"></i>&nbsp;添加收货地址
        </div>
      </div>
      <div class="goods-info" v-if="curCartData.goodsList&&curCartData.goodsList.length" v-cloak>
        <section class="v-items">
          <h4 class="item-top"><i class="ico-seller"
                                  :style="curCartData.sellerImage?'background-image:url('+curCartData.sellerImage+')':''"></i>&nbsp;{{curCartData.sellerName}}&nbsp;&nbsp;<i
            class="fa fa-angle-right cc"></i><span
            class="tag-bonus" v-if="firstData.newUserCoupon">首单优惠</span></h4>
          <ul class="has-list">
            <li v-for="(item,index) in curCartData.goodsList">
              <section class="item-middle">
                <div class="img-con" :style="item.goodsImage?('background-image:url('+item.goodsImage+')'):''"></div>
                <div class="info-con">
                  <h3><span
                    :class="item.goodsType==='goods_type.2'?'milk':''">{{item.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>{{item.goodsName}}
                  </h3>
                  <section class="middle" v-if="item.goodsType==='goods_type.1'">
                    <span class="unit-price">￥{{item.price | toFixed}}元</span>
                    <span class="order-info">{{item.info}}</span>
                    <!--<label>{{item.label}}</label>-->
                  </section>
                  <section class="middle milk" v-else>
                    <span class="unit-price"
                          @click="showModal('price',item)">订购数量：<i>{{item.note.priceLabel}}</i></span>
                    <span class="order-info">派送量：{{item.dispatchNum}}瓶/天</span>
                    <label>口味：<i>{{item.note.goodsNote}}</i></label>
                  </section>
                </div>
                <div class="price-con">
                  <p class="price">总价：￥{{item.payPrice}}元</p>
                  <p class="buy-count" v-show="item.goodsType!=='goods_type.2'">x{{item.goodsNum}}</p>
                </div>
              </section>
            </li>
          </ul>
        </section>
      </div>
      <div class="others-col">
        <group>
          <popup-picker title="优惠券" :data="coupons" :columns="1" v-model="tmpCoupon" ref="picker1" @on-show=""
                        @on-hide="" @on-change="changeCoupon"
                        v-if="!firstData.newUserCoupon&&coupons.length>1"></popup-picker>
          <div class="bonus-tips" v-if="firstData.newUserCoupon">
            <p>
              <span class="tit"><i class="fa fa-thumbs-o-up"></i>&nbsp;首单专享{{firstData.newUserDiscountRate}}折&nbsp;<i>(已优惠{{new Number().sub(firstData.totalAmount, firstData.payAmount)}}元)</i></span>
              <span class="price">￥{{firstData.payAmount | toFixed}}</span>
            </p>
          </div>
          <popup-picker title="配送方式" :data="dispatches" :columns="1" v-model="tmpDispatch" ref="picker1" @on-show=""
                        @on-hide="" @on-change="changeDispatch" v-if="hasMilk"></popup-picker>
          <datetime title="配送时间" format="YYYY-MM-DD HH:mm" minute-row v-model="params.dispatchTime"
                    @on-change="changeTime"></datetime>
          <!--<x-input title="商品名称：" placeholder="商品名称" required text-align="right" v-model="params.name"></x-input>-->
          <x-textarea title="留言：" :max="20" placeholder="一些想对卖家说的话…" @on-blur="" v-model="params.userMessage"
                      show-clear></x-textarea>
        </group>
      </div>
    </div>

    <div class="count-bar">
      <div class="wrap">
        <div class="txt-total">
          <h4>合计：<span>￥{{(firstData.payAmount || (curCartData.totalPrice || 0)) | toFixed}}元</span><!--<i></i>--></h4>
        </div>
        <div class="btn btn-toPay" @click="generateOrder">提交订单</div>
      </div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, XButton, Group, XInput, Selector, PopupPicker, XTextarea, Datetime} from 'vux'
  import {commonApi, orderApi, cartApi, userApi} from '../../service/main.js'

  export default {
    name: 'confirm-order',
    data() {
      return {
        address: null,
        firstData: {},
        goodsIds: [],
        hasWater: false,
        hasMilk: false,
        params: {
          goods: [],
          addressId: null,
          dispatchTime: null,
          note: {},
          userMessage: '',
          couponId: ''
        },
        curCartData: {},
        isPosting: false,
        onFetching: false,
        tmpCoupon: ['未选择'],
        tmpDispatch: ['商家配送'],
        types: {
          'goods_type.1': '买5送1',
          'goods_type.2': '买10送2',
          'goods_type.3': '买100送35',
          'goods_type.4': '买100送40'
        },
        dispatches: [{
          key: '1',
          value: '商家配送',
          name: '商家配送'
        }, {
          key: '2',
          value: '用户自提',
          name: '用户自提'
        }],
        coupons: [{
          key: '',
          value: '未选择',
          name: '未选择'
        }]
      }
    },
    components: {Tab, TabItem, XButton, Group, XInput, Selector, PopupPicker, XTextarea, Datetime},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getAddress()
      vm.getCart()
      vm.params.dispatchTime = me.formatDate(new Date(), false, 2)
    },
//    computed: {
//      theTotalPrice () {
//        let tmp=0
//        if(this.curCartData.goods){
//          for (let i = 0; i < vm.curCartData.goods.length; i++) {
//            tmp += (vm.curCartData.goods[i].price*vm.curCartData.goods[i].goodsNum)
//          }
//        }
//        return tmp
//      }
//    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'confirm_order') {
          vm.getAddress()
          vm.getCart()
        } else {
          vm.params.goods = []
        }
      }
    },
    methods: {
      toAddress(type) {
        me.sessions.set('ynTmpConfirm', vm.$route.query.goodsId)
        type === 1 ? vm.jump('myaddress', {from: 'confirm_order'}) : vm.jump('edit_address', {from: 'confirm_order'})
      },
      validate() {
        if (!vm.params.addressId) {
          vm.toast('请添加收货地址！', 'warn')
          return false
        }
        if (!vm.params.dispatchTime) {
          vm.toast('请选择配送时间！', 'warn')
          return false
        }
        /*if (!vm.params.couponId) {
         vm.toast('请选择优惠券！', 'warn')
         return false
         } */
        if (!me.isWeixin) {
          vm.toast('请在微信中操作！')
          return
        }
        return true
      },
      switchData(data, value, target, isUpdate) {
        let tmp
        if (isUpdate) {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value === data[i].key) {
              tmp.push(data[i].name)
            }
          }
          vm[target] = tmp
        } else {
          let tt = value.join('')
          for (let i = 0; i < data.length; i++) {
            if (tt === data[i].name) {
              tmp = data[i].key
            }
          }
          vm.params[target] = tmp
        }
      },
      changeCoupon(val) {
        vm.switchData(vm.coupons, vm.tmpCoupon, 'couponId')
        // console.log(val, vm.params.couponId)
        vm.calcPrice(vm.params.couponId)
      },
      changeDispatch(val) {
        // console.log(val)
        vm.params.note.dispatchLabel = val.join('')
      },
      changeTime(val) {
        // console.log('change', val)
      },
      changeDispatchNum(id) {
        // console.log('change', id)
        var curVal = document.getElementById('dispatch-' + id).value
        for (var i = 0; i < vm.params.goods.length; i++) {
          var cur = vm.params.goods[i]
          if (id === cur.goodsId) {
            cur.dispatchDayNum = curVal
          }
        }
      },
      getCart(isLoadMore, cb) {
        vm.goodsId = vm.$route.query.goodsId || null
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        var params = vm.goodsId ? {goodsId: vm.$route.query.goodsId} : {}
        vm.loadData(cartApi.view, params, 'POST', function (res) {
          vm.onFetching = false
          vm.processing(0, 1)
          var resD = res.data
          if (!vm.params.goods.length) {
            for (var i = 0; i < resD.goodsList.length; i++) {
              var cur = resD.goodsList[i]
              cur.note = cur.note ? JSON.parse(cur.note) : null
              vm.params.goods.push({goodsId: cur.goodsId})
              if (!vm.hasMilk && cur.goodsType === 'goods_type.2') {
                vm.hasMilk = true
                vm.params.note.dispatchLabel = vm.dispatches[0].name
              }
              if (cur.goodsType === 'goods_type.1') {
                vm.hasWater = true
              }
            }
            if (vm.hasWater && me.locals.get('isFirstConfirm')) {
              vm.alert('温馨提示', '桶装水需要支付空桶押金，您可在对应商品详情缴付押金。(非电梯房在收货时需要支付一定的上楼费)', null, function () {
                me.locals.remove('isFirstConfirm')
              })
            }
          }

          vm.curCartData = resD
          // vm.countTotal()
          // console.log(vm.curCartData, '购物车数据')
          vm.switchData(vm.coupons, vm.tmpCoupon, 'couponId')
          vm.calcPrice()
          vm.getCoupon()
          cb ? cb(resD) : null
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      getAddress() {
        vm.processing()
        vm.loadData(userApi.addressList, null, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.itemList
          if (resD.length > 1) {
            for (let i = 0; i < resD.length; i++) {
              if (resD[i].defaultAddress) {
                vm.address = resD[i]
                vm.params.addressId = resD[i].id
              } else {
                vm.address = resD[0]
                vm.params.addressId = resD[0].id
              }
            }
          } else {
            vm.address = resD[0]
            vm.params.addressId = resD[0].id
          }
          // console.log(vm.address, '地址数据')
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      getCoupon() {
        vm.loadData(orderApi.getCoupon, {goods: vm.params.goods}, 'POST', function (res) {
          if (res.success && res.data.itemList.length) {
            var resD = res.data.itemList
            for (var i = 0; i < resD.length; i++) {
              var cur = resD[i]
              vm.coupons.push({key: cur.couponId, value: vm.types[cur.goodsType], name: vm.types[cur.goodsType]})
            }
            // console.log(JSON.stringify(vm.coupons), '可用的优惠券数据')
          }
          cb ? cb(resD) : null
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      calcPrice(couponId) {
        var data
        couponId ? data = {couponId: couponId, goods: vm.params.goods} : data = {goods: vm.params.goods}
        vm.loadData(orderApi.calcPrice, data, 'POST', function (res) {
          if (res.success && res.data.newUserCoupon) {
            var resD = res.data
            vm.firstData = resD
          }
          /*else {
           vm.firstData = {
           newUserCoupon: true,
           payAmount: 8,
           totalAmount: 20
           }
           }*/
          // console.log(vm.firstData, '首单优惠数据')
          cb ? cb(resD) : null
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      generateOrder() {
        if (vm.isPosting) return false
        if (vm.validate()) {
          vm.isPosting = true
          vm.loadData(orderApi.add, vm.params, 'POST', function (res) {
            vm.isPosting = false
            if (res.success && res.data) {
              // alert(JSON.stringify(res.data))
              vm.payOrder(res.data)
            } else {
              if (res.errorCode == 304) {
                vm.toast('请先绑定手机号！')
                setTimeout(function () {
                  vm.jump('bind')
                }, 800)
              } else {
                vm.toast(res.message || '生成订单失败！')
                setTimeout(function () {
                  vm.$router.push({path: '/home'})
                }, 500)
              }
            }
          }, function () {
            vm.toast('提交失败！')
            vm.isPosting = false
          })
        }
      },
      payOrder(data) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.paySign,// 必填，签名，见附录1
          jsApiList: [
            'chooseWXPay'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          wx.chooseWXPay({
            appId: data.appId,
            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              vm.$router.push({path: '/order'})
            }
          })
        })
        wx.error(function (res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert(JSON.stringify(res))
          vm.$router.push({path: '/order'})
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .confirm-order {
    .rel;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
      overflow: auto;
    }

    .pick-address {
      .rel;
      margin-bottom: 10/@rem;
      .bf;
      .bor-b;
      .wrap {
        padding: 20/@rem 0;
      }
      .i-map {
        .abs-center-vertical;
        left: 0;
        padding: 0 20/@rem;
        .fz(36);
        .cdiy(@c2);
      }
      .i-right {
        .abs-center-vertical;
        right: 0;
        padding: 0 20/@rem;
        .fz(40);
      }
      .txt-con {
        .borBox;
        padding: 0 55/@rem 0 70/@rem;
        h3 {
          .fz(24);
          .c3;
          .txt-normal;
          span {
            .fr;
          }
        }
        p {
          .fz(22);
          .c6;
          line-height: 1.8;
        }
      }
      .add-address {
        width: 100%;
        padding: 24/@rem;
        .center;
        .cf;
        .fz(28);
        .bdiy(@c2);
      }
    }

    .goods-info {
      .v-items {
        .borBox;
        margin-bottom: 20/@rem;
        .bsd(0, 2px, 10px, 0, #ccc);
        .item-top {
          .rel;
          .borBox;
          padding: 14/@rem 20/@rem 14/@rem 20/@rem;
          .txt-normal;
          .c3;
          .fz(24);
          .ellipsis;
          .bor-b;
          .ico-store {
            .fl;
            display: inline-block;
            margin-top: 2/@rem;
            font-size: inherit;
            .size(30, 30);
            background: url(../../../static/img/ico_store.png);
            .ele-base;
          }
          span {
            .fr;
            padding-left: 40/@rem;
            .fz(22);
            .cdiy(@c2);
          }
        }
        .has-list {
          .bf1;
          li {
            .borBox;
            padding: 14/@rem;
            .rel;
            .bf;
            .bor-b;
          }
        }
        .vux-checker-box {
          .abs-center-vertical;
          left: 10/@rem;
          .vux-checker-item {
            .size(28, 28);
            line-height: 28/@rem;
          }
        }
        .checker-con {
          .abs;
          bottom: 14/@rem;
          right: 20/@rem;
          .center;
          label, input {
            .iblock;
            height: 50/@rem;
            line-height: 50/@rem;
            .center;
            .c3;
          }
          label {
            width: 50/@rem;
            .fz(22);
          }
          input {
            .bor;
            margin: 0 3px;
            width: 70/@rem;
          }
        }
        .item-middle {
          .rel;
          width: 100%;
          .borBox;
          /*padding: 14/@rem 20/@rem 14/@rem 14/@rem;*/
          min-height: 140/@rem;
          .img-con {
            .abs;
            top: 0;
            padding: 10/@rem 0;
            .size(140, 120);
            overflow: hidden;
            background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .info-con {
            .borBox;
            width: 100%;
            padding: 0 0 0 160/@rem;
            h3 {
              .borBox;
              padding: 0 160/@rem 10/@rem 0;
              .txt-normal;
              .c3;
              .fz(26);
              .ellipsis-clamp-2;
              span {
                margin-right: 4px;
                padding: 0 2px;
                font-weight: normal;
                .cf;
                .fz(22);
                background: #2acaad;
                .borR(2px);
                &.milk {
                  background: #74c361;
                }
              }
            }
            .middle {
              .c9;
              .fz(22);
              .ellipsis-clamp-2;
              .unit-price {
                padding-right: 40/@rem;
                .c3;
                .fz(24);
              }
              &.milk {
                .unit-price {
                  padding-right: 0;
                  i {
                    .rel;
                    font-style: normal;
                    color: #f17114;
                    &.active {
                      padding: 0 40/@rem 0 2px;
                      border: 1px solid #e47b25;
                      &:before {
                        content: "";
                        position: absolute;
                        width: 12/@rem;
                        height: 12/@rem;
                        border: 1px solid #f17114;
                        border-width: 1px 0 0 1px;
                        -webkit-transform: rotate(-135deg);
                        transform: rotate(-135deg);
                        top: 5/@rem;
                        right: 10/@rem;
                      }
                    }
                  }
                }
                .order-info {
                  .fr;
                }
                label {
                  padding-top: 10/@rem;
                  display: block;
                  .fz(24);
                  .c3;
                  i {
                    .rel;
                    font-style: normal;
                    color: #f17114;
                    &.active {
                      padding: 0 40/@rem 0 2px;
                      border: 1px solid #e47b25;
                      &:before {
                        content: "";
                        position: absolute;
                        width: 12/@rem;
                        height: 12/@rem;
                        border: 1px solid #f17114;
                        border-width: 1px 0 0 1px;
                        -webkit-transform: rotate(-135deg);
                        transform: rotate(-135deg);
                        top: 5/@rem;
                        right: 10/@rem;
                      }
                    }
                  }
                }
              }
            }
          }
          .price-con {
            .abs;
            .borBox;
            padding: 0 20/@rem 20/@rem 14/@rem;
            height: 160/@rem;
            top: 0;
            right: 0;
            .price {
              padding-bottom: 10/@rem;
              .c3;
              .fz(24);
            }
            .buy-count {
              .fr;
              .right;
              .c9;
              .fz(22);
            }
            .checker-con {
              width: 100%;
            }
            .type {
              .fz(22);
              padding: 1px;
              .cf;
              background: red;
            }
          }
        }
        &.grey {
          .c9!important;
        }
      }
    }

    .others-col {
      padding-bottom: 120/@rem;
      .bonus-tips {
        .borBox;
        padding: 30/@rem 24/@rem;
        .bf;
        p {
          .fz(26);
        }
        .tit {
          .cdiy(@c2);
          .fa-thumbs-o-up {
            .cdiy(@c2);
          }
          i {
            font-style: normal;
            .c9
          }
          span {
            .fz(24);
          }
        }
        .price {
          .fr;
          .fz(30);
        }
      }

      .vux-no-group-title {
        margin-top: 0;
      }

      .vux-x-input, .address-area, .vux-datetime, .vux-selector, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }

    }

    .count-bar {
      .abs;
      bottom: 0;
      z-index: 20;
      width: 100%;
      .ma-w(640);
      .c3;
      .bf;
      .bor-t;
      .wrap {
        .rel;
        height: 88/@rem;
      }
      .txt-total {
        .rel;
        .borBox;
        .fl;
        padding: 0 30/@rem;
        width: 70%;
        height: 100%;
        line-height: 88/@rem;
        h4 {
          .fz(24);
          .right;
          .txt-normal;
          span {
            .cdiy(@c2);
          }
          i {
            .txt-normal;
            .fz(16);
            .c9;
          }
        }
      }
      .btn {
        .fl;
        width: 30%;
        height: 100%;
        line-height: 88/@rem;
        .center;
        .cf;
        background: -webkit-linear-gradient(90deg, #dc0404, #ff7600);
        background: linear-gradient(90deg, #dc0404, #ff7600);
      }
    }

  }

</style>
