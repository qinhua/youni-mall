/**
 * Created by Chin on 2017/7/29.
 */
import Mock from 'mockjs'
export default (function () {
  var rdnBetween = function (start, end) {
    return Math.floor(Math.random() * (end - start) + start)
  }
  var isArray = function (sources) {
    return '[object Array]' == Object.prototype.toString.call(sources);
  }
  var rdnFromArr = function (arr, len) {
    var tmpArr = [];
    if (len > 1) {
      var copys = arr.slice(0);
      for (var i = 0; i < len; i++) {
        var rdm = rdnBetween(0, copys.length);
        tmpArr.push(copys[rdm]);
        copys.splice(rdm, 1);
      }
    } else {
      tmpArr = arr[rdnBetween(0, arr.length)]
    }
    return isArray(tmpArr) ? tmpArr.sort() : tmpArr;
  }

  /*首页接口*/
  Mock.mock(/\/home\/banner/, {
    'itemList|1-4': [{
      'id|+1': 1,
      'image': '../static/img/banner/p0' + Mock.Random.integer(1, 9) + '.jpg',
      // 'image': Mock.Random.dataImage('636x320'),
      'linkUrl': Mock.mock('@url')
    }]
  })
  Mock.mock(/\/home\/topNotice/, {
    'itemList|1-5': [{
      'noticeId|+1': 10,
      'content': Mock.mock('@cparagraph()'),
      'linkUrl': Mock.mock('@url')
    }]
  })
  Mock.mock(/\/home\/goodsList/, {
    'itemList|1-15': [{
      'id|+1': 102,
      // 'name': Mock.mock('@ctitle()'),
      'name|+1': Mock.mock('@string(矿泉水好喝的牛奶桶装一方人20L超值农夫三拳喝完跳三万米,3,10)'),
      'price|8-100': 3,
      'imgurl': '../static/img/goods/0' + rdnBetween(1, 13) + '.jpg',
      'label': Mock.mock('@cword(2,4)'),
      'saleCount|1-1000': 0,
      'discountPrice|5-100': 1,
      // 'discountNote': Mock.mock('@cparagraph()'),
      'discountNote': Mock.mock('@string(最好喝的，没有之一。让人忘不了的味道，最实惠的就是这家的，诶，看过来啦。小伙子来一桶，夏日炎炎，葵科也需要的宝水呀，别错过呀,0,20)')
    }]
  })
  /*附近接口*/
  Mock.mock(/\/home\/shopsList/, {
    'itemList|1-15': [{
      'id|+1': 102,
      'name': '武汉市水一族加盟店',
      'price|8-100': 3,
      'imgurl': '../static/img/van.jpg',
      'labels': ['实体店铺', '官方认证', '金牌卖家'],
      'saleCount|1-1000': 0,
      'score|1-5': 0,
      'note': '买十桶送一桶',
      'distance|+1': Mock.mock('@float(0.2, 2, 0, 2)'),
      'dispatchTime|+1': 10,
      'isSleep|1-2': true,
      'runStartTime': '09:00',
      'runEndTime': '22:30'
    }]
  })
  /*水票接口*/
  Mock.mock(/\/home\/tickets/, {
    'itemList|1-100': [{
      'id|+1': 102,
      'name': '武汉市水一族加盟店',
      'price|8-100': 3,
      'retailPrice|8-100': 10,
      'imgurl': '../static/img/ticket.png',
      'labels': ['实体店铺', '官方认证', '金牌卖家'],
      'saleCount|1-1000': 0,
      'score|1-5': 0,
      'note': Mock.mock('@csentence'),
      'count': 10,
      'dispatchTime|+1': 10
    }]
  })
  /*订单接口*/
  Mock.mock(/\/home\/order/, {
    'itemList|1-20': [{
      'id|+1': 20,
      'orderNumber|+1': Mock.Random.id(),
      'sellerName': '武汉市水一族加盟店',
      'productName': '农夫山泉20桶一季度',
      'price': 500,
      'unitPrice': 25,
      'buyCount': 20,
      // -1：已取消，0：待支付，1：待派送，2：派送中，3：待评价，4：已完成
      'status': rdnFromArr([-1, 0, 1, 2, 3, 4]),
      'imgurl': '../static/img/goods/02.jpg',
      'total': 455,
      'info': '买10桶送3桶',
      'label': Mock.mock('@cword(2,4)'),
      //type=1时是减钱，=0是加钱
      'extras': [{
        type: 1,
        name: '首单减免',
        value: '10'
      }, {
        type: 1,
        name: '优惠券抵扣',
        value: '50'
      }, {
        type: 0,
        name: '上楼费',
        value: '15'
      }]
    }]
  })
})()
