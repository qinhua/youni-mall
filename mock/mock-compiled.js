/**
 * Created by Chin on 2017/7/29.
 */
import Mock from 'mockjs';
export default (function () {
  var rdnBetween = function rdnBetween(start, end) {
    return Math.floor(Math.random() * (end - start) + start);
  };
  /*首页接口*/
  Mock.mock(/\/home\/banner/, {
    'itemList|1-4': [{
      'id|+1': 1,
      'image': '../static/img/banner/p0' + rdnBetween(1, 5) + '.jpg',
      'linkUrl': Mock.mock('@url')
    }]
  });
  Mock.mock(/\/home\/topNotice/, {
    'itemList|1-5': [{
      'noticeId|+1': 10,
      'content': Mock.mock('@cparagraph()'),
      'linkUrl': Mock.mock('@url')
    }]
  });
  Mock.mock(/\/home\/goodsList/, {
    /* 'itemList|1-20': [{
      'id|+1': 102,
      // 'name': Mock.mock('@ctitle()'),
      'name|+1': Mock.mock('@string(矿泉水好喝的牛奶桶装一方人20L超值农夫三拳喝完跳三万米,3,10)'),
      'price|8-100': 3,
      'imgurl': '../static/img/goods/p0' + rdnBetween(1, 5) + '.jpg',
      // 'label': Mock.mock('@cword(2,4)'),
      'label': Mock.mock('@string(矿泉水好喝的牛奶桶装一方人20L超值农夫三拳喝完跳三万米,3,10)'),
      'saleCount|1-1000': 0,
      'discountPrice|5-100': 1,
      // 'discountNote': Mock.mock('@cparagraph()'),
      'discountNote': Mock.mock('@string(最好喝的，没有之一。让人忘不了的味道，最实惠的就是这家的，诶，看过来啦。小伙子来一桶，夏日炎炎，葵科也需要的宝水呀，别错过呀,0,20)')
    }] */
    'itemList': [{ "id": 0, "title": "11111", "cont": "111111" }, { "id": 1, "title": "22222", "cont": "111111" }, { "id": 2, "title": "33333", "cont": "111111" }, { "id": 3, "title": "44444", "cont": "111111" }, { "id": 4, "title": "55555", "cont": "55555" }, { "id": 5, "title": "66666", "cont": "66666" }, { "id": 6, "title": "77777", "cont": "77777" }, { "id": 7, "title": "77777", "cont": "88888" }, { "id": 8, "title": "888888", "cont": "999999" }, { "id": 9, "title": "000000", "cont": "99999" }, { "id": 10, "title": "a88888", "cont": "99999" }, { "id": 11, "title": "a22222", "cont": "111111" }, { "id": 12, "title": "a33333", "cont": "111111" }, { "id": 13, "title": "a44444", "cont": "111111" }, { "id": 14, "title": "a55555", "cont": "55555" }, { "id": 15, "title": "a66666", "cont": "66666" }, { "id": 16, "title": "a77777", "cont": "77777" }, { "id": 17, "title": "a77777", "cont": "88888" }, { "id": 18, "title": "a888888", "cont": "999999" }, { "id": 19, "title": "a000000", "cont": "99999" }, { "id": 20, "title": "a88888", "cont": "99999" }]
  });
})();

//# sourceMappingURL=mock-compiled.js.map