/**
 * Created by Chin on 2017/7/29.
 */
import Mock from 'mockjs'
export default (function () {
  var rdnBetween = function (start, end) {
    return Math.floor(Math.random() * (end - start) + start)
  }
  /*首页接口*/
  Mock.mock(/\/home\/banner/, {
    'itemList|1-4': [{
      'id|+1': 1,
      'image': '../static/img/banner/p0' + rdnBetween(1, 5) + '.jpg',
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
     'itemList|1-20': [{
      'id|+1': 102,
      // 'name': Mock.mock('@ctitle()'),
      'name|+1': Mock.mock('@string(矿泉水好喝的牛奶桶装一方人20L超值农夫三拳喝完跳三万米,3,10)'),
      'price|8-100': 3,
      'imgurl': '../static/img/goods/0' + rdnBetween(1, 5) + '.jpg',
      // 'label': Mock.mock('@cword(2,4)'),
      'label': Mock.mock('@string(矿泉水好喝的牛奶桶装一方人20L超值农夫三拳喝完跳三万米,3,10)'),
      'saleCount|1-1000': 0,
      'discountPrice|5-100': 1,
      // 'discountNote': Mock.mock('@cparagraph()'),
      'discountNote': Mock.mock('@string(最好喝的，没有之一。让人忘不了的味道，最实惠的就是这家的，诶，看过来啦。小伙子来一桶，夏日炎炎，葵科也需要的宝水呀，别错过呀,0,20)')
    }]
  })
})()
