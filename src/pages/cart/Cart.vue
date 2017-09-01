<template>
  <div class="global-cart" v-cloak>
    <div class="order-list">
      <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <section class="v-items" :data-sellerid="goods.sellerId">
          <h4 class="item-top" v-if="goods.goodsList&&goods.goodsList.length"><i class="ico-store"></i>&nbsp;{{goods.sellerName}}&nbsp;&nbsp;<i
            class="fa fa-angle-right cc"></i><span @click="editGoods(goods.sellerId)">{{isEdit ? '完成' : '编辑'}}</span>
          </h4>
          <ul class="has-list">
            <swipeout>
              <swipeout-item @on-close="" @on-open="" transition-mode="follow" :disabled="isEdit"
                             v-for="(item,index) in goods.goodsList"
                             :data-id="item.goodsId" key="index" :ref="'switem-'+goods.sellerId">
                <div slot="right-menu">
                  <!--<swipeout-button @click.native="onButtonClick('edit')" type="primary">编辑</swipeout-button>-->
                  <swipeout-button @click.native="delGoods(item.goodsId)" type="warn">删除</swipeout-button>
                </div>
                <div slot="content" class="demo-content vux-1px-t">
                  <li>
                    <checker type="checkbox" v-model="demo2" default-item-class="demo2-item"
                             selected-item-class="demo2-item-selected" :dataid="item.goodsId" @on-change="selectGoods">
                      <checker-item :value="index"></checker-item>
                    </checker>
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
                        <p class="price">￥{{item.price*item.goodsNum}}</p>
                        <p class="buy-count" v-show="!isEdit">x{{item.goodsNum}}</p>
                        <div class="checker-con" v-show="isEdit">
                          <label @click="updateGoods(item.goodsId, 'minus')"><i class="fa fa-minus"></i></label>
                          <input type="tel" readonly :value="item.goodsNum" @blur="updateGoods(item.goodsId, item.goodsNum)">
                          <label @click="updateGoods(item.goodsId,'add')"><i class="fa fa-plus"></i></label>
                        </div>
                      </div>
                    </section>
                  </li>
                </div>
              </swipeout-item>
            </swipeout>
          </ul>
        </section>
      </scroller>
    </div>
    <div class="count-bar">
      <div class="wrap">
        <div class="checker-all">
          <checklist title="" :options="commonList" v-model="checklist0011" @on-change="change"
                     name="checkerAll" :max="2"></checklist>
        </div>
        <div class="txt-total">
          <h4>合计：<span>￥{{goods.totalPrice}}</span><i>&nbsp;不含配送费用</i></h4>
        </div>
        <div class="btn btn-toPay">结算(2)</div>
      </div>
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Checklist, XButton, Checker, CheckerItem, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {orderApi, cartApi} from '../../service/main.js'

  export default {
    name: 'order',
    data() {
      return {
        demo2: [{key: '1', value: 'A'}, {key: '2', value: 'B'}],
        checklist0011: [],
        show: false,
        curOrderFilter: '',
        goods: [],
        params: {
          type: 0,
          pagerSize: 10,
          pageNo: 1
        },
        isEdit: false,
        isPosting: false,
        onFetching: false,
        labelPosition: '',
        error: '',
        commonList: ['全选']
      }
    },
    components: {Tab, TabItem, Checklist, XButton, Checker, CheckerItem, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getCart()
      vm.$nextTick(() => {
        vm.$refs.orderScroller.finishInfinite(true)
        vm.$refs.orderScroller.resize()
      })
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        vm.getCart()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toAppraise(id) {
        this.$router.push({path: '/appraise' + (param ? '/' + param : '')})
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getCart()
          vm.$refs.orderScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getCart(true)
          vm.$refs.orderScroller.finishInfinite(true)
        }, 1000)
      },
      onItemClick(type) {
        if (type === 'undefined') {
          vm.params.type = ''
        } else {
          vm.params.type = type
        }
        vm.getOrders()
      },
      selectGoods(obj) {
        console.log(arguments,9985557)
        /*if (type === 'undefined') {
          vm.params.type = ''
        } else {
          vm.params.type = type
        }
        vm.getOrders()*/
      },
      filterTicket(type, isMine) {
        vm.curTicketFilter = type
        vm.getOrders()
      },
      getCart(isLoadMore) {
        vm.params.type = vm.$route.params.id
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(cartApi.view, vm.params, 'POST', function (res) {
          var resD = res.data
          /*for (var i = 0; i < resD.length; i++) {
            switch (resD[i].status) {
              case -1:
                resD[i].statusName = '已取消'
                break
              case 0:
                resD[i].statusName = '待支付'
                break
              case 1:
                resD[i].statusName = '待派送'
                break
              case 2:
                resD[i].statusName = '派送中'
                break
              case 3:
                resD[i].statusName = '待评价'
                break
              case 4:
                resD[i].statusName = '已完成'
                break
            }
          }*/
//          if (!isLoadMore) {
          vm.goods = resD
//          } else {
//            vm.goods.push(resD)
//          }
          console.log(vm.goods, '购物车数据')
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      editGoods(id) {
        if (vm.isEdit) {
          vm.isEdit = false
          /*var kk = vm.$refs['switem-' + id]
          for (var i = 0; i < kk.length; i++) {
            kk[i].close()
          }*/
        } else {
          vm.isEdit = true
          /*var kk = vm.$refs['switem-' + id]
          for (var i = 0; i < kk.length; i++) {
            kk[i].open('right')
          }*/
        }
      },
      updateGoods(id,type) {
        if (vm.isPosting) return false
        vm.isPosting = true
        if (type === 'add') {
//          vm.curCount++
          vm.loadData(cartApi.add, {goodsId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getCart()
          }, function () {
            vm.isPosting = false
          })
        } else {
//          vm.curCount--
          vm.loadData(cartApi.minus, {goodsId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getCart()
          }, function () {
            vm.isPosting = false
          })
        }
       /* vm.loadData(cartApi.update, {goodsId: id, goodsNum: num}, 'POST', function (res) {
          vm.getCart()
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })*/
      },
      delGoods(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(cartApi.del, {goodsId: id}, 'POST', function (res) {
            vm.getCart()
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      generateOrder(id) {
        if (vm.isPosting) return false
          vm.isPosting = true
          vm.loadData(orderApi.add, {
            openid:'oEo51t1PTVGj7H6Ahdqr_kac-1vs',
            sellerId:'285o5keqsqh8br81adrviu3bve',
            goodsId	:'7aah4h26vaij4r8aemnfvhb59n',
            goodsNum:9,
            dispatchTime:'3周内',
            addressId	:'武汉市',
            userMessage:'something',
            couponId:''
          }, 'POST', function (res) {
            vm.getCart()
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
      },
      cancelOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认取消？', '订单取消后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancelOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      pushOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认催单？', '请不要频繁催单！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancelOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      payOrder(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.payOrder + '?id=' + id, vm.params, 'POST', function (res) {
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      change(val) {
        console.log('change', val)
      },
      curCheck(itemValue, itemDisabled) {
        console.log('checkbox', itemValue)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .global-cart {
  }

  .demo2-item {
    &:before {
      font-family: 'weui';
      content: '\EA01';
      .c9;
      .fz(36);
      display: block;
    }
  }

  .demo2-item-selected {
    border-color: @c3;
    &:before {
      content: '\EA06';
      .cdiy(@c3);
    }
  }

  .order-list {
    .inner-scroller {
      .v-items {
        .borBox;
        margin-bottom: 20/@rem;
        .bsd(0, 2px, 10px, 0, #ccc);
        .item-top {
          .rel;
          .borBox;
          padding: 14/@rem 60/@rem 14/@rem 20/@rem;
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
          width: 100%;
          .borBox;
          padding: 14/@rem 20/@rem 14/@rem 60/@rem;
          .flex;
          .img-con {
            .rel;
            .size(130, 130);
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
    .checker-all {
      .abs-center-vertical;
      left: 16/@rem;
      z-index: 2;
      .fz(22);
      .weui-cells {
        &:before, &:after {
          .none;
        }
        .no-bg;
        .weui-cell {
          padding: 0;
          height: 88/@rem;
          line-height: 88/@rem;
          .weui-cell__hd {
            padding-right: .25em;
            .weui-icon-checked {
            }

          }
          .weui-cells_checkbox .weui-check:checked + .weui-icon-checked:before {
            color: #666;
          }
        }
        p {
          .fz(26);
        }
      }
      .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
        .cdiy(@c3) !important;
      }
    }
    .txt-total {
      .rel;
      .borBox;
      .fl;
      padding: 0 10/@rem 0 100/@rem;
      width: 70%;
      height: 100%;
      line-height: 88/@rem;
      h4 {
        .fz(24);
        .right;
        .txt-normal;
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
