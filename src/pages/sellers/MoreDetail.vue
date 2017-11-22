<template>
  <div class="seller-detail-more" v-cloak>

    <div class="scroll-view">
      <div class="seller-info">
        <div class="v-items" :data-id="seller.id">
          <div class="wrap">
            <div class="img-con" :style="seller.headimgurl?('background-image:url('+seller.headimgurl+')'):''"></div>
            <div class="infos">
              <h3>{{seller.name}}<span
                :class="['service_type',seller.serviceTypeCls]">{{seller.serviceTypeName}}</span>
                <span class="distance">{{(seller.distance ? seller.distance : 0) | toFixed(1, true)}}km</span>
              </h3>
              <div class="middle">
                <ol class="star" v-if="seller.sellerScore" v-cloak>
                  <li v-for="star in seller.sellerScore">★</li>
                </ol>
                <ol class="star" v-else>
                  <li class="gray" v-for="star in 5">★</li>
                </ol>
                <span
                  class="hasSell"><i>{{(seller.sellerScore || 0) | toFixed(1)}}分</i>已售{{seller.sellerCount}}单</span>
              </div>
              <div class="tags">
                <label class="c2">{{seller.authLevelName}}</label>
                <span class="dispatchTime" v-if="seller.label" v-cloak>平均{{seller.label.replace(/^0/, '')}}分钟送达</span>
              </div>
            </div>
            <!--<div class="bottom">
              <label class="note" v-if="seller.note">{{seller.note || '商家特惠'}}</label>
            </div>-->
          </div>
        </div>
        <!--<div class="contacts">
          <p>配送电话：<a :href="'tel:'+seller.phone">{{seller.phone}}</a>，楼梯房需收取上楼费</p>
        </div>-->
      </div>

      <!--<div class="operate-con" v-if="seller.serviceType!=='seller_service_type.2'">
        <h3><i class="fa fa-hand-o-right"></i>&nbsp;您可以在此处给店铺缴付押金({{seller.mortgage}}元)
          <button type="button" class="btn btn-deposite" @click="payDeposite(seller.id)">交押金</button>
          &lt;!&ndash;<span>已交押金{{seller.currentMortgage}}</span>&ndash;&gt;
        </h3>
      </div>-->
      <div class="bottom">
        <div class="detail-txt">
          <div class="title"><h3>基本信息<span>营业时间：{{seller.businessTime||'24小时'}}</span></h3></div>
          <div class="content basics">
            <p><i>公司名称：</i><span>{{seller.companyName}}</span></p>
            <p><i>公司地址：</i><span>{{seller.address}}</span></p>
            <p><i>联系电话：</i><span>{{seller.phone}}</span><a class="btn btn-dial" :href="'tel:'+seller.phone"><i class="fa fa-phone"></i>&nbsp;拨打</a></p>
          </div>
        </div>
      </div>

      <div class="bottom" v-if="seller.businessLicense" v-cloak>
        <div class="detail-txt">
          <div class="title"><h3>营业执照</h3></div>
          <div class="content license">
            <div>
              <img class="previewer-demo-img" v-lazy.container="seller.businessLicense" width="100"
                   @click="preview(0)">
            </div>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="detail-txt">
          <div class="title"><h3>店铺介绍</h3></div>
          <div class="content note">{{seller.note}}</div>
        </div>
      </div>
    </div>

    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" :options="options"></previewer>
    </div>

    <!--关于押金-->
    <div v-transfer-dom>
      <popup class="pop-txtcon" v-model="showPop" position="bottom" max-height="80%">
        <group class="pop-content">
          <h3>关于押金</h3>
          <ul class="txt-list">
            <li>1. 您购买押金类商品后，支付的押金将自动支付给商品所属的配送点，同时系统自动生成电子押金券发放到你的账户；</li>
            <li>2. 您需要退押金时可直接点击电子押金券上的‘退押金’按钮向收取押金的配送点申请退还押金，退桶和退还押金双方在线下完成交易；</li>
            <li>免责声明:电子押金券仅作为您与指定配送点线上交易的电子凭证，友你梦想（武汉）科技有限公司不会对交易过程产生的任何后果负责。</li>
          </ul>
        </group>
        <button type="button" class="btn btn-sure" @click="showDialog(seller.id)">知道了</button>
      </popup>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Group, Previewer, Popup, TransferDom} from 'vux'
  import {depositApi} from '../../service/main.js'

  export default {
    name: 'seller-detail-more',
    directives: {
      TransferDom
    },
    data() {
      return {
        seller: {},
        isPosting: false,
        noMore: false,
        showPop: false,
        list: [{src: ''}],
        options: {
          getThumbBoundsFn(index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    components: {Group, Previewer, Popup},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getSeller()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'seller_detail_more') {
          vm.getSeller()
        } else {
          try {
            vm.showPop = false
            this.$refs.previewer.close()
          } catch (e) {
            // console.log(e)
          }
        }
      }
    },
    methods: {
      preview(index) {
        this.$refs.previewer.show(index)
      },
      getSeller() {
        try {
          vm.seller = vm.$route.query.thedata ? JSON.parse(window.decodeURIComponent(vm.$route.query.thedata)) : {}
          vm.list[0].src = vm.seller.businessLicense
          // console.log(vm.seller, '带过来的数据')
        } catch (e) {
          // console.log(e)
        }
      },
      showDialog(id) {
        vm.showPop = false
        vm.confirm('请填写桶数？', '<div class="customModal"><input id="bucketAmount" type="number" placeholder="输入数量（桶）" required></div>', function () {
          if (!me.isWeixin) {
            vm.toast('请在微信中操作！')
            return
          }
          if (vm.isPosting) return false
          vm.isPosting = true
          var curVal = window.document.getElementById('bucketAmount').value
          if (!curVal) {
            vm.toast('请填写数量', 'warn')
            return false
          }
          vm.loadData(depositApi.add, {
            sellerId: id,
            bucketNum: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.$vux.confirm.hide()
              vm.pay(res.data, true)
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
            // vm.toast(res.message || '支付失败！')
          })
        }, function () {
          vm.isPosting = false
        }, '支付', null, true)
      },
      payDeposite() {
        vm.showPop = true
      },
      pay(data, other) {
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
              /*if(other){

               }else{

               }
               vm.$router.push({path: '/order'})*/
            }
          })
        })
        wx.error(function (res) {
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

  .seller-detail-more {
    .rel;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
      overflow: auto;
    }
    .swiper-shop {
      margin-bottom: 10/@rem;
      .swiper-pagination {
        bottom: 5px;
      }
      .swiper-pagination-bullet-active {
        background: #eee;
      }
    }

    .seller-info {
      background: url(../../../static/img/bg_user.jpg) no-repeat top center;
      .rbg-size(100%, 100%);
      .v-items {
        .rel;
        padding: 20/@rem;
        .wrap {
          .rel;
        }
        .img-con {
          .abs;
          top: 0;
          .size(150, 150);
          overflow: hidden;
          background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
          -webkit-background-size: cover;
          background-size: cover;
        }
        .infos {
          .flex;
          .flex-d-v;
          .borBox;
          width: 100%;
          .h(150);
          padding-left: 170/@rem;
          h3 {
            .flex-r(1);
            .fz(28);
            .txt-normal;
            .cf;
            .ellipsis;
          }
          .middle {
            .flex-r(1);
            .price {
            }
            span {
              &.price {
                .cf;
                .fz(24);
                .txt-del;
              }
              &.hasSell {
                .ce;
                .fz(22);
                i {
                  .iblock;
                  padding: 6/@rem 30/@rem 0 0;
                  .txt-normal;
                  .cdiy(#ff9900);
                }
              }
            }
            .star {
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
          }
          .tags {
            .flex-r(1);
            label {
              .fl;
              margin-right: 10/@rem;
              padding: 1px 8px;
              line-height: 1.8;
              .cf;
              .fz(20);
              .borR(4px);
              &.c1 {
                .bdiy(#fd5900);
              }
              &.c2 {
                .bdiy(#78c725);
              }
              &.c3 {
                .bdiy(#c77e25);
              }
            }
            .dispatchTime {
              .fr;
              padding-top: 10/@rem;
              .cc;
              .block;
              .fz(20);
            }
          }
          .distance {
            .abs;
            right: 0;
            top: 0;
            .cc;
            .fz(20);
          }
        }
        .bottom {
          overflow: hidden;
        }
        .note {
          .fl;
          .rel;
          padding: 10/@rem 0 0 30/@rem;
          .cd;
          .block;
          .fz(20);
          &:before {
            .abs;
            .block;
            left: 0;
            top: 16/@rem;
            content: '惠';
            .size(26, 26);
            .center;
            line-height: 26/@rem;
            background: #f38918;
          }
        }
      }
      .service_type {
        margin-left: 4px;
        padding: 0 2px;
        font-weight: normal;
        .cf;
        .fz(22);
        background: #2acaad;
        .borR(2px);
        &.water {
          background: #2acaad;
        }
        &.milk {
          background: #74c361;
        }
        &.water-milk {
          background: #ad64d2;
        }
      }
      .contacts {
        padding: 5px 20/@rem;
        .fz(20);
        .cf;
        background: rgba(0, 0, 0, .5);
        p {
          .ellipsis-clamp-2;
        }
        a {
          .cdiy(#38aee8);
        }
      }
    }

    .operate-con {
      .borBox;
      padding: 30/@rem 26/@rem;
      .bf;
      h3 {
        .rel;
        font-weight: normal;
        .fz(24);
      }
      .btn-deposite {
        .abs-center-vertical;
        right: 0;
        .fz(24);
        .cf;
        .block;
        padding: 10/@rem 20/@rem;
        background: #f9a11e;
        .borR(4px);
      }
    }

    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
      .weui-cell {
        padding: 26/@rem !important;
        .fz(26) !important;
      }
    }

    .bottom {
      margin-top: 14/@rem;
      .title {
        .borBox;
        padding: 20/@rem 0 10/@rem;
        .bf;
        .bor-t;
        .bor-b;
        h3 {
          padding-left: 20/@rem;
          .fz(24);
          background: #fff;
          .bor-l(3px, solid, @c2);
          span {
            .fr;
            padding-right: 20/@rem;
            font-weight: normal;
            .c9;
          }
        }
      }
      .content {
        .borBox;
        padding: 24/@rem 30/@rem;
        min-height: 100/@rem;
        .fz(24);
        .c3;
        .bf;
        &.basics {
          .c3;
          p {
            .rel;
            padding: 12/@rem 0;
            overflow: hidden;
            > i {
              font-style: normal;
              .fl;
            }
            span {
              .block;
              .c6;
              overflow: hidden;
            }
          }
          .btn-dial {
            .abs-center-vertical;
            right: 0;
            .fz(24);
            .cf;
            .block;
            padding: 10/@rem 20/@rem;
            background: #5bc331;
            .borR(4px);
          }
        }
        &.license {
          img {
            width: 30%;
          }
        }
        &.note {
          padding: 30/@rem 30/@rem;
          margin-bottom: 40px;
        }
      }
    }

  }

  .pop-txtcon {
    .vux-no-group-title {
      margin-top: 0;
      padding: 20/@rem 0 40/@rem;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input {
          .c3;
          &:disabled {
            .c3;
          }
        }
      }
      .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .pop-content {
      .rel;
      height: 100%;
      .borBox;
      padding: 14/@rem 14/@rem 90/@rem;
      h3 {
        .fz(30);
        font-weight: normal;
        .center;
        .c3;
      }
      ul {
        padding: 14/@rem;
        overflow: hidden;
      }
      li {
        margin: 8/@rem;
        line-height: 1.8;
        font-size: 24/@rem;
        .c3;
      }
    }
    .btn-sure {
      .fix;
      bottom: 0;
      z-index: 5;
      width: 100%;
      padding: 30/@rem 0;
      .fz(26);
      .cf;
      .bdiy(@c1);
    }
  }
</style>
