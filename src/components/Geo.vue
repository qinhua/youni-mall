<template>
  <div :class="['geo-container',!visible ? 'hidden' :'']">
    <div id="geo-map"></div>
    <div id="tip">
      <div id="info">初始化加载地图时，center及level属性缺省，地图默认显示用户所在城市范围</div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let vm
  export default {
    name: 'geo',
    data() {
      return {
        geoData: null
      }
    },
    props: {
      cache: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: false
      },
      timeout: {
        type: Number,
        default: 8000
      },
      events: {
        type: Object
      }
    },
    beforeMount() {
    },
    mounted() {
      vm = this
      vm.initGeo()
      /*vm.$nextTick(function () {})*/
    },
    /*computed: {},*/
    /*watch: {},*/
    methods: {
      /*浏览器定位*/
      initGeo() {
        /***** 由于Chrome、IOS10等已不再支持非安全域的浏览器定位请求，为保证定位成功率和精度，请尽快升级您的站点到HTTPS。******/
        // 是否启用缓存
        if (vm.cache) {
          if (me.sessions.get('cur5656Geo')) {
            vm.$emit('on-geo-end', JSON.parse(me.sessions.get('cur5656Geo')))
            return
          }
        } else {
          me.sessions.remove('cur5656Geo')
        }

        // 01.加载地图
        var map, geolocation, citysearch
        map = new AMap.Map('geo-map', {
          resizeEnable: true
        })

        // 02.调用定位服务
        setTimeout(function () {
          var tips = document.getElementById("tip")
          try {
            /* 浏览器定位 */
            function geoByBrowser() {
              // 解析定位结果
              var onComplete = function (data) {
                if (!data.formattedAddress) {
                  geoByIp()
                  return
                }
                // console.log(data, '来自浏览器定位')
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
                vm.cache ? me.sessions.set('cur5656Geo', JSON.stringify(tmp)) : null
                vm.$emit('on-geo-end', tmp)
                vm.geoData = data
                var str = ['定位成功']
                str.push('经度：' + data.position.getLng())
                str.push('纬度：' + data.position.getLat())
                if (data.accuracy) {
                  str.push('精度：' + data.accuracy + ' 米')
                }
                // 如为IP精确定位结果则没有精度信息
                str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'))
                tips.innerHTML = str.join('<br>')
              }

              // 解析定位错误信息
              var onError = function (data) {
                geoByIp()
                // tips.innerHTML = '定位失败'
                // vm.$emit('on-geo-end', data)
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
                var tmpLnglat=[]
                for (var i in data.bounds) {
                  if(data.bounds.hasOwnProperty(i)){
                    tmpLnglat=[data.bounds[i].lng,data.bounds[i].lat]
                  }
                }
                var tmp = {
                  source: 'ip',
                  address: data.province+data.city,
                  province: data.province,
                  city: data.city,
                  provinceCode: null,
                  cityCode: data.adcode,
                  lng: tmpLnglat[0],
                  lat: tmpLnglat[1]
                }
                vm.cache ? me.sessions.set('cur5656Geo', JSON.stringify(tmp)) : null
                vm.$emit('on-geo-end', tmp)
                vm.geoData = data
                var str = ['定位成功']
                str.push('经度：' + tmpLnglat[0])
                str.push('纬度：' + tmpLnglat[1])
                tips.innerHTML = str.join('<br>')
              }

              // 解析定位错误信息
              var onError = function (data) {
                tips.innerHTML = '定位失败'
                vm.$emit('on-geo-end', data)
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
        }, 0)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>

  .geo-container {
    width: 100%;
    height: 100%;
    &.hidden {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
      #tip{
        display: none;
      }
    }
    .amap-logo, .amap-copyright {
      display: none !important;
    }
    #geo-map {
      width: 100%;
      height: 100%;
    }
    #tip {
      -webkit-box-sizing:border-box;
      box-sizing:border-box;
      position: absolute;
      right: 10px;
      left: 10px;
      top: 20px;
      width: auto;
      padding: 10px;
      font-size: 12px;
      border-radius: 3px;
      line-height: 1.5;
      color:#fff;
      background: rgba(0,0,0,.6);
      border: 1px solid #969696;
    }
  }

</style>
