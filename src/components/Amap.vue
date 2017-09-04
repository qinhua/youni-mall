<template>
  <div :class="['map-container',!visible?'hidden':'']">
    <!-- 地图容器 -->
    <div id="my-map"></div>
    <!-- 搜索框-->
    <div id="searchBox">
      <div class="wrap">
        <i>●</i>
        <input id="tipinput" type="text" placeholder="您在哪儿"/>
        <div id="clearSearchBtn">
          <div class="del">&#10005;</div>
        </div>
        <div id="sureBtn"><i class="fa fa-arrow-right"></i></div>
      </div>
    </div>
    <!-- 搜索结果面板 -->
    <div id="panel" class="hidden">
      <!-- 隐藏按钮 -->
      <a id="showHideBtn"></a>
      <div id="emptyTip">没有内容！</div>
      <!-- 搜索结果列表 -->
      <div id="poiList"></div>
    </div>
    <!-- loading -->
    <div id="loader"></div>
    <!-- 固定的marker -->
    <div class="my-marker"></div>
    <!--<div id="tip"></div>-->
  </div>
</template>

<script>
  /* eslint-disable */
  let vm
  import $ from 'jquery'

  export default {
    name: 'amap',
    data() {
      return {
        isPageMode: false,
        lastPage: '',
        currentPoint: null,
        geoData: null
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      /*tools: {
       type: Array,
       default: ['ToolBar', 'Geolocation']
       },*/
      events: {
        type: Object
      }
    },
    // beforeMount() {},
    mounted() {
      vm = this
      vm.$nextTick(function () {
        vm.initMap()
      })
    },
    // computed: {},
    watch: {
      '$route'(to, from) {
        vm.initMap()
      },
      visible(){
        vm.initMap()
      }
    },
    methods: {
      initMap () {
        /* 判断当前是页面模式还是组件模式 */
        if (vm.$route.query.path) {
          vm.isPageMode = true
          vm.lastPage = vm.$route.query.path
        } else {
          vm.isPageMode = false
          vm.lastPage = ''
        }

        /* 结束后的操作 */
        var finished=function(data){
          if (vm.isPageMode) {
            me.locals.set('cur5656Position', JSON.stringify(data));
            vm.lastPage ? vm.$router.push({path: vm.lastPage}) : vm.$router.back()
          } else {
            vm.$emit('on-receive-data', data)
          }
        }

        var inputer = document.getElementById("tipinput")
        var btnClear = document.getElementById("clearSearchBtn")
        var btnSure = document.getElementById("sureBtn")
        var $panel = $('#panel')
        var map = new AMap.Map("my-map", {
          zoom: 16,
          scrollWheel: false,
          resizeEnable: true
        })
        map.on('complete', function () {
          // document.getElementById('tip').innerHTML = "地图图块加载完毕！当前地图中心点为：" + map.getCenter()

          /*监听input内容*/
          inputer.addEventListener('input', function () {
            if (this.value) {
              btnClear.classList.add('show')
            } else {
              btnClear.classList.remove('show')
            }
          }, false)
          btnSure.addEventListener('click', function () {
            var lastObj
            if (vm.currentPoint) {
              lastObj = {
                lat: vm.currentPoint.lat,
                lng: vm.currentPoint.lng,
                name: inputer.value
              }
            }
            console.log('%c当前地图中心点数据:'+JSON.stringify(lastObj),'color:green,font-size:18px')
            finished(lastObj)
          }, false)
          btnClear.addEventListener('click', function () {
            // 清除搜索框内容
            inputer.value = ''
            btnClear.classList.remove('show')
            try {
              // 清除结果列表
              placeSearch.clear()
              $panel.addClass('hidden')
              checkPoiList()
            } catch (e) {
              console.log(e)
            }
          }, false)

          /*逆向地理编码*/
          var geocoder_CallBack = function (data) {
            var address = data.regeocode.formattedAddress //返回地址描述
            inputer.value = address
            btnClear.classList.add('show')
          }
          var regeocoder = function (lnglatXY) {  //逆地理编码
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            })
            geocoder.getAddress(lnglatXY, function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result)
              }
            })
            /*var marker = new AMap.Marker({  //加点
             map: map,
             position: lnglatXY
             })
             map.setFitView()*/
          }

          map.on('dragstart', function () {
            map.clearMap()
          })
          map.on('dragend', function () {
            // marker.setPosition(map.getCenter())
            /* map.getCity(function (data) {
             if (data['province'] && typeof data['province'] === 'string') {
             console.log('城市：' + (data['city'] || data['province']))*/
            vm.currentPoint = map.getCenter()
            console.log('%c' + vm.currentPoint, 'color:darkred;font-size:20px')
            regeocoder(vm.currentPoint)

            // 自定义搜索
            /* placeSearch.search(document.getElementById("tip").innerHTML, function (status, result) {
             console.log(status, result)
             $panel.removeClass('hidden')
             })
             placeSearch.searchmap.getBounds()
             }
             })*/
          })

          /*加载插件*/
          map.plugin(['AMap.ToolBar', 'AMap.Geolocation', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.CitySearch', 'AMap.Geocoder'], function () {
            // map.addControl(new AMap.Geolocation())
            map.addControl(new AMap.ToolBar())
            // map.addControl(new AMap.PlaceSearch())
            map.addControl(new AMap.MapType())
            // map.addControl(new AMap.Autocomplete())
            map.addControl(new AMap.CitySearch())
          })


          setTimeout(function () {

            /*01.定位*/
            try {
              var geolocation, citysearch
              inputer.value = '定位中…'
              /* 浏览器定位 */
              function geoByBrowser() {
                // 解析定位结果
                var onComplete = function (data) {
                  if (!data.formattedAddress) {
                    geoByIp()
                    return
                  }
                  console.log(data, '来自浏览器定位')
                  var tmp = {
                    source: 'browser',
                    address: data.formattedAddress,
                    province: data.addressComponent.province,
                    city: data.addressComponent.city,
                    provinceCode: data.addressComponent.citycode,
                    cityCode: data.addressComponent.adcode,
                    lng: data.position.lng,
                    lat: data.position.lat
                  }
                  // vm.cache ? me.sessions.set('cur5656Position', JSON.stringify(tmp)) : null
                  inputer.value = tmp.address
                  vm.geoData = tmp
                  vm.currentPoint = {
                    lat: tmp.lat,
                    lng: tmp.lng,
                    name: tmp.address
                  }
                  btnClear.classList.add('show')
                }

                // 解析定位错误信息
                var onError = function (data) {
                  inputer.value = '定位失败'
                  btnClear.classList.add('show')
                }

                map.plugin('AMap.Geolocation', function () {
                  geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: vm.timeout, // 超过指定时间后停止定位，默认：8s/无穷大
                    buttonOffset: new AMap.Pixel(10, 20),// 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'RB'
                  })
                  map.addControl(geolocation)
                  geolocation.getCurrentPosition()
                  AMap.event.addListener(geolocation, 'complete', onComplete)//返回定位信息
                  AMap.event.addListener(geolocation, 'error', onError)      //返回定位出错信息
                })
              }

              /* ip定位 */
              function geoByIp() {
                // 解析定位结果
                var onComplete = function (data) {
                  // console.log(data, '来自ip定位')
                  // 取出经纬度
                  var tmpLnglat = []
                  for (var i in data.bounds) {
                    if (data.bounds.hasOwnProperty(i)) {
                      tmpLnglat = [data.bounds[i].lng, data.bounds[i].lat]
                    }
                  }
                  var tmp = {
                    source: 'ip',
                    address: data.province + data.city,
                    province: data.province,
                    city: data.city,
                    provinceCode: null,
                    cityCode: data.adcode,
                    lng: tmpLnglat[0],
                    lat: tmpLnglat[1]
                  }
                  // vm.cache ? me.sessions.set('cur5656Position', JSON.stringify(tmp)) : null
                  inputer.value = tmp.address
                  vm.geoData = tmp
                  vm.currentPoint = {
                    lat: tmp.lat,
                    lng: tmp.lng,
                    name: tmp.address
                  }
                  btnClear.classList.add('show')
                }

                // 解析定位错误信息
                var onError = function (data) {
                  inputer.value = '定位失败'
                  btnClear.classList.add('show')
                }

                map.plugin('AMap.CitySearch', function () {
                  citysearch = new AMap.CitySearch({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: vm.timeout, // 超过指定时间后停止定位，默认：8s/无穷大
                    buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'RB'
                  })
                  map.addControl(citysearch)
                  // 自动获取用户IP，返回当前城市
                  citysearch.getLocalCity(function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                      if (result && result.city && result.bounds) {
                        var cityinfo = result.city
                        var citybounds = result.bounds
                        // 地图显示当前城市
                        map.setBounds(citybounds)
                      }
                    }
                  })
                  AMap.event.addListener(citysearch, 'complete', onComplete) // 返回定位信息
                  AMap.event.addListener(citysearch, 'error', onError) //返回定位出错信息
                })
              }

              geoByBrowser()
            } catch (e) {
              console.log(e)
            }

            /*02.搜索功能*/
            try {
              // 输入提示
              var auto = new AMap.Autocomplete({
                input: "tipinput"
              })
              // POI搜索
              var placeSearch = new AMap.PlaceSearch({
                map: map,
                pageSize: 5,
                pageIndex: 1,
                city: '', //城市
                panel: 'poiList'
              })
              var checkPoiList = function () {
                $panel.toggleClass('empty', !($.trim($('#poiList').html())))
              }
              var select = function (e) {
                // 设置搜索的城市
                placeSearch.setCity(e.poi.adcode)
                // 检查结果列表是否为空， 为空时显示必要的提示，即#emptyTip
                checkPoiList()
                // 监听搜索列表的渲染完成事件
                AMap.event.addListener(placeSearch, 'renderComplete', function () {
                  checkPoiList()
                })
                // 监听marker/列表的选中事件
                AMap.event.addListener(placeSearch, 'selectChanged', function (results) {
                  // 获取当前选中的结果数据
                  console.log(results.selected.data)
                  // me.locals.set('cur5656Position', JSON.stringify(results.selected.data))
                  // vm.lastPage ? vm.$router.push({path: vm.lastPage}) : vm.$router.back()
                  var lastObj = {
                    lat: results.selected.data.location.lat,
                    lng: results.selected.data.location.lng,
                    name: results.selected.data.name
                  }
                  $panel.toggleClass('hidden')
                  finished(lastObj)
                })
                // 开始搜索对应的poi名称
                placeSearch.search(e.poi.name, function (status, results) {
                  if (results.pois && results.pois.length > 0) {
                    $panel.toggleClass('empty')
                  }
                  // 显示结果列表
                  $panel.removeClass('hidden')
                  // 隐藏loading状态
                  $(document.body).removeClass('searching')
                })
                // 显示loading状态
                $(document.body).addClass('searching')
              }
              $('#showHideBtn').click(function () {
                $panel.toggleClass('hidden')
              })
              /*$('#clearSearchBtn').click(function () {
               // 清除搜索框内容
               inputer.value = ''
               btnClear.classList.remove('show')
               // 清除结果列表
               placeSearch.clear()
               $panel.addClass('hidden')
               checkPoiList()
               })*/
              // 自定义搜索
              /*placeSearch.search('武汉', function(status, result){
               console.log(status,result)
               })*/
              // 事件：
              var listenSearch = AMap.event.addListener(auto, "select", select) // 注册监听，当选中某条记录时会触发
              // AMap.event.removeListener(listenSearch) // 需要时这样移除

              /*/!*03.点标记*!/
               var marker = new AMap.Marker({
               icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
               // icon: "http://101.132.35.4/upload/images/29uogvj1qsgnbo86ttn7tna8b8.png",
               position: map.getCenter(),
               draggable: true,
               cursor: 'move',
               raiseOnDrag: true,
               // offset: new AMap.Pixel(-26, -13),
               })
               marker.setAnimation('AMAP_ANIMATION_NONE')
               marker.setMap(map)
               // var listenMarker = AMap.event.addListener(auto, "dragEnd", dragMarker) // 注册监听，当选中某条记录时会触发
               // AMap.event.removeListener(listenSearch) // 需要时这样移除*/
            } catch (e) {
              console.log(e)
            }

          }, 0)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    &.hidden {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
    }
    .amap-logo, .amap-copyright {
      display: none !important;
    }
    /*地图*/
    #my-map {
      width: 100%;
      height: 100%;
    }
    /*搜索框*/
    #searchBox {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      left: 14px;
      right: 14px;
      top: 14px;
      z-index: 999;
      height: 80/@rem;
      overflow: hidden;
      border-radius: 2px;
      box-shadow: 0 2px 10px 0 #bbb;
      .wrap {
        position: relative;
        width: 100%;
        height: 100%;
        > i {
          .block;
          .txt-normal;
          .abs-center-vertical;
          padding: 0 10px;
          height: 80/@rem;
          line-height: 80/@rem;
          color: #5aa9fb;
          font-size: 10px;
        }
        #tipinput {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 100%;
          height: 80/@rem;
          line-height: 80/@rem;
          font-size: 20/@rem;
          padding: 0 46px 0 26px;
          background: #fff;
          border: none;
        }
        #clearSearchBtn {
          .none;
          .abs-center-vertical;
          right: 45px;
          z-index: 20;
          .size(34, 34);
          line-height: 36/@rem;
          text-align: center;
          vertical-align: middle;
          font-size: 20/@rem;
          color: #999;
          .del {
            background: #eee;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          &.show {
            display: block;
          }
        }
        #sureBtn {
          .abs-center-vertical;
          right: 0;
          z-index: 20;
          width: 40px;
          height: 80/@rem;
          line-height: 80/@rem;
          text-align: center;
          background: #0b96fb;
          i {
            text-align: center;
            color: #fff;
          }
        }
      }
    }
    /*搜索列表*/
    #panel {
      position: fixed;
      width: 100%;
      height: auto;
      left: 0;
      bottom: 0;
      z-index: 200;
      overflow: visible;
      border-top: 1px solid #eee;
      -webkit-transition: all 0.2s;
      #emptyTip {
        display: none;
      }
      .amap_lib_placeSearch_page {
        background: #4e9ef1;
      }
      .amap_lib_placeSearch {
        .poibox {
          border-bottom: 1px solid #eee;
        }
        .pageLink {
          padding: 2px 3px;
          margin: 0 3px;
          font-size: 120%;
          color: #fff;
          background: #4e9ef1;
        }
      }
      &.empty {
        #emptyTip {
          display: block;
          position: relative;
          background: #fff;
          width: 100%;
          text-align: center;
          padding: 30px 0;
          color: #666;
        }
        #showHideBtn {
          opacity: 0.5;
        }
      }
      &.hidden {
        height: 0 !important;
        overflow: hidden;
        #showHideBtn {
          /*  top: -30px;*/
          &:after {
            /*  -webkit-transform: rotate(180deg);
           -webkit-transform-origin: 50% 4px;*/
            top: -5px;
            border-bottom-color: #ccc;
            border-top-color: transparent;
          }
        }
      }
      #showHideBtn {
        display: block;
        position: absolute;
        width: 63px;
        height: 32px;
        text-align: center;
        margin: 0 auto;
        left: 0;
        right: 0;
        top: -25px;
        &:before, &:after {
          content: "";
          width: 0;
          height: 0;
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          cursor: pointer;
        }
        &:before {
          width: 60px;
          height: 30px;
          background: rgba(255, 255, 255, 0.9);
          top: 0;
          border-radius: 30px 30px 0 0;
          border: 1px solid #ccc;
          border-bottom: 0;
        }
        &:after {
          content: "";
          top: 12px;
          border: 10px solid rgba(255, 0, 0, 0);
          z-index: 99999;
          border-top-color: #ccc;
          -webkit-transition: all 0.2s;
        }
      }
      #poiList {
        -webkit-overflow-scrolling: touch;
        width: 100%;
        height: 100%;
        overflow: scroll;
        position: relative;
        background: #fff;
        .amap_lib_placeSearch {
          border: none;
        }
        .poi-img {
          width: 90px;
          height: 48px;
        }
      }
      .searching {
        #clearSearchBtn {
          display: none;
        }
        #loader {
          display: block;
        }
        #page {
          filter: grayscale(1);
          opacity: 0.5;
        }
      }
      .poi-more {
        display: none !important;
      }
    }
    /*地图类型*/
    .amap-maptypecontrol {
      top: 72px;
      right: 13px;
      z-index: 10;
    }
    /*定位图标*/
    .amap-geolocation-con {
      right: auto;
      left: 10px;
      bottom: 30px !important;
      z-index: 100 !important;
    }
    /*缩放图标*/
    /*.amap-zoomcontrol{
      box-shadow: 0 2px 10px 0 #bbb;
    }*/
    /*固定的marker*/
    .my-marker {
      .abs-center-vh;
      z-index: 100;
      .rsize(20, 33);
      margin-top: -14px;
      background: url(../../static/img/marker.png) bottom center;
      .ele-base;
    }
    /* loader */
    #loader {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 1;
      margin: -75px 0 0 -75px;
      border: 16px solid #eee;
      border-radius: 50%;
      border-top: 16px solid #0b83ea;
      width: 120px;
      height: 120px;
      -webkit-animation: spin 2s linear infinite;
      animation: spin 2s linear infinite;
      display: none;
    }
    @-webkit-keyframes spin {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  /*联想列表*/
  .amap-sug-result {
    position: absolute !important;
    width: 93%;
    left: 14px;
    right: 14px;
    min-width: 0 !important;
    border: 1px solid #eee;
    box-shadow: 0 2px 10px 0 #bbb;
    .auto-item {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 4px 6px;
    }
  }

  #tip {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    color: #fff;
    background: rgba(0, 0, 0, .7);
  }

</style>
