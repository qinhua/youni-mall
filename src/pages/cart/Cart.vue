<template>
  <div class="cart-con" v-cloak>
    <div class="scroll-view">
      <div class="order-list">
        <scroller class="inner-scroller" ref="goodsScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" noDataText="" snapping>
          <!-- content goes here -->
          <section class="v-items" :data-sellerid="goods.sellerId">
            <!--<h4 class="item-top" v-if="goods.goodsList&&goods.goodsList.length" v-cloak><i class="ico-seller" :style="item.sellerImage?'background-image:url('+item.sellerImage+')':''"></i>&nbsp;{{goods.sellerName}}&nbsp;&nbsp;<i
              class="fa fa-angle-right cc"></i><span
              @click="editGoods(goods.sellerId)">{{isEdit ? '完成' : '编辑'}}</span><span @click="emptyCart"
                                                                                      v-show="!isEdit">清空</span>
            </h4>-->
            <h4 class="item-top" v-if="goods.goodsList&&goods.goodsList.length" v-cloak><i class="ico-seller"
                                                                                           :style="goods.sellerImage?'background-image:url('+goods.sellerImage+')':''"></i>&nbsp;{{goods.sellerName}}&nbsp;&nbsp;<i
              class="fa fa-angle-right cc"></i><span @click="emptyCart">清空</span>
            </h4>
            <ul class="has-list">
              <swipeout>
                <!--<swipeout-item @on-close="" @on-open="" transition-mode="follow" :disabled="isEdit"
                               v-for="(item,index) in goods.goodsList"
                               :data-id="item.goodsId" key="index" :ref="'switem-'+goods.sellerId">-->
                <swipeout-item @on-close="" @on-open="" transition-mode="follow"
                               v-for="(item,index) in goods.goodsList"
                               :data-id="item.goodsId" key="index" :ref="'switem-'+goods.sellerId">
                  <div slot="right-menu">
                    <!--<swipeout-button @click.native="onButtonClick('edit')" type="primary">编辑</swipeout-button>-->
                    <swipeout-button @click.native="delGoods(item.goodsId)" type="warn">删除</swipeout-button>
                  </div>
                  <div slot="content" class="demo-content vux-1px-t">
                    <li>
                      <section class="item-middle">
                        <div class="img-con"
                             :style="item.goodsImage?('background-image:url('+item.goodsImage+')'):''"></div>
                        <div class="info-con">
                          <h3><span
                            :class="item.goodsType==='goods_type.2'?'milk':''">{{item.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>{{item.goodsName}}
                          </h3>
                          <section class="middle" v-if="item.goodsType!=='goods_type.2'">
                            <span class="unit-price">￥{{item.price | toFixed}}元</span>
                            <span class="order-info">{{item.info}}</span>
                            <!--<label>{{item.label}}</label>-->
                          </section>
                          <section class="middle milk" v-else>
                          <span class="unit-price" @click="showModal('price',item)">订购数：<i
                            :class="isEdit?'active':''">{{item.note.priceLabel}}</i></span>
                            <span class="order-info">派送量：{{item.dispatchNum}}瓶/天</span>
                            <!--<label @click="showModal('favor',item.goodsId)">口味：<i :class="isEdit?'active':''">{{item.note.goodsNote}}</i></label>-->
                            <label>口味：<i>{{item.note.goodsNote}}</i></label>
                          </section>
                        </div>
                        <div class="price-con">
                          <p class="price">总价：￥{{item.payPrice}}元</p>
                          <p class="buy-count" v-show="!isEdit&&item.goodsType!=='goods_type.2'">x{{item.goodsNum}}</p>
                          <div class="checker-con" v-show="isEdit&&item.goodsType!=='goods_type.2'">
                            <label @click="updateGoods(item.goodsId, 'minus')"><i class="fa fa-minus"></i></label>
                            <input type="tel" readonly :value="item.goodsNum"
                                   @blur="updateGoods(item.goodsId, item.goodsNum)">
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
      <div class="iconNoData abs-center-vh" v-if="!goods.sellerId" v-cloak><i></i>
        <p>空空如也</p></div>
    </div>

    <div class="count-bar">
      <div class="wrap">
        <div class="txt-total">
          <h4>合计：<span>￥{{goods.totalPrice | toFixed}}元</span><i>&nbsp;不含配送费用</i></h4>
        </div>
        <div class="btn btn-toPay" @click="goConfirm">结算</div>
      </div>
    </div>

    <!--底部添加奶pop-checker-->
    <div v-transfer-dom>
      <popup class="buyCountCon" v-model="showPop" position="bottom" max-height="100%">
        <group>
          <div class="top-con" v-if="curEditObj.goodsImage" v-cloak>
            <div class="img-con"
                 :style="curEditObj.goodsImage?('background-image:url('+curEditObj.goodsImage+')'):''"></div>
            <div class="side-con">
              <h3>￥{{curTotalPrice}}<!--<span>￥{{tg.originPrice}}</span>--></h3>
              <p>单价：{{curEditObj.price|toFixed}}元</p>
              <label>已选：{{curPriceTag?curPriceTag.note:'未选择'}}</label>
            </div>
          </div>
          <div class="tags-con" v-if="priceTags.length" v-cloak>
            <!--<div class="wrap">-->
            <h4>订奶月份：</h4>
            <ul>
              <li :class="idx===curPriceIdx?'active':''" v-for="(tg,idx) in priceTags" :data-id="tg.id"
                  @click="changePriceTag(idx,tg)">{{tg.note}}({{tg.saleNum}}瓶)<br><i
                class="txt-del">￥{{tg.originPrice}}</i>【￥{{tg.salePrice}}元】
              </li>
            </ul>
            <!--</div>-->
          </div>
          <!--<div class="tags-con" v-if="favorTags.length" v-cloak>
            <h4>口味：</h4>
            <ul>
              <li :class="idx===curFavorIdx?'active':''" v-for="(fa,idx) in favorTags" @click="changeFavorTag(idx,fa)">
                {{fa}}
              </li>
            </ul>
          </div>-->
          <x-input id="curMilkAmount" title="配送量(瓶/天)：" placeholder="请输入每日配送量" required text-align="right" type="number"
                   v-model="curMilkAmount" @on-change="changeMilkAmout"></x-input>
          <!--<x-input title="总价：" text-align="right" type="text" readonly v-model="curTotalPrice"></x-input>-->
        </group>
        <button type="button" class="btn btn-edit-sure" @click="addToCart">完成</button>
      </popup>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let me
  let vm
  import {
    Tab,
    TabItem,
    Group,
    XInput,
    Checklist,
    XButton,
    Checker,
    CheckerItem,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Popup,
    TransferDom
  } from 'vux'
  import {orderApi, cartApi} from '../../service/main.js'

  export default {
    name: 'order',
    directives: {
      TransferDom
    },
    data() {
      return {
        isEdit: true,
        isPosting: false,
        onFetching: false,
        goods: {},
        curCartData: [],
        goodsIds: [],
        theTotal: {
          price: 0,
          number: 0
        },
        /*底部奶的浮窗-start*/
        showPop: false,
        curEditObj: {
          goodsId: null,
          goodsNote: '',
          goodsImage: '',
          price: null,
          goodsNum: 0,
          dispatchNum: 1
        },
        /*价格标签-start*/
        curMilkAmount: 1,
        curTotalPrice: 0,
        priceTags: [],
        curPriceIdx: 0,
        curPriceTag: null,
        /*价格标签-end*/
        /*口味标签-start*/
        favorTags: [],
        curFavorIdx: 0,
        curFavorTag: '',
        /*口味标签-end*/
        /*底部奶的浮窗-end*/
        params: {
          /*pageSize: 10,
           pageNo: 1*/
        },
      }
    },
    components: {
      Tab,
      TabItem,
      Group,
      XInput,
      XButton,
      Checker,
      CheckerItem,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Popup
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getCart()
      vm.$nextTick(function () {
        vm.$refs.goodsScroller.finishInfinite(true)
        vm.$refs.goodsScroller.resize()
      })
    },
    /*computed: {
     },*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'cart') {
          // vm.isEdit = false
          vm.getCart()
        }
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getCart(false, true)
          vm.$refs.goodsScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getCart(true, true)
          vm.$refs.goodsScroller.finishInfinite(true)
        }, 1000)
      },
      // 同步选中的商品数据
      syncData(id) {
        if (vm.curCartData.length) {
          for (let i = 0; i < vm.curCartData.length; i++) {
            var cur = vm.curCartData[i]
            if (cur.goodsId === id) {
              for (let j = 0; j < vm.goods.goodsList.length; j++) {
                var cur1 = vm.goods.goodsList.curCartData[j]
                if (id === cur1.goodsId) {
                  cur.goodsNum = cur1.goodsNum
                }
              }
            }
          }
        }
      },
      selectGoods(data) {
        var obj = data.linedata
        console.profile(JSON.stringify(data))
        setTimeout(function () {
          // 整理当前选择的商品信息（有则跟新，无则追加，相同则删除）
          if (vm.curCartData.length) {
            for (let i = 0; i < vm.curCartData.length; i++) {
              var cur = vm.curCartData[i]
              if (cur.goodsId === obj.goodsId) {
                if (cur.goodsNum === obj.goodsNum) {
                  vm.curCartData.splice(i, 1)
                } else {
                  cur.goodsNum = obj.goodsNum
                }
              } else {
                vm.curCartData.push(obj)
              }
            }
          } else {
            vm.curCartData.push(obj)
          }
          let allChecker = window.document.querySelectorAll('.demo2-item')
          let allCheckedChecker = window.document.querySelectorAll('.demo2-item.demo2-item-selected')
          let checkerAll = window.document.querySelector('.demo3-item')
          if (allCheckedChecker.length === allChecker.length) {
            checkerAll.classList.add('demo2-item-selected')
          } else {
            // vm.curCartData = []
            checkerAll.classList.remove('demo2-item-selected')
          }
          // console.error(JSON.stringify(vm.curCartData, null, 2), 8888888888888888)
        }, 0)
      },
      selectAll() {
        // 整理当前选择的商品信息
        setTimeout(function () {
          let allChecker = window.document.querySelectorAll('.vux-checker-item')
          if (allChecker.length && (!vm.curCartData.length || vm.curCartData.length < allChecker.length - 1)) {
            for (let i = 0; i < vm.goods.goodsList.length; i++) {
              let cur = vm.goods.goodsList[i]
              vm.curCartData.push({
                goodsId: cur.goodsId,
                goodsNum: cur.goodsNum,
                goodsImage: cur.goodsImage,
                goodsName: cur.goodsName,
                price: cur.price,
              })
            }
            for (let j = 0; j < allChecker.length; j++) {
              allChecker[j].classList.add('demo2-item-selected')
            }
          } else {
            vm.curCartData = []
            for (let j = 0; j < allChecker.length; j++) {
              allChecker[j].classList.remove('demo2-item-selected')
            }
          }
          console.log(vm.curCartData, '最后的购物车数据')
        }, 0)
      },
      countTotal() {
        vm.theTotal.price = 0
        vm.theTotal.number = 0
        for (let i = 0; i < vm.goods.goodsList.length; i++) {
          var cur = vm.goods.goodsList[i]
          vm.theTotal.price += (cur.price * cur.goodsNum)
          vm.theTotal.number += cur.goodsNum
        }
      },
      getCart(isLoadMore, cb) {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(cartApi.view, vm.params, 'POST', function (res) {
          vm.onFetching = false
          vm.processing(0, 1)
          var resD = res.data
          if (!resD.goodsList.length) {
            me.locals.set('isFirstConfirm', true)
          }
          for (var i = 0; i < resD.goodsList.length; i++) {
            var cur = resD.goodsList[i]
            cur.note = cur.note ? JSON.parse(cur.note) : null
          }
          vm.goods = resD
          // vm.countTotal()
          // console.log(vm.goods, '购物车数据')
          cb ? cb(resD) : null
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      emptyCart() {
        if (vm.isPosting) return false
        vm.confirm('确认清空？', '清空后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(cartApi.clear, null, 'POST', function (res) {
            vm.getCart()
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
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
      updateGoods(id, type) {
        if (vm.isPosting) return false
        vm.isPosting = true
        if (type === 'add') {
//          vm.curCount++
          vm.loadData(cartApi.add, {goodsId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getCart(false, vm.syncData(id))
          }, function () {
            vm.isPosting = false
          })
        } else {
//          vm.curCount--
          vm.loadData(cartApi.minus, {goodsId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.getCart(false, vm.syncData(id))
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
      showModal(type, data) {
        if (!vm.isEdit) return
        vm.curEditObj = {
          goodsId: data.goodsId,
          goodsNote: data.note.goodsNote,
          goodsImage: data.goodsImage,
          price: data.price,
          goodsNum: data.goodsNum,
          dispatchNum: data.dispatchNum
        }
        /*if (type === 'favor') {
         vm.priceTags = []
         for (var i = 0; i < vm.goods.goodsList.length; i++) {
         var cur = vm.goods.goodsList[i]
         if (id === cur.goodsId) {
         vm.favorTags = cur.goodsFlavourLabel ? cur.goodsFlavourLabel.split(',') : []
         }
         }
         } else {
         vm.favorTags = []*/

        vm.curMilkAmount = data.dispatchNum
        vm.priceTags = data.saleConfigDtos
        for (var m = 0; m < vm.priceTags.length; m++) {
          var cur = vm.priceTags[m]
          if (cur.note === data.note.priceLabel) {
            vm.curPriceIdx = m
            vm.curPriceTag = cur
            vm.curEditObj.goodsNum = cur.saleNum
            vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, cur.salePrice) + '元'
          }
        }

//        }

        vm.showPop = true
      },
      addToCart() {
        // 判断当前是否填写了数量
        if (vm.curEditObj.dispatchNum) {
          vm.loadData(cartApi.add, vm.curEditObj, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
//              vm.isEdit = false
              vm.showPop = false
              vm.getCart()
              vm.curEditObj.dispatchNum = 1
            } else {
              vm.toast(res.message || '购物车中已有其他店铺商品，请先清空')
            }
          }, function () {
            vm.isPosting = false
          })
        } else {
          vm.toast('配送量至少1瓶哦！', 'warn')
        }
      },
      changeFavorTag(idx, data) {
        vm.curFavorIdx = idx
        vm.curFavorTag = data
        // console.log('口味标签：', vm.curFavorTag)
      },
      changePriceTag(idx, data) {
        vm.curPriceIdx = idx
        vm.curPriceTag = data
        vm.curEditObj.goodsNum = data.saleNum
        vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, data.salePrice) + '元'
        // console.log('价格标签：', vm.curPriceTag.note)
      },
      changeMilkAmout(val) {
        try {
          vm.curEditObj.dispatchNum = val
          vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, vm.curPriceTag.salePrice) + '元'
        } catch (e) {
          // console.log(e)
        }
      },
      goConfirm() {
        /*if (vm.isEdit) {
         vm.toast('请先完成编辑！', 'warn')
         return false
         }*/
        vm.jump('confirm_order')
      },
      change(val) {
        console.log('change', val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .cart-con {
    .rel;
    height: 100%;
    z-index: 1;
    overflow: hidden;
    .scroll-view {
      height: 100%;
      overflow: auto;
    }

    .demo2-item, .demo3-item {
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
            white-space: nowrap;
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
            padding: 14/@rem 20/@rem 14/@rem 14/@rem;
            min-height: 170/@rem;
            .img-con {
              .abs;
              top: 14/@rem;
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
                      .borR(2px);
                      &.active {
                        .abs;
                        z-index: 2;
                        padding: 0 40/@rem 0 2px;
                        border: 1px solid #e47b25;
                        &:before {
                          content: "";
                          position: absolute;
                          top: 8/@rem;
                          right: 10/@rem;
                          width: 10/@rem;
                          height: 10/@rem;
                          border: 1px solid #f17114;
                          border-width: 1px 0 0 1px;
                          -webkit-transform: rotate(-135deg);
                          transform: rotate(-135deg);
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
                      .borR(2px);
                      &.active {
                        padding: 0 40/@rem 0 2px;
                        border: 1px solid #e47b25;
                        &:before {
                          content: "";
                          position: absolute;
                          top: 5/@rem;
                          right: 10/@rem;
                          width: 12/@rem;
                          height: 12/@rem;
                          border: 1px solid #f17114;
                          border-width: 1px 0 0 1px;
                          -webkit-transform: rotate(-135deg);
                          transform: rotate(-135deg);
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
      .checker-all {
        .abs-center-vertical;
        left: 16/@rem;
        z-index: 2;
        .fz(22);
        .vux-checker-box {
          .rel;
          padding-right: 88/@rem;
          .vux-checker-item {
            line-height: 88/@rem;
            > label {
              .abs;
              left: 40/@rem;
              top: 0;
              padding-left: 5px;
            }
          }
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
  }

  .buyCountCon {
    .vux-no-group-title {
      margin-top: 0;
      padding: 20/@rem 0 40/@rem;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
      }
      .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .top-con {
      .rel;
      .borBox;
      padding: 10/@rem 20/@rem 10/@rem;
      .bor-b;
      .img-con {
        .abs;
        .size(150, 150);
        left: 20/@rem;
        top: 0;
        overflow: hidden;
        background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
        -webkit-background-size: cover;
        background-size: cover;
        .bor;
        .borR(3px);
      }
      .side-con {
        .borBox;
        width: 100%;
        height: 100%;
        padding-left: 180/@rem;
        h3 {
          padding-bottom: 10/@rem;
          .txt-normal;
          .cdiy(@c2);
          .fz(34);
          span {
            margin-left: 40/@rem;
            .c9;
            .fz(22);
            .txt-del;
          }
        }
        p {
          .c9;
          .fz(24);
        }
        label {
          .c9;
          .fz(24);
        }
      }
    }
    .tags-con {
      padding: 10/@rem 24/@rem;
      .wrap {
        padding: 14/@rem 0;
        .bor-b;
      }
      h4 {
        .fz(24);
        font-weight: normal;
        .c3;
      }
      ul {
        padding: 14/@rem 0;
        overflow: hidden;
      }
      li {
        .pointer;
        .fl;
        padding: 6/@rem 20/@rem;
        margin: 8/@rem;
        line-height: 1.5;
        font-size: 22/@rem;
        .c6;
        .bf8;
        .bor(1px, solid, #ddd);
        .borR(3px);
        &.active {
          .cf;
          .bdiy(@c3);
          .bor(1px, solid, @c3);
        }
      }
    }

    .btn-edit-sure {
      width: 100%;
      padding: 30/@rem 0;
      .fz(26);
      .cf;
      .bdiy(@c2);
    }
  }
</style>
