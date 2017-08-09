<template>
  <div class="ticket">
    <tab class="ticket-type" bar-active-color="transparent">
      <tab-item :selected="!params.type?true:false" @on-item-click="onItemClick"><i class="fa fa-ticket"></i>&nbsp;购买水票
      </tab-item>
      <tab-item :selected="params.type?true:false" @on-item-click="onItemClick(1)"><i class="fa fa-user-circle-o"></i>&nbsp;我的水票
      </tab-item>
    </tab>
    <tab class="ticket-tab" bar-active-color="transparent" v-show="params.type">
      <tab-item selected @on-item-click="filterTicket(0,true)">全部</tab-item>
      <tab-item @on-item-click="filterTicket(1,true)">买5送1</tab-item>
      <tab-item @on-item-click="filterTicket(2,true)">买10送2</tab-item>
      <tab-item @on-item-click="filterTicket(3,true)">已失效</tab-item>
    </tab>
    <tab class="ticket-tab" bar-active-color="transparent" v-show="!params.type">
      <tab-item selected @on-item-click="filterTicket(0)">全部</tab-item>
      <tab-item @on-item-click="filterTicket(1)">买5送1</tab-item>
      <tab-item @on-item-click="filterTicket(2)">买10送2</tab-item>
    </tab>
    <scroller class="ticket-list" height="100%" :on-refresh="refresh" :on-infinite="infinite" refreshText="下拉刷新"
              noDataText="没有更多数据"
              snapping>
      <!-- content goes here -->
      <section class="v-items" v-for="(item, index) in tickets" :data-id="item.id">
        <section class="wrap">
          <img :src="item.imgurl">
          <section class="infos">
            <h3>{{item.name}}<span class="count">数量：<i>{{item.count}}桶</i></span></h3>
            <section class="middle">
              <span class="price">￥{{item.price}}</span>
              <span class="retail-price">零售价<i>￥{{item.retailPrice}}</i></span>
              <button type="button" class="btn btn-buy" @click="buy(item.id)">购买</button>
            </section>
            <label>{{item.note}}</label>
          </section>
        </section>
      </section>
    </scroller>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Tab, TabItem} from 'vux'
  import {ticketApi} from '../store/home.js'
  export default {
    name: 'ticket',
    data () {
      return {
        curTicketFilter: '',
        tickets: [],
        params: {
          type: 0,
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: ''
        },
        onFetching: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      vm.getTickets()
    },
    /* computed: {
     'params.type' () {
     return this.$route.params.type
     }
     }, */
    watch: {
      '$route' (to, from) {
        vm.getTickets()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      buy (id) {
        vm.$router.push({path: '/detail/' + id})
      },
      refresh (done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getTickets()
          // this.finishInfinite(true)
        }, 1200)
      },
      infinite (done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getTickets(true)
        }, 2000)
      },
      onItemClick (type) {
        if (type) {
          vm.params.type = 2
        } else {
          vm.params.type = 0
          this.$router.push({path: '/ticket'})
        }
        vm.getTickets()
      },
      filterTicket (type, isMine) {
        vm.curTicketFilter = type
        vm.getTickets()
      },
      getTickets (isLoadMore) {
        vm.params.type = this.$route.params.type || 0
        if (vm.onFetching) return false
        // 根据isMine判断不同的水票类型
        vm.onFetching = true
        vm.loadData(ticketApi.tickets, vm.params, 'POST', function (res) {
          if (!isLoadMore) {
            vm.tickets = res.data.itemList
          } else {
            vm.tickets.push(res.data.itemList, '水票数据')
          }
          console.log(vm.tickets)
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  .ticket-type {
    z-index: 10;
    .vux-tab-item {
      &.vux-tab-selected {
        .cf!important;
        background: #5cc5d0 !important;
      }
    }
  }

  .ticket-tab {
    z-index: 10;
    .vux-tab-item {
      &.vux-tab-selected {
        .cdiy(#5cc5d0) !important;
      }
    }
  }

  .ticket-list {
    .borBox;
    padding: 88px 0 50px;
    .v-items {
      padding: 20/@rem;
      .bf;
      &:not(:last-child) {
        .bor-b;
      }
      .wrap {
        .rel;
        .h(150);
      }
      img {
        .abs;
        left: 0;
        top: 0;
        .size(150, 150);
        background: #f5f5f5 url(../../static/img/noImg.png) no-repeat center;
        -webkit-background-size: 30% auto;
        background-size: 30% auto;
      }
      .infos {
        .flex;
        .flex-d-v;
        .borBox;
        width: 100%;
        height: 100%;
        padding-left: 170/@rem;
        h3 {
          .flex-r(1);
          .fz(30);
          .txt-normal;
          .c3;
          .ellipsis;
        }
        .count {
          .abs;
          right: 0;
          .fz(20);
          .c3;
          i {
            .txt-normal;
            .c9;
          }
        }
        .middle {
          .flex-r(1);
          padding: 10/@rem 0;
          .price {
          }
          span {
            &.price {
              .c3;
              .fz(26);
            }
            &.retail-price {
              padding-left: 30/@rem;
              .c9;
              .fz(22);
              .txt-del;
              i {
                .txt-normal;
              }
            }
          }
          .btn-buy {
            .fr;
            padding: 2px 20/@rem;
            .fz(24);
            .cf;
            /*.bdiy(#f16b41);*/
            .bdiy(#5cc5d0);
            .borR(4px);
          }
        }
        label {
          .flex-r(1);
          .cdiy(#f34c18);
          .fz(22);
          .ellipsis;
        }
      }
    }
  }
</style>
