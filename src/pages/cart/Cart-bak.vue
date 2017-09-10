<template>
  <div class="global-cart" v-cloak>
    <div class="order-list">
      <scroller class="inner-scroller" ref="goodsScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <section class="v-items" :data-sellerid="goods.sellerId">
          <h4 class="item-top" v-if="goods.goodsList&&goods.goodsList.length"><i
            class="ico-store"></i>&nbsp;{{goods.sellerName}}&nbsp;&nbsp;<i
            class="fa fa-angle-right cc"></i><span
            @click="editGoods(goods.sellerId)">{{isEdit ? '完成' : '编辑'}}</span><span @click="emptyCart" v-show="!isEdit">清空</span>
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
                    <checker type="checkbox" default-item-class="demo2-item"
                             selected-item-class="demo2-item-selected">
                      <checker-item :value="index+1"
                                    :dataobj="{goodsId:item.goodsId,goodsNum:item.goodsNum,goodsImage:item.goodsImage,goodsName:item.goodsName,price:item.price}"
                                    @on-item-click="selectGoods"></checker-item>
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
                        <p class="price">￥{{item.price * item.goodsNum}}</p>
                        <p class="buy-count" v-show="!isEdit">x{{item.goodsNum}}</p>
                        <div class="checker-con" v-show="isEdit">
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
    <div class="count-bar">
      <div class="wrap">
        <div class="checker-all">
          <checker type="checkbox" default-item-class="demo3-item" selected-item-class="demo2-item-selected">
            <checker-item :value="0" @on-item-click="selectAll"><label>全选</label></checker-item>
          </checker>
        </div>
        <div class="txt-total">
          <h4>合计：<span>￥{{theTotal.price | toFixed}}</span><i>&nbsp;不含配送费用</i></h4>
        </div>
        <div class="btn btn-toPay" @click="goConfirm">结算{{theTotal.number ? '(' + theTotal.number + ')' : ''}}</div>
      </div>
    </div>
  </div>
</template>

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
        show: false,
        theTotal: {
          price: 0,
          number: 0
        },
        goods: {},
        params: {
          /*pagerSize: 10,
          pageNo: 1*/
        },
        curCartData: [],
        isEdit: false,
        isPosting: false,
        onFetching: false,
        labelPosition: '',
        error: '',
      }
    },
    components: {Tab, TabItem, XButton, Checker, CheckerItem, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getCart(false, true)
      vm.$nextTick(() => {
        vm.$refs.goodsScroller.finishInfinite(true)
        vm.$refs.goodsScroller.resize()
      })
    },
    /*computed: {
    },*/
    watch: {
      '$route'(to, from) {
        vm.getCart()
      },
      /*curCartData(oldVal,newVal) {
        if(newVal.length){
          for (let i = 0; i < newVal.length; i++) {
            vm.theTotal.price += (newVal[i].price*newVal[i].goodsNum)
            vm.theTotal.number += newVal[i].goodsNum
          }
        }
      }*/
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getCart(false, true)
          vm.$refs.goodsScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
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
                  console.log(cur.goodsNum, 855855)
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
          console.error(JSON.stringify(vm.curCartData, null, 2), 8888888888888888)
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
                goodsImage: cur.goodsNum,
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
      getCart(isLoadMore, cb) {
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(cartApi.view, vm.params, 'POST', function (res) {
          vm.onFetching = false
          vm.processing(0, 1)
          var resD = res.data
          vm.goods = resD
          cb ? cb() : null
//          if (!isLoadMore) {
//          } else {
//            vm.goods.push(resD)
//          }
//          console.log(vm.goods, '购物车数据')
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
      goConfirm() {
        // 带入当前选择的商品信息
        if (vm.curCartData.length) {
          var lastD = {
            sellerId: vm.goods.sellerId,
            sellerName: vm.goods.sellerName,
            totalPrice: vm.goods.totalPrice,
            goods: vm.curCartData
          }
          vm.$router.push({
            name: 'confirm_order',
            query: {thedata: encodeURIComponent(JSON.stringify(lastD))}
          })
        } else {
          vm.toast('请选择商品！', 'warn')
        }
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

  .global-cart {
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
</style>
