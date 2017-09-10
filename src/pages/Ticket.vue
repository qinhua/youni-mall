<template>
  <div class="ticket-con" v-cloak>
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
    <slide-tab ref="slidernav" skey="s01" :slides="navs" @on-select="selectCategory" v-show="!params.type"></slide-tab>

    <!--<tab class="ticket-tab" bar-active-color="transparent" v-show="!params.type">
      <tab-item selected @on-item-click="filterTicket(0)">全部</tab-item>
      <tab-item @on-item-click="filterTicket(1)">买5送1</tab-item>
      <tab-item @on-item-click="filterTicket(2)">买10送2</tab-item>
      <tab-item @on-item-click="filterTicket(2)">买100送30</tab-item>
      <tab-item @on-item-click="filterTicket(2)">买100送35</tab-item>
      <tab-item @on-item-click="filterTicket(2)">买100送40</tab-item>
    </tab>-->
    <div class="ticket-list">
      <scroller class="inner-scroller" ref="ticketScroller" height="100%" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText=""
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
    <div class="iconNoData abs-center-vh" v-if="!tickets.length"><i></i><p>暂无水票</p></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import SlideTab from '../components/SlideTab'
  import {Tab, TabItem} from 'vux'
  import {ticketApi} from '../service/main.js'

  export default {
    name: 'ticket',
    data() {
      return {
        curTicketFilter: '',
        tickets: [],
        navs: [{
          'key': 'water_ticket_type.1',
          'value': '买5送1'
        },
          {
            'key': 'water_ticket_type.2',
            'value': '买10送2'
          },
          {
            'key': 'water_ticket_type.3',
            'value': '买100送30'
          },
          {
            'key': 'water_ticket_type.4',
            'value': '买100送35'
          },
          {
            'key': 'water_ticket_type.5',
            'value': '买100送40'
          }],
        params: {
          type: 0,
          userType: 1,
          status: 0,
          pagerSize: 10,
          pageNo: 1
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem,SlideTab},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.params.type = vm.$route.params.type
      vm.getTickets()
      vm.$nextTick(() => {
        vm.$refs.ticketScroller.finishInfinite(true)
        vm.$refs.ticketScroller.resize()
      })
    },
    /* computed: {
     'params.type' () {
     return this.$route.params.type
     }
     }, */
    watch: {
      '$route'(to, from) {
        if(to.name==='ticket'){
          vm.params.type = vm.$route.params.type
          vm.getTickets()
        }
      }
    },
    methods: {
      // 向父组件传值
      selectCategory(data) {
        console.log(data,'当前水票种类')
        vm.params.type=data.key
        vm.getTickets()
      },
      buy(id) {
        vm.$router.push({path: '/detail/' + id})
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getTickets()
          vm.$refs.ticketScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getTickets(true)
          vm.$refs.ticketScroller.finishInfinite(true)
        }, 1000)
      },
      onItemClick(type) {
        if (type) {
          vm.params.type = 2
        } else {
          vm.params.type = 0
          this.$router.push({path: '/ticket'})
        }
        vm.getTickets()
      },
      filterTicket(type, isMine) {
        vm.curTicketFilter = type
        vm.getTickets()
      },
      getTickets(isLoadMore) {
        vm.params.status = this.$route.params.type || 0
        if (vm.isPosting) return false
        // 根据isMine判断不同的水票类型
        vm.isPosting = true
        vm.processing()
        vm.loadData(ticketApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0,1)
          var resD = res.data.pager
          if (!isLoadMore) {
            vm.tickets = res.data.itemList
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.tickets = resD.itemList
          } else {
            resD.itemList.length ? vm.tickets.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.tickets, '水票数据')
        }, function () {
          vm.isPosting = false
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';
  .ticket-con{
    height: 100%;
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
      .inner-scroller {
        .borBox;
        padding: 88px 0 150px;
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
              .fz(28);
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
    }
  }

</style>
