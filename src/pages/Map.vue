<template>
  <div id="page">
    <!-- 地图容器 -->
    <div id="container" class="map" tabindex="0"></div>
    <!-- 搜索框-->
    <div id="searchBox">
      <input id="tipinput" type="input" placeholder="请输入关键字搜索"/>
      <div id="clearSearchBtn">
        <div class="del">&#10005;</div>
      </div>
    </div>
    <!-- 结果面板 -->
    <div id="panel" class="hidden">
      <!-- 隐藏按钮 -->
      <a id="showHideBtn"></a>
      <div id="emptyTip">没有内容！</div>
      <!--搜索结果列表 -->
      <div id="poiList">
      </div>
    </div>
    <!-- loading -->
    <div id="loader"></div>
    <!--<div id='right'>-->
      <!--<div>-->
        <!--<div class='title'>选择模式</div>-->
        <!--<input type='radio' name='mode' value='dragMap' checked>拖拽地图模式</input>-->
        <!--</br>-->
        <!--<input type='radio' name='mode' value='dragMarker'>拖拽Marker模式</input>-->
      <!--</div>-->
      <!--<div>-->
        <!--<button id='start'>开始选点</button>-->
        <!--<button id='stop'>关闭选点</button>-->
      <!--</div>-->
      <!--<div>-->
        <!--<div class='title'>选址结果</div>-->
        <!--<div class='c'>经纬度:</div>-->
        <!--<div id='lnglat'></div>-->
        <!--<div class='c'>地址:</div>-->
        <!--<div id='address'></div>-->
        <!--<div class='c'>最近的路口:</div>-->
        <!--<div id='nearestJunction'></div>-->
        <!--<div class='c'>最近的路:</div>-->
        <!--<div id='nearestRoad'></div>-->
        <!--<div class='c'>最近的POI:</div>-->
        <!--<div id='nearestPOI'></div>-->
      <!--</div>-->
    <!--</div>-->

  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  var me
  var vm
  import $ from 'zeptojs'
  export default {
    name: 'map',
    data () {
      return {}
    },
    components: {},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
        // 创建地图
        var map = new AMap.Map('container', {
          zoom: 9
          // center: [116.868549, 34.918187]
        })

        var positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: map
        })

        // 加载PlaceSearch和Autocomplete插件
        AMap.service(['AMap.PlaceSearch', 'AMap.Autocomplete'], function () {
          try {
            ready()
          } catch (e) {
            console.error(e)
          }
        })

        function ready () {
          // 搜索框支持自动完成提示
          var auto = new AMap.Autocomplete({
            input: 'tipinput'
          })

          // 构造地点查询类
          var placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            map: map,
            panel: 'poiList'
          })

          // 监听搜索框的提示选中事件
          AMap.event.addListener(auto, 'select', function (e) {
            // 设置搜索的城市
            placeSearch.setCity(e.poi.adcode)
            // 开始搜索对应的poi名称
            placeSearch.search(e.poi.name, function (status, results) {
              if (results.pois && results.pois.length > 0) {
                $('#panel').toggleClass('empty')
              }
              // 显示结果列表
              $('#panel').removeClass('hidden')
              // 隐藏loading状态
              $(document.body).removeClass('searching')
            })
            // 显示loading状态
            $(document.body).addClass('searching')
          })
          // 检查结果列表是否为空， 为空时显示必要的提示，即#emptyTip
          function checkPoiList () {
            $('#panel').toggleClass('empty', !($.trim($('#poiList').html())))
          }
          checkPoiList()
          // 监听搜索列表的渲染完成事件
          AMap.event.addListener(placeSearch, 'renderComplete', function () {
            checkPoiList()
          })
          // 监听marker/列表的选中事件
          AMap.event.addListener(placeSearch, 'selectChanged', function (results) {
            // 获取当前选中的结果数据
            console.log(results.selected.data)
            console.log(results.selected.data)
            me.locals.set('cur5656Position', JSON.stringify(results.selected.data))
            vm.$router.go(-1)
          })
          // -----------------------------------------------
//          var positionPicker = new PositionPicker({
//            mode: 'dragMap',
//            map: map
//          })
//          positionPicker.on('success', function (positionResult) {
//            try {
//              document.getElementById('lnglat').innerHTML = positionResult.position
//              document.getElementById('address').innerHTML = positionResult.address
//              document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction
//              document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad
//              document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI
//            } catch (e) {
//              console.error(e)
//            }
//          })
//          positionPicker.on('fail', function (positionResult) {
//            document.getElementById('lnglat').innerHTML = ' '
//            document.getElementById('address').innerHTML = ' '
//            document.getElementById('nearestJunction').innerHTML = ' '
//            document.getElementById('nearestRoad').innerHTML = ' '
//            document.getElementById('nearestPOI').innerHTML = ' '
//          })
//          var onModeChange = function (e) {
//            positionPicker.setMode(e.target.value)
//          }
//          var startButton = document.getElementById('start')
//          var stopButton = document.getElementById('stop')
//          var dragMapMode = document.getElementsByName('mode')[0]
//          var dragMarkerMode = document.getElementsByName('mode')[1]
//          AMap.event.addDomListener(startButton, 'click', function () {
//            positionPicker.start(map.getBounds().getSouthWest())
//          })
//          AMap.event.addDomListener(stopButton, 'click', function () {
//            positionPicker.stop()
//          })
//          AMap.event.addDomListener(dragMapMode, 'change', onModeChange)
//          AMap.event.addDomListener(dragMarkerMode, 'change', onModeChange)
//          positionPicker.start()
//          map.panBy(0, 1)
//
//          map.addControl(new AMap.ToolBar({
//            liteStyle: true
//          }))
          // --------------------------
          $('#showHideBtn').click(function () {
            $('#panel').toggleClass('hidden')
          })
          $('#clearSearchBtn').click(function () {
            // 清除搜索框内容
            $('#tipinput').val('')

            // 清除结果列表
            placeSearch.clear()
            $('#panel').addClass('hidden')
            checkPoiList()
          })
        }
      })
    },
    computed: {},
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      jumpTo (path, param) {
        this.$router.push({path: path + (param ? '/' + param : '')})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .my {
    padding-bottom: 150/@rem;
    .user-modal {
      .center;
      background: #5c70ff url(../../static/img/bg_user.jpg);
      .bg100;
      .user-inner {
        padding: 50/@rem 20/@rem 90/@rem;
        > img {
          .block;
          .size(130, 130);
          .ma-w(100);
          .ma-h(100);
          .ma;
          .bor(3px, solid, #fff);
          .borR(50%);
          box-shadow: 0 0 0 5px rgba(255, 255, 255, .4), 0 0 0 11px rgba(255, 255, 255, .2)
        }
        p {
          padding-top: 40/@rem;
          .fz(24);
          .cf;
          letter-spacing: 1px;
          i {
            padding-left: 10/@rem;
          }
        }
      }
    }
    .order-model {
      margin-top: -50/@rem;
      .center;
      .arc {
        height: 50/@rem;
        background: url(../../static/img/arc.png);
        -webkit-background-size: 100% auto;
        background-size: 100% auto;
      }
      .weui-grids {
        margin-top: -10/@rem;
        .bf;
        &:before, &:after {
          .none;
          .no-bor;
        }
      }
      .weui-grid {
        .pointer;
        padding: 8px 10px;
        &:before {
          top: 20px;
          bottom: 20px;
        }
        &:after {
          .none;
        }
      }
      label {
        .fz(24);
        .c9;
      }
      p {
        .fz(46);
        .cdiy(#212225);
      }
    }
    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
      .weui-cell {
        padding: 24/@rem !important;
        .fz(24) !important;
      }
    }
  }

  #right{
    .abs;
    top:0;
    .borBox;
    padding:100/@rem 50/@rem;
    pointer-events: none;
  }

  #page{
    .rel;
  }
  #panel{
    width: 100%;
    .abs;
    bottom:0;
    &.hidden{
      top:auto;
    }
  }
</style>
