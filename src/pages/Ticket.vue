<template>
  <div class="ticket">
    <tab class="ticket-type" bar-active-color="transparent">
      <tab-item :selected="!type?true:false" @on-item-click="onItemClick"><i class="fa fa-pencil-square-o"></i>&nbsp;购买水票
      </tab-item>
      <tab-item :selected="type?true:false" @on-item-click="onItemClick(1)"><i class="fa fa-user-circle-o"></i>&nbsp;我的水票
      </tab-item>
    </tab>
    <tab class="ticket-tab"  bar-active-color="transparent" v-show="type">
      <tab-item selected  @on-item-click="filterTicket(0,true)">全部</tab-item>
      <tab-item @on-item-click="filterTicket(1,true)">买5送1</tab-item>
      <tab-item @on-item-click="filterTicket(2,true)">买10送2</tab-item>
      <tab-item @on-item-click="filterTicket(3,true)">已失效</tab-item>
    </tab>
    <tab class="ticket-tab" bar-active-color="transparent" v-show="!type">
      <tab-item selected  @on-item-click="filterTicket(0)">全部</tab-item>
      <tab-item @on-item-click="filterTicket(1)">买5送1</tab-item>
      <tab-item @on-item-click="filterTicket(2)">买10送2</tab-item>
    </tab>
    <scroller class="ticket-list" :on-refresh="refresh" :on-infinite="infinite" refreshText="下拉刷新" noDataText="没有更多数据"
              snapping>
      <!-- content goes here -->
      <section class="v-items" v-for="(item, index) in tickets" :data-id="item.id">
        <section class="wrap">
          <img :src="item.imgurl">
          <section class="infos">
            <h3>{{item.name}}</h3>
            <section class="middle">
              <span class="price">￥{{item.price}}</span>
              <span class="hasSell">已售{{item.saleCount}}单</span>
            </section>
            <label>{{item.label}}</label>
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
  import {Tab, TabItem, Tabbar, TabbarItem, XNumber, Group, Cell} from 'vux'
  import {ticketApi} from '../store/home.js'
  export default {
    name: 'ticket',
    data () {
      return {
        type: 0,
        curTicketFilter: '',
        tickets: [],
        onFetching: false
      }
    },
    components: {Tab, TabItem, Tabbar, TabbarItem, XNumber, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      vm.type = this.$route.params.type || ''
      // vm.getTickets()
      for (let i = 1; i <= 20; i++) {
        this.items.push(i + ' - keep walking, be 2 with you.')
      }
      setTimeout(() => {
        let start = this.top - 1
        for (let i = start; i > start - 10; i--) {
          this.items.splice(0, 0, i + ' - keep walking, be 2 with you.')
        }
        this.top = this.top - 10
        // done()
      }, 1500)
      this.top = 1
      this.bottom = 20
    },
    computed: {
      'type' () {
        vm.type = this.$route.params.type
        return this.$route.params.type
      }
    },
    watch: {
      '$route' (to, from) {
        console.log(to, from)
        vm.getTickets(true)
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      refresh (done) {
        console.log('下拉加载')
        // vm.getTickets()
        console.log(this.top)
        setTimeout(() => {
          let start = this.top - 1
          for (let i = start; i > start - 10; i--) {
            this.items.splice(0, 0, i + ' - keep walking, be 2 with you.')
          }
          this.top = this.top - 10
          // done()
        }, 1500)
        /* setTimeout(function () {
          // vm.scroller.options.finishPullToRefresh()
        }, 2000) */
      },
      infinite (done) {
        console.log('无限滚动')
        // vm.getTickets()
        setTimeout(() => {
          let start = this.bottom + 1

          for (let i = start; i < start + 10; i++) {
            this.items.push(i + ' - keep walking, be 2 with you.')
          }
          this.bottom = this.bottom + 10
          done()
        }, 1500)
      },
      onItemClick (type) {
        if (type) {
          vm.type = 2
          vm.getTickets(true)
        } else {
          vm.type = 0
          this.$router.push({path: '/ticket'})
          vm.getTickets()
        }
      },
      filterTicket (type, isMine) {
        vm.curTicketFilter = type
        vm.getTickets(isMine)
      },
      getTickets (isMine, isLoadMore) {
        if (vm.onFetching) return false
        // 根据isMine判断不同的水票类型
        var params = vm.filterData || {
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: ''
        }
        vm.loadData(ticketApi.tickets, params, 'POST', function (res) {
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

  .ticket-type, .ticket-tab {
    z-index: 10;
  }
  .ticket-tab {
    &.vux-tab-selected {
      .cdiy(#5cc5d0)!important;
    }
   }

  .ticket-type {
    .vux-tab-item {
      &.vux-tab-selected {
        .cf!important;
        background: #5cc5d0!important;
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
        .middle {
          .flex-r(1);
          .price {
          }
          span {
            &.price {
              .c3;
              .fz(24);
              .txt-del;
            }
            &.hasSell {
              padding-left: 30/@rem;
              .c9;
              .fz(22);
            }
          }
        }
        label {
          .flex-r(1);
          .cdiy(#f34c18);
          .fz(22);
        }
      }
    }
  }
</style>
