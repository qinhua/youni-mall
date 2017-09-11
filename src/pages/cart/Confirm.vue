<template>
  <div class="confirm-order" v-cloak>
    <div class="pick-address" data-from="confirm_order">
      <div class="wrap" v-if="address" @click="toAddress(1)">
        <i class="fa fa-map-marker i-map"></i>
        <div class="txt-con">
          <h3>收货人：{{address.name}}<span>{{address.phone}}</span></h3>
          <p>地址：{{address.address}}</p>
        </div>
        <i class="fa fa-angle-right i-right"></i>
      </div>
      <div class="add-address" data-from="confirm_order" v-else @click="toAddress(2)"><i
        class="fa fa-plus"></i>&nbsp;添加收货地址
      </div>
    </div>
    <div class="goods-info">
      <section class="v-items">
        <h4 class="item-top" v-if="curCartData.goods"><i
          class="ico-store"></i>&nbsp;{{curCartData.sellerName}}&nbsp;&nbsp;<i
          class="fa fa-angle-right cc"></i><!--<span>{{isEdit ? '完成' : '编辑'}}</span>-->
        </h4>
        <ul class="has-list">
          <li v-for="(item,index) in curCartData.goods">
            <section class="item-middle">
              <div class="img-con">
                <img :src="item.goodsImage">
              </div>
              <div class="info-con">
                <h3>{{item.goodsName}}</h3>
                <section class="middle">
                  <span class="unit-price">￥{{item.price}}</span>
                  <span class="order-info">{{item.info}}</span>
                </section>
                <!--<label>{{item.label}}</label>-->
              </div>
              <div class="price-con">
                <p class="price">￥{{item.price * item.goodsNum}}</p>
                <p class="buy-count">x{{item.goodsNum}}</p>
              </div>
            </section>
          </li>
        </ul>
      </section>
    </div>
    <div class="others-col">
      <group>
        <datetime title="配送时间" format="YYYY-MM-DD HH:mm" minute-row v-model="params.dispatchTime"
                  @on-change="changeTime"></datetime>
        <popup-picker title="优惠券" :data="coupons" :columns="1" v-model="tmpCoupon" ref="picker1" @on-show=""
                      @on-hide="" @on-change="changeCoupon"></popup-picker>
        <!--<x-input title="商品名称：" placeholder="商品名称" required text-align="right" v-model="params.name"></x-input>-->
        <x-textarea title="留言：" :max="20" placeholder="一些想对卖家说的话…" @on-blur="" v-model="params.userMessage"
                    show-clear></x-textarea>
      </group>
    </div>
    <div class="count-bar">
      <div class="wrap">
        <div class="txt-total">
          <h4>合计：<span>￥{{(curCartData.totalPrice || 0) | toFixed}}</span><!--<i></i>--></h4>
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
  import {commonApi, orderApi, userApi} from '../../service/main.js'

  export default {
    name: 'confirm-order',
    data() {
      return {
        address: null,
        goods: null,
        params: {
          goods: [],
          addressId: null,
          dispatchTime: '',
          userMessage: '',
          couponId: ''
        },
        curCartData: {},
        isPosting: false,
        onFetching: false,
        tmpCoupon: ['未选择'],
        coupons: [{
          key: '',
          value: '未选择',
          name: '未选择'
        }, {
          key: '028283447c4311e7aa18d8cb8a971933',
          value: '满减20元',
          name: '满减20元'
        }, {
          key: '038283447c4311e7aa18d8cb8a971936',
          value: '水票10元',
          name: '水票10元'
        }, {
          key: '018283447c4311e7aa18d8cb8a941930',
          value: '首单7折',
          name: '首单7折'
        }]
      }
    },
    components: {Tab, TabItem, XButton, Group, XInput, Selector, PopupPicker, XTextarea, Datetime},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      this.$nextTick(function () {
        vm.getAddress()
        vm.getGoods()
      })
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
        if(to.name==='confirm_order') {
          vm.getAddress()
          vm.getGoods()
        }
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toAddress(type) {
        me.sessions.set('ynTmpConfirm',vm.$route.query.thedata)
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
        console.log(val, vm.params.couponId)
      },
      changeTime(val) {
        console.log('change', val)
      },
      getGoods() {
        try{
          vm.curCartData = vm.$route.query.thedata ? JSON.parse(window.decodeURIComponent(vm.$route.query.thedata)) : {}
          for (var i = 0; i < vm.curCartData.goods.length; i++) {
            vm.params.goods.push({goodsId: vm.curCartData.goods[i].goodsId})
          }
          console.log(vm.curCartData, '带过来的数据')
          vm.switchData(vm.coupons, vm.tmpCoupon, 'couponId')
        }catch(e){
            // console.log(e)
        }
      },
      getAddress() {
        vm.processing()
        vm.loadData(userApi.addressList, null, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.itemList
          if (resD.length>1) {
            for (let i = 0; i < resD.length; i++) {
              if (resD[i].defaultAddress) {
                vm.address = resD[i]
                vm.params.addressId = resD[i].id
              }else{
                vm.address = resD[0]
                vm.params.addressId = resD[0].id
              }
            }
          }else{
            vm.address = resD[0]
            vm.params.addressId = resD[0].id
          }
          console.log(vm.address, '地址数据')
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      getCart(isLoadMore) {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(cartApi.view, vm.params, 'POST', function (res) {
          vm.onFetching = false
          vm.processing(0, 1)
          var resD = res.data
          vm.goods = resD
          console.log(vm.goods, '购物车数据')
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
              vm.payOrder(res.data)
            } else {
              vm.toast('生成订单失败！')
            }
          }, function () {
            vm.toast('提交失败！')
            vm.isPosting = false
          })
        }
      },
      payOrder(data) {
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
          vm.$router.push({path: '/order'})
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert(JSON.stringify(res))
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .confirm-order {
    padding-bottom:100/@rem;
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
      margin-bottom: 10/@rem;
      .item-top {
        .rel;
        .borBox;
        padding: 14/@rem 60/@rem 14/@rem 20/@rem;
        .txt-normal;
        .c3;
        .fz(24);
        .ellipsis;
        .bf;
        .bor-t;
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
          .abs-center-vertical;
          right: 20/@rem;
          padding-left: 40/@rem;
          .fz(22);
          .cdiy(@c2);
        }
      }
      .has-list {
        .bf1;
        li {
          .rel;
          .bf;
          .bor-b;
        }
      }
      .item-middle {
        width: 100%;
        .borBox;
        padding: 14/@rem 20/@rem 14/@rem 20/@rem;
        .flex;
        .img-con {
          .rel;
          padding: 10/@rem 0;
          .size(140, 120);
          overflow: hidden;
          img {
            width: 100%;
            .abs-center-vh;
          }
        }
        .info-con {
          .flex-r(2);
          padding: 0 14/@rem;
          h3 {
            padding-bottom: 10/@rem;
            .txt-normal;
            .c3;
            .fz(26);
            .ellipsis-clamp-2;
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
          }
        }
        .price-con {
          .flex-r(1);
          .right;
          .price {
            padding-bottom: 10/@rem;
            .c3;
            .fz(24);
          }
          .buy-count {
            .c9;
            .fz(22);
          }
        }
      }
      &.grey {
        .c9!important;
      }
    }
  }

  .others-col {
    .vux-no-group-title {
      margin-top: 0;
    }
    .vux-x-input, .address-area, .vux-datetime, .vux-selector, .vux-cell-box, .vux-x-textarea {
      .fz(26);
    }
  }

  .count-bar {
    .fix;
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
</style>
