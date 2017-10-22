<template>
  <div class="order-detail">
    <div :class="'status-col s' + details.status">
      <div class="left-con">
        <span v-if="details.status===1">待支付…<br><i>请尽快支付</i></span>
        <span v-if="details.status===2">待派送…<br><i>等待商家派达中</i></span>
        <span v-if="details.status===3">派送中…<br><i>商品正在途中</i></span>
        <span v-if="details.status===4">暂停中…<br><i>奶类订单已暂停派送</i></span>
        <span v-if="details.status===5">已完成…<br><i>交易已完成</i></span>
      </div>
      <div class="right-con"></div>
    </div>

    <div class="address-col">
      <div class="wrap">
        <i class="fa fa-map-marker i-map"></i>
        <div class="txt-con">
          <h3>收货人：{{details.userName}}<span>{{details.phone}}</span></h3>
          <p>地址：{{details.userAddress}}</p>
        </div>
        <i class="fa fa-angle-right i-right"></i>
      </div>
    </div>

    <ul class="order-col">
      <li class="v-items" :data-id="details.id" :data-orderid="details.orderId"
          :data-orderNumber="details.appOrderNumber">
        <h4 class="item-top"><i class="ico-seller"
                                :style="details.sellerImage?'background-image:url('+details.sellerImage+')':''"></i>&nbsp;{{details.sellerName}}&nbsp;&nbsp;<i
          class="fa fa-angle-right cc"></i><span>{{details.statusName}}</span><span class="remind-txt"
                                                                                    v-if="details.status===2&&details.remind">已提醒卖家派送</span>
        </h4>
        <ul>
          <li v-for="itm in details.goodsList" v-cloak>
            <section class="item-middle">
              <div class="img-con"
                   :style="itm.goodsImage?('background-image:url('+itm.goodsImage+')'):''"></div>
              <div class="info-con">
                <h3><span
                  :class="itm.goodsType==='goods_type.2'?'milk':''">{{itm.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>{{itm.goodsName}}
                </h3>
                <section class="middle">
                  <span class="unit-price">￥{{itm.goodsPrice | toFixed}}元</span>
                  <span class="order-info" v-if="details.orderType===2">来自：水票兑换</span>
                  <div class="dispatch-info" v-if="itm.goodsType==='goods_type.2'">
                    <span>已送：{{itm.totalDispatcheNum}}件</span><span>待送：{{itm.waitDispatcheNum}}件</span>
                  </div>
                </section>
                <!--<label>{{itm.label}}</label>-->
              </div>
              <div class="price-con">
                <p class="price">总价：￥{{itm.goodsAmount | toFixed}}</p>
                <p class="buy-count">x{{itm.goodsNum}}</p>
              </div>
            </section>
          </li>
        </ul>
        <section class="item-bottom">
          <!--<div class="extra-info">
            <p v-for="(ext, idx) in details.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
            </p>
          </div>-->
          <div class="total-price">
            共{{details.totalGoodsNum}}件商品&nbsp;合计：<span>￥{{details.payAmount | toFixed}}</span>（含上楼费）
          </div>
          <div class="btns" v-if="details.status===1">
            <button class="btn btn-pay" @click="rePay(details.orderId)">支付</button>
            <button class="btn btn-del" @click="cancelOrder(details.orderId)">取消订单</button>
          </div>
          <div class="btns" v-if="details.status===2&&!details.remind">
            <button type="button" class="btn btn-push" @click="pushOrder(details.orderId)">催单</button>
          </div>
          <div class="btns" v-if="details.status===3">
            <button type="button" class="btn btn-pause" @click="setOrderStatus(details.orderId,4)">暂停派送</button>
          </div>
          <div class="btns" v-if="details.status===4">
            <button type="button" class="btn btn-recovery" @click="setOrderStatus(details.orderId,3)">恢复派送</button>
          </div>
          <div class="btns" v-if="details.status===5&&!details.userScore">
            <button type="button" class="btn btn-appraise" :data-id="details.orderId"
                    @click="AppraiseOrder(details.orderId)">评价
            </button>
          </div>
          <span class="timestamp">{{details.createTime}}</span>
        </section>
      </li>
    </ul>

    <div class="operate-col">
      <!--<group class="list-modal">
        <cell title="投诉商家" link="/complain">
          &lt;!&ndash;<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>&ndash;&gt;
        </cell>
      </group>-->
      <div class="btns">
        <a class="btn btn-dial" :href="'tel:'+details.sellerPhone"><i class="fa fa-phone"></i>&nbsp;联系卖家</a>
      </div>
    </div>

    <div class="extra-col">
      <p>订单编号：{{details.appOrderNumber}}</p>
      <p>创建时间：{{details.createTime}}</p>
      <!--<p>付款时间：{{details.createTime}}</p>
      <p>派送时间：{{details.createTime}}</p>
      <p>成交时间：{{details.createTime}}</p>-->
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let me
  let vm
  import {
    Group,
    Cell,
    Confirm,
    Rater,
    ConfirmPlugin,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {orderApi} from '../../service/main.js'

  export default {
    name: 'order-detail',
    data() {
      return {
        id: null,
        details: {},
        showPop: false,
        appraise: {
          curOrderId: null,
          curOrderScore: 0
        },
        onFecthing: false,
        isPosting: false
      }
    },
    components: {
      Group,
      Cell,
      Confirm,
      Rater
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDetail()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'order_detail') {
          vm.getDetail()
        }
      }
    },
    methods: {
      getDetail(cb) {
        vm.id = vm.$route.query.id
        if (vm.isPosting) return false
        vm.processing()
        vm.isPosting = true
        vm.loadData(orderApi.view, {orderId: vm.id}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            var resD = res.data
            resD.categoryName = (resD.type === 'goods_type.1') ? '水' : '奶'
            switch (resD.status) {
              case 1:
                resD.statusName = '待支付'
                break
              case 2:
                resD.statusName = '待派送'
                break
              case 3:
                resD.statusName = '派送中'
                break
              case 4:
                resD.statusName = '已暂停'
                break
              case 5:
                resD.statusName = '已完成'
                break
            }
            vm.details = resD
            // console.log(vm.details, '商品详情')
          }
          cb ? cb() : null
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      delOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          vm.isPosting = false
        })
      },
      cancelOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认取消？', '订单取消后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancel, {orderId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已取消')
            vm.jump('home')
          }, function () {
            vm.toast(res.data || '取消失败')
            vm.isPosting = false
          })
        }, function () {
          vm.isPosting = false
        })
      },
      AppraiseOrder(id) {
        vm.appraise.curOrderId = id
        vm.showPop = true
      },
      setOrderStatus(id, status) {
        if (vm.isPosting) return false
        vm.isPosting = true
        if (status === 4) {
          vm.confirm('请填写暂停天数', '<div class="customModal"><input id="stopDay" type="number" placeholder="输入天数(整数)" required></div>', function () {
            var curVal = window.document.getElementById('stopDay').value
            if (!curVal) {
              vm.toast('请填写天数', 'warn')
              return false
            }
            if (parseInt(curVal) != curVal) {
              vm.toast('请填写整数', 'warn')
              return false
            }
            vm.isPosting = true
            vm.loadData(orderApi.updateOrderStatus, {
              userType: 1,
              id: id,
              status: status,
              stopDay: curVal
            }, 'POST', function (res) {
              vm.isPosting = false
              if (res.success) {
                vm.toast('已暂停')
                vm.$vux.confirm.hide()
                vm.getDetail()
              } else {
                vm.toast(res.message || '操作失败！')
              }
            }, function () {
              vm.isPosting = false
            })
          }, function () {
            vm.isPosting = false
          }, null, null, true)
        } else {
          vm.confirm('确认恢复派送？', null, function () {
            vm.isPosting = true
            vm.loadData(orderApi.updateOrderStatus, {userType: 1, id: id, status: status}, 'POST', function (res) {
              vm.isPosting = false
              if (res.success) {
                vm.toast('已恢复派送')
                vm.getDetail()
              } else {
                vm.toast(res.message || '操作失败！')
              }
            }, function () {
              vm.isPosting = false
            })
          })
        }
      },
      onCancel() {
        vm.isPosting = false
      },
      onConfirm(msg) {
        var curVal = window.document.querySelector('.vux-rater input').value
        if (curVal == 0) {
          vm.toast('请先评分！', 'warn')
          return false
        } else {
          if (vm.isPosting) return false
          vm.isPosting = true
          vm.loadData(orderApi.score, {
            orderId: vm.appraise.curOrderId,
            score: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('评价成功')
            vm.showPop = false
            vm.getDetail()
          }, function () {
            vm.isPosting = false
          })
        }
      },
      rePay(id) {
        if (!me.isWeixin) {
          vm.toast('请在微信中操作！')
          return
        }
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.repay, {orderId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            // alert(JSON.stringify(res.data))
            vm.pay(res.data)
          } else {
            if (res.errorCode == 304) {
              vm.toast('请先绑定手机号！')
              setTimeout(function () {
                vm.jump('bind')
              }, 800)
            } else {
              vm.toast(res.message || '支付失败！')
            }
          }
        }, function () {
          vm.isPosting = false
        })
      },
      pay(data) {
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
              vm.getDetail()
            }
          })
        })
        wx.error(function (res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert(JSON.stringify(res))
          vm.getDetail()
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .order-detail {
    padding-bottom: 100/@rem;
    .status-col {
      height: 200/@rem;
      .cf;
      background: linear-gradient(left, #ffc369, #ff5800);
      background: -webkit-linear-gradient(left, #ffc369, #ff5800);
      &.s1 {
        background: url(../../../static/img/s1.png) no-repeat 88% center, linear-gradient(left, #ffc369, #ff5800);
        background: url(../../../static/img/s1.png) no-repeat 88% center, -webkit-linear-gradient(left, #ffc369, #ff5800);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s2 {
        background: url(../../../static/img/s2.png) no-repeat 88% center, linear-gradient(left, #ffc369, #ff5800);
        background: url(../../../static/img/s2.png) no-repeat 88% center, -webkit-linear-gradient(left, #ffc369, #ff5800);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s3 {
        background: url(../../../static/img/s3.png) no-repeat 88% center, linear-gradient(left, #ffc369, #ff5800);
        background: url(../../../static/img/s3.png) no-repeat 88% center, -webkit-linear-gradient(left, #ffc369, #ff5800);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s4 {
        background: url(../../../static/img/s4.png) no-repeat right bottom, linear-gradient(left, #ffc369, #ff5800);
        background: url(../../../static/img/s4.png) no-repeat right bottom, -webkit-linear-gradient(left, #ffc369, #ff5800);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.s5 {
        background: url(../../../static/img/s6.png) no-repeat 88% center, linear-gradient(left, #ffc369, #ff5800);
        background: url(../../../static/img/s6.png) no-repeat 88% center, -webkit-linear-gradient(left, #ffc369, #ff5800);
        -webkit-background-size: auto 60%, auto 100%;
        background-size: auto 60%, auto 100%;
      }
      &.waitPay {
        background: #40ceca;
      }
      &.waitDispatch {
        background: #ffaa50;
      }
      &.dispatching {
        background: #ff7511;
      }
      &.paused {
        background: #8eaac3;
      }
      &.finished {
        background: #58c714;
      }
      .left-con {
        .fl;
        .rel;
        .borBox;
        width: 60%;
        height: 100%;
        padding: 24/@rem 0 24/@rem 24/@rem;
        span {
          .abs-center-vertical;
          left: 40/@rem;
          .fz(34);
          i {
            opacity: .8;
            font-style: normal;
            .fz(22);
          }
        }
      }
      .right-con {
        .fr;
        .rel;
        .borBox;
        width: 40%;
        height: 100%;
        padding: 24/@rem 24/@rem 24/@rem 0;
      }
    }

    .address-col {
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
          width: 100%;
          padding: 10/@rem 0;
          .fz(24);
          .c3;
          .left;
          .txt-normal;
          overflow: hidden;
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

    .order-col {
      .v-items {
        .borBox;
        margin-bottom: 14/@rem;
        .bf;
        .bor-t(1px, solid, #ddd);
        .item-top {
          padding: 14/@rem 20/@rem 14/@rem 14/@rem;
          .txt-normal;
          .c3;
          .fz(24);
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
            padding-left: 10/@rem;
            .fz(22);
            .cdiy(@c2);
            &.remind-txt {
              .cdiy(#78b933);
              padding-right: 14/@rem;
              .bor-r;
              /* -webkit-animation: flash 4.5s ease infinite;
               animation: flash 4.5s ease infinite;*/
            }
          }
        }
        .item-middle {
          .rel;
          padding: 14/@rem 20/@rem 14/@rem 14/@rem;
          min-height: 140/@rem;
          .bf8;
          .bor-b;
          .img-con {
            .abs;
            top: 14/@rem;
            .size(140, 140);
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
            }
            label {
              .fz(22);
              .progress {
                span {
                  padding-right: 20/@rem;
                }
              }
            }
          }
          .price-con {
            .abs;
            .borBox;
            padding: 14/@rem 20/@rem;
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
          }
          .dispatch-info {
            padding-top: 8/@rem;
            span {
              padding-right: 28/@rem;
            }
          }
          .score-info {
            padding-top: 8/@rem;
            span {
              padding-right: 28/@rem;
            }
          }
        }
        &.grey {
          .c9!important;
        }
      }
      .item-bottom {
        .rel;
        .extra-info {
          margin-top: 2px;
          padding: 10/@rem 20/@rem;
          .bf8;
          p {
            .fz(22);
            .c3;
            span {
              .fr;
            }
            &:not(:last-child) {
              padding-bottom: 10/@rem;
            }
          }
        }
        .total-price {
          padding: 14/@rem 20/@rem;
          .right;
          .c3;
          .fz(22);
          span {
            .fz(30);
          }
        }
        .btns {
          padding: 20/@rem 20/@rem;
          overflow: hidden;
          .bor-t;
          button {
            .fr;
            padding: 4px 40/@rem;
            margin-left: 20/@rem;
            .c3;
            .fz(22);
            .bf;
            .borR(50px);
            &:disabled {
              .c9!important;
              .bor(1px, solid, #999) !important;
            }
            &.btn-cancel, &.btn-del {
              .c6;
              .bor(1px, solid, #ccc);
            }
            &.btn-push, &.btn-appraise, &.btn-pay, &.btn-pause, &.btn-recovery {
              .cdiy(@c2);
              .bor(1px, solid, @c2);
            }
          }
          .status-txt {
            .cdiy(@c3);
            &.disabled {
              .c9;
            }
          }
        }
        .score-info {
          margin-top: -20/@rem;
          .fl;
          overflow: hidden;
          padding: 20/@rem 20/@rem;
          .has-score {
            overflow: hidden;
            .fz(24);
            span {
              .fl;
            }
          }
          .star {
            .fl;
            margin-top: -6/@rem;
            overflow: hidden;
            li {
              .fl;
              margin-right: 10/@rem;
              .cdiy(#ff9900);
              .rfz(16);
              &.gray {
                .c9;
              }
            }
          }
          .noScore {
            padding: 0 22/@rem 20/@rem;
            .left;
            .cdiy(#9fb52b);
            .fz(24);
          }
        }
        .timestamp {
          display: block;
          padding: 0 22/@rem 20/@rem;
          .right;
          .c9;
          .fz(22);
        }
      }
    }

    .operate-col {
      .borBox;
      margin-bottom: 14/@rem;
      .bf;
      .weui-cell {
        padding: 24/@rem !important;
        .fz(26) !important;
      }
      .btns {
        padding: 12/@rem 20/@rem;
      }
      .btn-dial {
        .block;
        width: 100%;
        padding: 20/@rem 0;
        margin: 10/@rem auto;
        .cdiy(#47bd85);
        .fz(24);
        .borR(4px);
        .bor(1px, solid, #47bd85);
      }
    }

    .extra-col {
      .borBox;
      margin-bottom: 14/@rem;
      padding: 20/@rem;
      line-height: 1.6;
      .fz(22);
      .c7;
      .bf;
    }

  }

</style>
