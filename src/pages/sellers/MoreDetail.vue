<template>
  <div class="seller-detail-more">
    <div class="seller-info">
      <div class="v-items" :data-id="seller.id">
        <div class="wrap">
          <img :src="seller.headimgurl">
          <div class="infos">
            <h3>{{seller.name}}({{seller.serviceTypeName}})<span
              class="distance">{{seller.distance ? ((seller.distance / 1000) | toFixed(1)) : seller.distance}}km</span>
            </h3>
            <div class="middle">
              <ol class="star">
                <li class="gray" v-for="star in 5" v-if="!seller.score">★</li>
                <li v-for="star in 5" v-else>★</li>
              </ol>
              <span
                class="hasSell"><i>{{((seller.score || 0) / 1000) | toFixed(1)}}分</i>已售{{seller.sellerCount}}单</span>
            </div>
            <div class="tags">
              <label class="c2">{{seller.authLevelName}}</label>
              <span class="dispatchTime">平均{{seller.dispatchTime || 22}}分钟送达</span>
            </div>
          </div>
          <div class="bottom">
            <label class="note" v-if="seller.note">{{seller.note || '商家特惠'}}</label>
          </div>
        </div>
      </div>
      <div class="contacts">
        <p>地址：{{seller.address}}</p>
        <p>配送电话：<a :href="'tel:'+seller.phone">{{seller.phone}}</a>，楼梯房需收取上楼费</p>
      </div>
    </div>
    <div class="bottom">
      <div class="detail-txt">
        <div class="title"><h3>店铺介绍</h3></div>
        <div class="content">{{seller.description}}</div>
      </div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  // import {Group, GroupTitle,Marquee, MarqueeItem} from 'vux'
  // import {goodsApi} from '../../service/main.js'

  export default {
    name: 'seller-detail-more',
    data() {
      return {
        seller: {},
        isPosting: false,
        noMore: false
      }
    },
    /*components: {
      Group,
      GroupTitle,
      Marquee,
      MarqueeItem
    },*/
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.getSeller()
    },
    methods: {
      /* 页面数据 */
      getSeller() {
        try{
          vm.seller = vm.$route.query.thedata ? JSON.parse(window.decodeURIComponent(vm.$route.query.thedata)) : {}
          console.log(vm.seller, '带过来的数据')
        }catch(e){
          // console.log(e)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .seller-detail-more {
    height: 100%;
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
      .rbg-size(100%);
      .v-items {
        .rel;
        padding: 20/@rem;
        .wrap {
          .rel;
        }
        img {
          .abs;
          left: 0;
          top: 0;
          .size(150, 150);
          background: #f5f5f5 url(../../../static/img/noImg.png) no-repeat center;
          -webkit-background-size: 30% auto;
          background-size: 30% auto;
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
                  padding-right: 30/@rem;
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
                .fz(24);
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
              .fz(16);
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
            top: 12/@rem;
            content: '惠';
            .size(26, 26);
            .center;
            line-height: 26/@rem;
            background: #f38918;
          }
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
    .bottom{
      margin-top: 14/@rem;
      .title {
        .borBox;
        padding: 20/@rem 0 10/@rem;
        .bf;
        .bor-t;
        .bor-b;
        h3{
          padding-left:20/@rem;
          .fz(24);
          background: #fff;
          .bor-l(3px, solid, @c2);
        }
      }
      .content{
        .borBox;
        padding:24/@rem 30/@rem;
        min-height:100/@rem;
        .fz(24);
        .c3;
        .indent;
        .bf;
      }
    }
  }

</style>
