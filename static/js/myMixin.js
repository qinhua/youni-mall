/* eslint-disable */
/**
 * Created by Chin on 2016/06/16
 */
import $ from 'jquery'

(function (global, factory) {

  "use strict";

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error("myMixin requires a window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }

// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  //"use strict";
  var myMixin = {
    isPosting: false, //重复提交标识
    postInit: function () {
      setTimeout(function () {
        myMixin.isPosting = false;
      }, 1000)
    },
    al: function (txt) {
      alert(txt);
    },
    lg: function (a, b, c) {
      if (b && c) {
        console.log(a, b, c);
        return;
      } else if (b) {
        console.log(a, b);
        return;
      }
      console.log(a);
    },
    // 当前环境：无需手动修改
    envir: (window.location.href.indexOf('http://localhost') !== -1 || window.location.href.indexOf('http://192.168') !== -1 ) ? 'develop' : 'online',
    // api请求前缀：无需手动修改
    apiBegin: {
      develop: 'http://192.168.2.142:8080',
      online: 'XXX'
    },
    // post接口：无需手动修改
    apiEnd: {
      /**
       * 提交数据
       */
      create: 'XXX',
      /**
       * 获取验证码
       * typeId: typeId
       * phone: 手机号
       */
      getSms: 'XXX',
      /**
       * 代理数据提交
       */
      proxy: 'XXX'
    },

    config: {
      type: 0,
      host: "http://192.168.0.91:8080",
      mainUrl: "XXX", //主页url
      defaultUrl: "",
      // 分享参数配置
      share: {
        pyq: 'XXX',
        title: 'XXX',
        description: 'XXXX',
        iconUrl: 'XXX',
        url: 'XXX'
      },
      template: {
        loading: '<div class="loader"><div class="loader-inner ball-beat"><div></div><div></div><div></div></div></div>',
        loadMore: '<div class="loadMore">点击加载更多…</div>',
        slideMore: '<p class="slideMore">上滑显示更多 ▲</p>',
        noData: '<div class="noData">这里啥都没有-_-!</div>',
        iconNoData: '<div class="iconNoData"><i></i><p>暂无内容</p></div>',
        noMoreData: '<div class="noMoreData">已无更多</div>'
      }
    },
    //
    //myMixin.checkStatus(function() {
    //    $(".loginbtn").text("注销"); //登陆状态下显示注销
    //    GetAll();
    //}, 0, false);

    /**
     * 数据加载
     * @param url 接口地址
     * @param params 参数
     * @param cb callback
     * @param method get or post
     * @param dataType json or jsonp
     * @param async true or false
     * @param beforeCb beforeSend callback
     * @param successCb successCb callback
     * @param errCb errCb callback
     */
    loadData: function (url, params, method, dataType, async, beforeCb, successCb, errCb) {
      $.ajax({
        type: method || 'GET',
        url: url,
        async: async || true,
        cache: false,
        //data: $.extend(params || '', {
        //  _r: typeof sign != "undefined" ? sign(1) : ''
        //}),
        data: params || '',
        dataType: dataType || 'JSON',
        beforeSend: function () {
          beforeCb && beforeCb();
        },
        success: function (data) {
          successCb && successCb(data);
        },
        error: function (err) {
          if (err && err.status == 200) {
            successCb && successCb(err);
            return
          }
          errCb && errCb(err);
        }
      });
    },
    /**
     * 点击加载更多
     * @param ele 触发元素
     * @param listEle 列表元素
     * @param cb 加载方法
     * @param pageSize 分页大小
     */
    loadMore: function (ele, listEle, cb, pageSize) {
      $(document).on("click", $(ele), function () {
        var curPage = ($(listEle).find("li").length) / pageSize;
        if (curPage >= 1) {
          cb(curPage + 1);
        }
        //else {
        //    $(".loadMore").remove();
        //    $(listEle).append(myMixin.config.template.noMoreData);
        //}
      })
    },

    /**
     * 摇一摇
     * @param thresholds
     * @param direction
     * @param callback
     */
    shake: function (thresholds, direction, callback) {
      var threshold = thresholds;
      var last_update = 0,
        lastArr = [];
      var x = 0,
        y = 0,
        z = 0,
        last_x = 0,
        last_y = 0,
        last_z = 0;

      var deviceMotionHandler = function (eventData) {
        //eventData.cancelBubble();
        var acceleration = eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime();
        if ((curTime - last_update) > 100) {
          var diffTime = curTime - last_update;
          last_update = curTime;
          x = acceleration.x;
          y = acceleration.y;
          z = acceleration.z;
          var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

          if (speed > threshold) {
            //alert("摇动了");
            if (callback) {
              delay ? setTimeout(function () {
                callback();
              }, delay) : callback();
            }
          }
          // last_x = x;
          // last_y = y;
          // last_z = z;
          lastArr[x, y, z];
        }
      };
      //绑定摇动事件
      this.loadEvent = function () {
        if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', deviceMotionHandler, false);
        }
      };
      //移除摇动事件
      this.detachEvent = function () {
        window.removeEventListener('devicemotion');
      };
      this.getLastData = function () {
        return lastArr;
      };
    },
    /**
     * 移动端hover效果
     * @param targetId 目标id
     * @param hoverCls hover类
     */
    hover: function (targetId, hoverCls) {
      var curObj = document.querySelector(targetId);
      curObj.addEventListener('touchstart', function () {
        this.className += hoverCls;
      }, false);
      curObj.addEventListener('touchend', function () {
        this.className = '';
      }, false);
    },
    //移动端click事件，若有input点击事件请勿使用
    attachClick: function () {
      if (typeof FastClick !== 'undefined' && myMixin.envir === 'online') {
        FastClick.attach(document.body);
      }
    },
    //表单验证
    chineseName: /^[\u4e00-\u9fa5]{2,6}$/,
    mobilePhone: /^(13|15|18|17)\d{9}$/,
    isHan: /^[\u4E00-\u9FA5]$/,
    isEnglish: /^[a-zA-Z]$/,
    hasHan: /[\u4E00-\u9FA5]/g,
    hasEnglish: /[a-zA-Z]/g,
    idNumber: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
    checkStr: function (str) {
      if (escape(str).indexOf("%u") != -1)
        alert("不能含有汉字");
      else if (str.match(/\D/) != null) {
        alert('不能含有字母');
      }
    },
    checkPhone: function (str) {
      str = str.trim();
      var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
      return (isPhone.test(str) || isMob.test(str)) ? true : false;
    },
    /**
     * 混淆字符串
     * @param str 字符串
     * @param mixStr 混淆字符
     * @param start 起点
     * @param end 终点
     */
    mixStr: function (str, mixStr, start, end) {
      mixStr = mixStr || "***";
      return str.replace(str.slice(start, end), mixStr)
    },
    /**
     * 事件统计
     * @param adsName
     * @param pageName
     * @param eventName
     */
    statistic: function (adsName, pageName, eventName) {
      setTimeout(function () {
        window.mcShare.Statistic.event(adsName + "（" + pageName + "）-" + eventName);
        //_hmt.push(['_trackEvent', adsName + '-' + pageName, eventName]);
      }, 50)
    },
    /**
     * 设置标题
     * @param str
     */
    setTitle: function (str) {
      document.title = str
    },
    /**
     * 设置分享
     * @param param 分享配置obj
     */
    setShare: function (param) {
      var sd = param || myMixin.config.share;
      setTimeout(function () {
        try {
          window.mcShare.shareWord(sd.pyq || sd.title, {
              title: sd.title,
              description: sd.description,
              iconUrl: sd.iconUrl,
              url: sd.url
            },
            function (status) {
              console.log(status)
            }
          );
        } catch (e) {
          console.log(e);
        }
      }, 100)
    },
    url: {
      prefix: location.protocol + "//",
      host: location.host,
      baseUrl: location.protocol + "//" + location.host + location.pathname,
      paramStr: location.search,
      hash: location.hash
    },

    // 获取地址栏hash
    getHash: function () {
      var hash = {};
      var HrefHasgParams = window.location.hash && window.location.hash.replace(/^\#/, '').split('&');

      for (var i = 0, len = HrefHasgParams.length; i < len; i++) {
        var sps = HrefHasgParams[i].split('=');
        hash[decodeURIComponent(sps[0])] = sps[1] ? decodeURIComponent(sps[1]) : '';
      }

      return hash;
    },

    /**
     * 获取地址栏参数
     * @returns obj
     */
    getURLParams: function () {
      var params = {};

      window.location.href.replace(/[#|?&]+([^=#|&]+)=([^#|&]*)/gi, function (m, key, value) {
        params[key] = decodeURIComponent(value);
      });
      return params;
    },
    // 获取本地存储的参数
    getLocalParams: function () {
      var paramsLocal = 'prmt-base-params';
      var bp = myMixin.locals.get(paramsLocal) || {};
      var urlParams = myMixin.getURLParams();
      var p;
      if (urlParams._version || urlParams._appName || urlParams._platform) {
        for (p in urlParams) {
          if (urlParams.hasOwnProperty(p)) {
            bp[p] = decodeURIComponent(urlParams[p]);
          }
        }
        myMixin.locals.set(paramsLocal, bp);
      }
      return bp;
    },
    // 对象转参数字符串
    param: function (obj, prefix) {
      var retData = [];
      for (var e in obj) {
        if (typeof obj[e] === 'object')
          for (var i = 0; i < obj[e].length; i++)
            retData.push(e + '=' + encodeURIComponent(obj[e][i]));
        else
          retData.push(e + '=' + encodeURIComponent(obj[e]));
      }
      return ( prefix || '' ) + retData.join('&');
    },
    /**
     * url编码
     * @param param
     * @param key
     * @param encode
     * @returns {string}
     */
    urlEncode: function (param, key, encode) {
      if (param == null) return '';
      var paramStr = '';
      var t = typeof(param);
      if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
      } else {
        for (var i in param) {
          var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
          paramStr += myMixin.urlEncode(param[i], k, encode);
        }
      }
      return paramStr;
    },
    /**
     * url解码
     * @param url
     * @returns {string}
     */
    urlDecode: function (url) {
      return decodeURIComponent(url);
    },

    // 获取浏览历史
    getHistory: function (callback) {
      // window.addEventListener('popstate', function(e) {
      callback ? callback() : null;
      return history.state;
      // }, false)
    },
    // 不刷新改变url地址
    setUrl: function (params, title, page) {
      var currentState = history.state;
      window.history.pushState(params, title, page);
    },
    // 重置url地址
    resetUrl: function (title, page) {
      var currentState = history.state;
      window.history.replaceState(null, title, page);
    },

    /**
     * url跳转
     * @param url
     */
    jumpTo: function (url, time, params) {
      var param = params || window.search || "";
      if (time) {
        setTimeout(function () {
          location.href = url + param;
        }, time);
      } else {
        location.href = url + param;
      }
    },
    // 返回某一页
    pageBack: function (pageNum, isRefresh) {
      if (history.length > 1) {
        isRefresh ? self.location = document.referrer : null;
        pageNum ? history.go(pageNum) : history.go(-1);
      }
    },
    openWin: function (url, title, h, w, t, l, tool, menu, scro, resize, loc, sta) {
      window.open(url, title, "height=" + h || 0 + ", width=" + w || 0 + ", top=" + h || 0 + "t, left=" + l || 0 + "+,toolbar=" + tool || 'no' + ", menubar=" + menu || 'no' + ", scrollbars=" + scro || 'no' + ", resizable=resize" + ", location=" + loc || 'no' + ", status=" + sta || 'no');
    },
    mesAray: ['提交中，请稍等', '提交成功', '提交失败, 请稍后再试', '请勿重复提交', '获取失败！'],
    lightPop: function (msg, autoHide) {
      var lightTimeOut = null; //弹出提示层
      var $fixedTip = $('#j-fixedTip');
      $fixedTip.length > 0 ? $fixedTip.html(msg) : $('body').append('<div id="j-fixedTip" class="fixedTip">' + msg + '</div>');
      $fixedTip.show();
      clearTimeout(lightTimeOut);
      if (autoHide === -1) return;
      lightTimeOut = setTimeout(function () {
        $("#j-fixedTip").hide();
      }, 2000);
    },
    //lightPop: function (msg) {
    //    var fixedTip = document.querySelector('#j-fixedTip');
    //    var poper = document.createElement("div");
    //    poper.id = "j-fixedTip";
    //    poper.className = "fixedTip";
    //    poper.innerHTML = msg;
    //    fixedTip ? fixedTip.innerHTML = msg : document.body.appendChild(poper);
    //    document.querySelector('#j-fixedTip').style.display = "block";
    //    clearTimeout(lightTimeOut);
    //    lightTimeOut = setTimeout(function () {
    //        document.querySelector('#j-fixedTip').style.display = "none";
    //    }, 1800);
    //},
    // 获取定位
    pos: {
      getPos: function () {
        $.ajax({
          type: 'GET',
          url: 'http://util.kakamobi.cn/h5/city-locate.htm',
          data: 'uuid=' + Math.random(),
          async: false,
          dataType: 'JSON',
          success: function (res) {
            if (res.success) {
              myMixin.pos.userIp = res.data.ip;
              myMixin.pos.userCity = res.data.cityName;
              myMixin.pos.userCityCode = res.data.cityCode;
              myMixin.pos.userProv = res.data.provinceName;
              myMixin.pos.userProvCode = res.data.provinceCode;
            }
          }
        });
      },
      userIp: null,
      userCity: null,
      userProv: null,
      userCityCode: null,
      userProvCode: null,
      curProv: null,
      curCity: null,
      curProvCode: null,
      curCityCode: null
    },

    //获取用户设备信息/默认参数
    getInfo: {
      navi: function () {
        var navis = {
          appCodeName: navigator.appCodeName,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          browserLanguage: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
          platform: navigator.platform,
          systemLanguage: navigator.systemLanguage,
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          product: navigator.product,
          vendor: navigator.vendor
        };
        return navis;
      },
      scr: function () {
        var scrs = {
          width: screen.width,
          height: screen.height
        };
        return scrs;
      },
      storeBp: function () {
        var token = "bps" + myMixin.config.type;
        if (!localStorage.getItem(token) || localStorage.getItem(token) === "{}") {
          localStorage.setItem(token, JSON.stringify(myMixin.getURLParams()));
        }
      },
      baseParas: function (obj) {
        var bp = {};
        var token = "bps" + myMixin.config.type;
        var urlParams = JSON.parse(localStorage.getItem(token));
        for (var p in urlParams) {
          if (urlParams.hasOwnProperty(p)) {
            bp[p] = decodeURIComponent(urlParams[p]);
          }
        }
        return bp;
      }
    },
    //ajax请求
    ajaxs: function (type, url, data, callback01, callback02, callback03, callback04) {
      $.ajax({
        type: type, //请求方式
        url: url, //请求的url地址
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步
        data: data, //参数值
        beforeSend: function () {
          //请求前的处理
          callback01();
        },
        success: function (req) {
          //请求成功时处理
          callback02(req);
        },
        complete: function (req) {
          //请求完成的处理
          callback03();
        },
        error: function (req) {
          //请求出错处理
          callback04(req);
        }
      });
    },
    //ajaxDef---jquery Deferred
    deferrsed: function (type, url, callback) {
      var getData = function () {
        return $.Deferred(function (dtd) {
          myMixin.ajaxs(type, url, data, 0, function () {
            dtd.resolve(data);
          }, 0, function () {
            dtd.reject(data);
          })
          return dtd.promise();
        });
      };

      getData().then(function (dtd) {
        callback ? callback() : null;
      })
    },
    //判断手机横竖屏状态：
    checkOrientation: function (callback01, callback02) {
      window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        if (window.orientation === 180 || window.orientation === 0) {
          //alert('竖屏状态！');
          callback01();
        }
        if (window.orientation === 90 || window.orientation === -90) {
          //alert('横屏状态！');
          callback02();
        }
      }, false);
    },
    //强制禁用屏幕旋转
    lockOrientation: function () {
      $(document).ready(function () {
        function reorient(e) {
          var portrait = (window.orientation % 180 == 0);
          $("body > div").css("-webkit-transform", !portrait ? "rotate(-90deg)" : "");
        }

        window.onorientationchange = reorient;
        window.setTimeout(reorient, 0);
      })
    },
    /**
     * 验证码按钮
     * @param time
     * @param ele
     */
    verCodeBtn: function (time, ele) {
      var timer = null;
      var secs = parseInt(time) || 60;
      var btn = typeof ele !== "string" ? ele : $(ele);
      btn.addClass("disabled").prop("disabled", true);
      myMixin.lightPop("已发送，注意查收短信！");
      !function beginCount() {
        if (secs >= 0) {
          btn.text(secs + 'S后再次获取');
          secs--;
        }
        timer = setTimeout(function () {
          beginCount();
          if (secs < 0) {
            btn.removeClass("disabled").text('获取验证码').prop("disabled", false);
            clearTimeout(timer);
            return;
          }
        }, 1000);
      }();
      //静态版
      //btn.addClass("disabled").text('1分钟后再次获取').prop("disabled", true);
      //myMixin.lightPop("已发送，注意查收短信！");
      //setTimeout(function () {
      //    btn.removeClass("disabled").text('获取验证码').prop("disabled", false);
      //}, secs * 1000);
    },

    /**
     * 显示/关闭弹窗
     */
    showPop: function (msg, cls, popHeight, cb, closeCb) {
      var popStr = '<div id="pop" class="pop ' + (cls || '') + '">' +
        '<div class="pop-out"><div class="pop-in fadeInUp"><div' + (popHeight ? 'style="max-height: ' + popHeight + 'px;' : '') + ' class="content ' + (popHeight ? 'overflow' : '') + '">' + msg + '</div><span class="js-closepop iconClose"><i>×</i></span></div></div></div>';
      $('body').append(popStr);
      var $pop = $('#pop');
      $pop.addClass('on');
      cb && cb();
      $(document).on('click', '#pop .js-closepop', function (e) {
        $('#pop').remove();
        closeCb && closeCb();
        e.stopPropagation();
      });
    },
    closePop: function (cb) {
      $('#pop').remove();
      cb && cb();
    },

    /**
     * 显示/关闭模态框
     * @param pop
     * @param mask
     * @constructor
     */
    AlertPop: function (pop, mask) {
      this.closeAlert = function () {
        pop.removeClass("alert-show");
        mask.fadeOut(100);
      };
      this.showAlert = function () {
        pop.addClass("alert-show");
        mask.fadeIn(100);
      };
    },
    //滑动到某处
    scroll: function (num, time) {
      var speed = (!time) ? 0 : time;
      $("body").animate({
        scrollTop: num
      }, speed);
    },
    /**
     * 返回顶部
     * @param trigger,触发元素
     */
    back2Top: function (trigger) {
      var clientH = document.documentElement.clientHeight;
      if (!trigger) {
        var ele = document.createElement("div");
        ele.id = "back2Top";
        document.body.appendChild(ele);
        trigger = $("#back2Top");
      }
      document.addEventListener('scroll', function (e) {
        setTimeout(function () {
          e.preventDefault();
          var scrollTop = document.body.scrollTop;
          if (scrollTop + clientH > clientH + 300) {
            //trigger.show();
            trigger.addClass("roll-in");
          } else {
            //trigger.hide();
            trigger.removeClass("roll-in");
          }
        }, 100)
      }, false);
      trigger.click(function () {
        $("body").animate({
          scrollTop: 0
        }, 300);
      });
    },
    //swiper通用配置
    swiper: {
      common: function (targetCls, direction) {
        if (typeof Swiper != 'undefined') {
          return new Swiper(targetCls || '.swiper-container', {
            // Optional parameters
            initialSlide: 1,
            //wrapperClass:'swiper-wrapper',
            iOSEdgeSwipeDetection: true,
            mousewheelControl: true,
            //touchAngle: 45,
            //threshold: 100,
            autoplay: 2000,
            //autoplayDisableOnInteraction : false,
            preventClicks: false,
            direction: direction ? 'vertical' : 'horizontal',
            autoResize: true,
            uniqueNavElements: true,
            //onlyExternal: true,
            //grabCursor: true,
            //loop: true,
            //effect: 'coverflow',
            //slidesPerView: 2,//最多展示数
            //centeredSlides: true,//居中
            //spaceBetween: 180,//间距
            //coverflow: {
            //    rotate: -0.5,
            //    depth: 20,
            //    modifier: 10,//可见的数量
            //    slideShadows: false//是否启用阴影
            //},
            //onInit: function (swiper) {
            //    var $page = $(swiper.slides[0]).find('.container');
            //    $page.addClass('page-animate');
            //    // 进场
            //    setTimeout(function () {
            //        pagesFn.page1 && pagesFn.page1.In && pagesFn.page1.In($page, 0, swiper);
            //    }, 1);
            //},
            //onSlideChangeEnd: function (swiper) {
            //    //if (mySwiper.isEnd) {
            //    //    $btnTry.add($btnNext).hide();
            //    //} else {
            //    //    $btnTry.add($btnNext).show();
            //    //}
            //},
            //onReachEnd: function (swiper) {
            //    //$btnTry.add($btnNext).hide();
            //}
          })
        }
      },
      marquee: function (targetCls, direction) {
        if (typeof Swiper != 'undefined') {
          return new Swiper(targetCls || '.swiper-container', {
            // Optional parameters
            initialSlide: 0,
            //wrapperClass:'swiper-wrapper',
            //iOSEdgeSwipeDetection: true,
            //mousewheelControl: true,
            autoplay: 1500,
            autoplayDisableOnInteraction: false,
            //threshold: 100,
            preventClicks: false,
            onlyExternal: true,
            direction: direction ? 'horizontal' : 'vertical',
            autoResize: true,
            uniqueNavElements: true,
            loop: true,
            //spaceBetween: 180
          });
        }
      }
    },
    Arrs: {
      /**
       * 简单数组排序
       * @param a
       * @param b
       * @returns {number}
       */
      //01.简单数组正序排列
      sortNumAray: function (a, b) {
        if (a < b) {
          return -1; // a排在b的前面
        } else if (a > b) {
          return 1; // a排在b的后面
        } else {
          return 0; // a和b的位置保持不变
        }
      },
      // 生成从1到指定值的数组
      generateArr: function (num) {
        var tmp = [];
        return (function () {
          tmp.unshift(num);
          num--;
          if (num > 0) {
            arguments.callee();
          }
          return tmp;
        }())
      },
      //02.数组随机排序
      rndArr: function (arr) {
        return arr.sort(function () {
          return Math.random() > 0.5 ? -1 : 1;
        });
      },
      shuffle: function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) ;
        return arr;
      },
      //03.随机从数组中取出一项
      getRnm: function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      },
      //04.数组去重
      uniqueArr: function (arr) {
        //排序数组，形成队列
        arr.sort(this.sortNumAray);

        //排序后，队尾向前对比，如果相同，删除队尾，依次类推
        function loop(Index) {
          if (Index >= 1) {
            if (arr[Index] === arr[Index - 1]) {
              arr.splice(Index, 1);
            }
            loop(Index - 1);
          }
        }

        loop(arr.length - 1);
        return arr;
      },
      liteArr: function (arr) {
        var tmp = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          if (tmp.indexOf(arr[i]) === -1) {
            tmp.unshift(arr[i])
          }
        }
        return tmp;
      },
      // 05.拷贝数组
      copyArr: function (arr, start, end) {
        if (start) {
          return arr.slice(start || 0, end);
        } else {
          return arr.concat();
        }
      },
      // 对象转数组
      toArray: function (obj) {
        var retData = [];
        for (var i = 0; i < obj.length; i++) {
          retData.push(obj[i]);
        }
        return retData;
      }
    },
    // 拷贝对象
    copyObj: function (obj, filter) {
      var b = {};
      for (var i in a) {
        if (filter) {
          if (obj.hasOwnProperty(filter)) {
            b[i] = a[i];
            delete b.filter;
          }
        }

        b[i] = a[i];
      }
      return b;
    },

    // 格式化json
    formateJson: function (json) {
      var i = 0,
        il = 0,
        tab = "    ",
        newJson = "",
        indentLevel = 0,
        inString = false,
        currentChar = null;

      for (i = 0, il = json.length; i < il; i += 1) {
        currentChar = json.charAt(i);

        switch (currentChar) {
          case '{':
          case '[':
            if (!inString) {
              newJson += currentChar + "\n" + repeat(tab, indentLevel + 1);
              indentLevel += 1;
            } else {
              newJson += currentChar;
            }
            break;
          case '}':
          case ']':
            if (!inString) {
              indentLevel -= 1;
              newJson += "\n" + repeat(tab, indentLevel) + currentChar;
            } else {
              newJson += currentChar;
            }
            break;
          case ',':
            if (!inString) {
              newJson += ",\n" + repeat(tab, indentLevel);
            } else {
              newJson += currentChar;
            }
            break;
          case ':':
            if (!inString) {
              newJson += ": ";
            } else {
              newJson += currentChar;
            }
            break;
          case ' ':
          case "\n":
          case "\t":
            if (inString) {
              newJson += currentChar;
            }
            break;
          case '"':
            if (i > 0 && json.charAt(i - 1) !== '\\') {
              inString = !inString;
            }
            newJson += currentChar;
            break;
          default:
            newJson += currentChar;
            break;
        }
      }
      return newJson;
    },

    /**
     * 生成随机数
     * @param start
     * @param end
     * @returns {number}
     */

    Rdn: {
      //01.生成从1到任意值的数字
      rdnTo: function (end) {
        return parseInt(Math.random() * end + 1)
      },
      //02.生成从任意值到任意值的数字
      rdnBetween: function (start, end) {
        return Math.floor(Math.random() * (end - start) + start);
      },
      //03.从数组中随机取出一些数（arr：原数组，len：需要取的个数）
      rdnFromArr: function (arr, len) {
        var tmpArr = [];
        if (len > 1) {
          var copys = arr.slice(0);
          for (var i = 0; i < len; i++) {
            var rdm = myMixin.Rdn.rdnBetween(0, copys.length);
            tmpArr.push(copys[rdm]);
            copys.splice(rdm, 1);
          }
        } else {
          tmpArr = arr[myMixin.Rdn.rdnBetween(0, arr.length)]
        }
        return me.isArray(tmpArr) ? tmpArr.sort() : tmpArr;
      },
      //04.生成从任意值开始的指定个数字
      rdnCustom: function (start, lens) {
        var arr = [];
        //给原始数组rdnArr赋值
        for (var i = 0; i < lens; i++) {
          arr[i] = i + start;
        }
        arr.sort(function () {
          return 0.5 - Math.random();
        });
        return arr;
      },

      /**
       * 生成随机增长的数字
       * @returns {string}
       */
      rdnCountUp: function (baseNum, ratio, limit) {
        var curNum, lastNum = parseInt(myMixin.locals.get("meLstAniNum") || baseNum);
        if (limit && (lastNum >= limit || 2000000)) {
          lastNum = 12000;
        }
        curNum = parseInt(lastNum + Math.random() * ratio);
        myMixin.locals.set("meLstAniNum", curNum);
        callback ? callback() : null;
        return curNum;
      },
      /**
       * 生成随机颜色
       * @returns {string}
       */
      rdmColor: function () {
        return "#" +
          (function (color) {
            return (color += "0123456789abcdef" [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
          })("");
      },

      /**
       * 生成随时间增长/递减的数字
       * @param start 起始时间
       * @param step threshold
       * @returns {number}
       */
      getFakeCount: function (startTime, threshold) {
        var threshold = threshold || 200;
        if (startTime) {
          var start = new Date(startTime) || new Date();
          var curTime = new Date();
          return parseInt((curTimyMixin.getTime() - start.getTime()) / threshold)
        } else {
          console.error("need a startPoint")
        }
      },
      /**
       * 生成随机报名数
       * @param timeInterval 时间间隔：如20，30等
       * @param storageName localStorage名称
       * @returns {number}
       */
      genSignUpNum: function (timeInterval, storageName) {
        var localTime = JSON.parse(localStorage.getItem(storageName));
        var tempTimeAray = new Date().getTime();

        var min = parseInt((new Date().getTime() - prmt.pubTime) / 6000);
        //间隔timeRange分钟数更新一次数据
        var timeRange = timeInterval;
        //生成一个随机数
        var ranNum = prmt.rdmNum(timeRange - 2, timeRange + 6);
        //最终的数字
        var increase = 0;

        //如果用户第二次进入页面：对比上次记录的时间和当前时间的差，如果大于随机数，则更新页面人数
        if (localTime) {
          var oldMin = parseInt((parseInt(localTime) - prmt.pubTime) / 6000);
          var newMin = parseInt((new Date().getTime() - parseInt(localTime)) / 6000);

          //如果localStorage记录的时间早于pubTime，则重新修改loc
          if (oldMin < 0 || newMin < 0) {
            localStorage.setItem(storageName, JSON.stringify(tempTimeAray));
          }

          if (newMin > ranNum) {
            increase = parseInt(min / timeRange);
            localStorage.setItem(storageName, JSON.stringify(tempTimeAray));
          } else {
            increase = parseInt(oldMin / timeRange);
          }
        } else {
          increase = parseInt(min / timeRange);
          localStorage.setItem(storageName, JSON.stringify(tempTimeAray));
        }

        //报名人数
        return increase;
      }

    },

    // 生成guid
    guid: function () {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    },
    isNumber: function (nums) {
      return !isNaN(Number(nums));
    },
    isLeapYear: function (year) {
      return new Date(year).isLeapYear();
    },
    formatTime: function (timeStr, fmt) {
      fmt = fmt || "yyyy-MM-dd HH:mm:ss";
      return new Date(timeStr).format(fmt);
    },
    /**
     *是否在app内部
     * @param clue
     * @returns {Array|{index: number, input: string}}
     */
    isOnline: navigator.onLine,
    isInApp: navigator.userAgent.toLowerCase().match(/mucang/i) ? true : false,
    isWeixin: !!window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i),
    isWeibo: !!window.navigator.userAgent.toLowerCase().match(/WeiBo/i),
    isQq: !!window.navigator.userAgent.toLowerCase().match(/QQ/i),
    isIos: (window.navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i)) ? true : false,
    isAndroid: (window.navigator.userAgent.toLowerCase().match(/android/i)) ? true : false,
    isIosOrAndroid: (window.navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i)) ? "ios" : (window.navigator.userAgent.toLowerCase().match(/android/i) ? "android" : "others"),
    //来自移动端还是PC端
    isFrom: function () {
      var userAgentInfo = navigator.userAgent;
      var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
      var flag = false;
      var v = 0;
      var source = '';
      for (v; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = true;
          break;
        }
      }
      if (flag) {
        source = "mobile";
      } else {
        source = "web";
      }
      return source;
    },
    // 判断是否为隐私模式
    isPrivacyMode: function () {
      var testV = +new Date();
      var result = false;
      try {
        localStorage.setItem('checkStealth', testV);
        if (localStorage.getItem('checkStealth') != testV) {
          result = true;
        }
      } catch (e) {
        result = true;
      }
      return result;
    },

    /**
     * 本地存储LocalStorage
     */
    locals: {
      set: function (name, data) {
        if (typeof data === "object") {
          localStorage.setItem(name, JSON.stringify(data));
        } else {
          localStorage.setItem(name, data);
        }
      },
      get: function (name, isObj) {
        var ld = localStorage.getItem(name);
        return isObj ? ((ld && ld !== "{}") ? JSON.parse(ld) : '') : ((ld && ld !== "{}") ? ld : "");
      },
      remove: function (name) {
        localStorage.removeItem(name);
      },
      clear: function () {
        localStorage.clear();
      },
      //检查是否有指定字段
      check: function (name, callback01, callback02) {
        var vals = localStorage.getItem(name);
        if (!vals) {
          // 有记录
          callback01 ? callback01() : null;
        } else {
          // 无记录
          callback02 ? callback02() : null;
        }
      }
    },
    /**
     * 本地存储SessionStorage
     */
    sessions: {
      set: function (name, data) {
        if (typeof data === "object") {
          sessionStorage.setItem(name, JSON.stringify(data));
        } else {
          sessionStorage.setItem(name, data);
        }
      },
      get: function (name, isObj) {
        var ld = sessionStorage.getItem(name);
        return isObj ? ((ld && ld !== "{}") ? JSON.parse(ld) : '') : ((ld && ld !== "{}") ? ld : "");
      },
      remove: function (name) {
        sessionStorage.removeItem(name);
      },
      clear: function () {
        sessionStorage.clear();
      },
      //检查是否有指定字段
      check: function (name, callback01, callback02) {
        var vals = sessionStorage.getItem(name);
        if (!vals) {
          // 有记录
          callback01 ? callback01() : null;
        } else {
          // 无记录
          callback02 ? callback02() : null;
        }
      }
    },
    /**
     * 本地存储Cookies
     */
    cookies: {
      set: function (name, value, expireHours) {
        var cookieString;
        if (typeof value === "object") {
          cookieString = name + "=" + JSON.stringify(value);
        } else {
          cookieString = name + "=" + escape(value);
        }
        //判断是否设置过期时间
        if (expireHours > 0) {
          var date = new Date();
          date.setTime(date.getTime + expireHours * 3600 * 1000);
          cookieString = cookieString + "; expire=" + date.toGMTString();
        }
        document.cookie = cookieString;
      },
      get: function (name, isObj) {
        if (document.cookie.length > 0) {
          var c_start, c_end, lc = document.cookie;
          if (name && lc.indexOf("v2xss") === -1) {
            c_start = lc.indexOf(name + "=");
            if (c_start != -1) {
              c_start = c_start + name.length + 1;
              c_end = lc.indexOf(";", c_start);
              if (c_end == -1) c_end = lc.length;
              var llc = lc.substring(c_start, c_end);
              return isObj ? ((llc && llc !== "{}") ? JSON.parse(llc) : '') : ((llc && llc !== "{}") || "");
            }
          } else {
            return unescape(lc);
          }
        }
        return ""
      },
      del: function (name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=v2xss; expire=" + date.toGMTString();
      },
      //检查是否有指定cookie
      check: function (name, callback01, callback02) {
        var strs = myMixin.cookies.get(name);
        if (strs != null && strs != "") {
          // 有记录
          console.log("存在记录为：" + name + "的cookie");
          callback01 ? callback01() : null;
        } else {
          // 无记录
          console.log("不存在记录为：" + name + "的cookie");
          callback02 ? callback02() : null;
        }
      }
    },

    /**
     * 微信授权
     * name值最好每个新项目都改个不同的名字
     */
    weixinAuth: function (success) {
      var USERINFO = {};
      var Storage = {
        name: "_html5.xxx.authData",
        get: function () {
          var stora = window.localStorage.getItem(Storage.name);
          if (!stora) return undefined;
          stora = JSON.parse(stora);
          return stora;
        },
        set: function (val) {
          window.localStorage.setItem(Storage.name, JSON.stringify(val));
        }
      };

      var authData = Storage.get();
      if (authData && authData.openid.length > 6) {
        USERINFO = authData;
        success();
      } else {
        window.mcShare.weixinAuthBase(function (obj) {
          USERINFO = obj;
          if (USERINFO && USERINFO.openid) {
            Storage.set(obj);
          }
          success();
        });
      }
    },
    getWxOpenId: function () {
      window.mcShare.weixinAuth(function (info) {
        return (info && info.openid) ? info.openid : "";
      })
    },
    // 计算时间消耗
    timeCost: function (cb, alias) {
      console.time(alias);
      cb ? cb() : null;
      console.timeEnd(alias);
    },
    //时间戳转时间
    getLocalTime: function (nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    },
    // 字节
    byte: function (data) {
      if (typeof data === 'number') {
        if (data < 1024) {
          return data + 'B';
        } else if (data >= 1024 && data < 1048576) {
          data = data / 1024;
          return data.toFixed(2) + 'KB';
        } else if (data >= 1048576 && data < 1073741824) {
          data = data / 1048576;
          return data.toFixed(2) + 'MB';
        } else if (data >= 1073741824 && data < 1099511627776) {
          data = data / 1073741824;
          return data.toFixed(2) + 'GB';
        } else {
          data = data / 1099511627776;
          return data.toFixed(2) + 'TB';
        }
      } else {
        return data;
      }
    },
    //1476012477000 to 2016 19:27:57
    formatDate: function (now, isHans, level) {
      level = level || 3;
      var data = new Date(now);
      var year = data.getFullYear();
      var month = data.getMonth() + 1;
      var date = data.getDate();
      var hour = data.getHours();
      var minute = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
      var second = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
      if (level === 1) {
        return isHans ? year + "年" + month + "月" + date + "日" : year + "-" + month + "-" + date;
      }
      if (level === 2) {
        return isHans ? year + "年" + month + "月" + date + "日" + " " + hour + "点" + minute + "分" : year + "-" + month + "-" + date + " " + hour + ":" + minute;
      }
      if (level === 3) {
        return isHans ? year + "年" + month + "月" + date + "日" + " " + hour + "点" + minute + "分" + second + "秒" : year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      }
    },
    //获取年-月-日
    getDates: function (data) {
      var timeObj = {};
      var y = data.getFullYear();
      var m = data.getMonth() + 1;
      var d = data.getDate();
      var w = data.getDay();
      switch (w) {
        case 1:
          w = "星期一";
          break;
        case 2:
          w = "星期二";
          break;
        case 3:
          w = "星期三";
          break;
        case 4:
          w = "星期四";
          break;
        case 5:
          w = "星期五";
          break;
        case 6:
          w = "星期六";
          break;
        case 7:
          w = "星期日";
          break;
      }
      var h = data.getHours();
      var mi = data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
      var s = data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
      timeObj = {
        year: y,
        month: m,
        day: d,
        week: w,
        hour: h,
        minute: mi,
        second: s
      }
      return timeObj;
    },

    /**
     * 比较当前时间和指定时间
     * @param d1
     * @returns {boolean}
     */
    compareCurrentDate: function (d1) {
      var timeNow = new Date().getTime();
      return timeNow > new Date(d1).getTime();
    },
    /**
     * 定时刷新判断
     * @param endTime 结束时间点
     * @param cb 回调函数
     * @param interval 刷新间隔
     * @returns {boolean}
     */
    keepFresh: function (endTime, cb, interval) {
      var timer = null;
      timer = setInterval(function () {
        if (me.compareCurrentDate(endTime)) {
          cb ? cb() : null;
          clearInterval(timer)
        }
      }, interval || 1000)
    },
    /**
     * 比较两个/多个日期大小,当前时间是否在某个范围内
     * @param d1
     * @param d2
     * @returns {boolean}
     */
    compareDate: function (d1, d2) {
      var timeA = new Date(d1.replace(/-/g, "\/"));
      var timeB = new Date(d2.replace(/-/g, "\/"));
      var timeNow = new Date();
      if (timeNow > timeA && timeNow < timeB) {
        //myMixin.isProper = true;
        return true;
      }
      return false;
    },
    /**
     * 倒计时（距开始，距结束）
     * @param target 截止时间
     * @param box 时间容器
     * @param msd 毫秒数
     * @param obj 时分秒父级元素
     */
    //单个倒计时
    getRCount: function (target, box) {
      //console.log(arguments);//最好直接传入数字类型
      var t, d, h, m, s;
      //var $days = $(".days");
      //var $hours = $(".hours");
      //var $mins = $(".mins");
      //var $secs = $(".secs");
      //var $counter = $(".counter");
      var timer = null;
      var EndTime;
      var NowTime = new Date(); //标准时间格式'
      //判断传过来的是否是数字
      if (typeof target != "number") {
        if (target.indexOf("-") > -1) {
          target = target.replace(/-/g, '/'); //替换为斜杠以便兼容
          EndTime = new Date(target);
        } else {
          EndTime = new Date(parseInt(target));
        }
      } else {
        EndTime = new Date(target);
      }
      //console.log(EndTime, NowTime);

      var timeCon = document.getElementById(box);
      t = EndTimyMixin.getTime() - NowTimyMixin.getTime();
      d = Math.floor(t / 1000 / 60 / 60 / 24);
      h = Math.floor(t / 1000 / 60 / 60 % 24);
      m = Math.floor(t / 1000 / 60 % 60);
      s = Math.floor(t / 1000 % 60);
      h = h >= 10 ? h : '0' + h;
      m = m >= 10 ? m : '0' + m;
      s = s >= 10 ? s : '0' + s;
      if (t > 0) {
        timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
      } else if (t === 0) {
        timeCon.innerHTML = "正点";
      } else {
        //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
        timeCon.innerHTML = "已结束";
        clearTimeout(timer);
        return; //此处记得使用return停止函数体
      }
      timer = setTimeout(function () {
        myMixin.getRCount(target, box)
      }, 1000);
    },
    //传入毫秒数时
    getMsCount: function (msd) {
      //console.log(arguments);//最好直接传入数字类型
      var t, d, h, m, s;
      var $days = $(".days");
      var $hours = $(".hours");
      var $mins = $(".mins");
      var $secs = $(".secs");
      //var $counter = $(".counter");
      var timer;
      t = msd;
      d = Math.floor(t / 1000 / 60 / 60 / 24);
      h = Math.floor(t / 1000 / 60 / 60 % 24);
      m = Math.floor(t / 1000 / 60 % 60);
      s = Math.floor(t / 1000 % 60);
      h = h >= 10 ? h : '0' + h;
      m = m >= 10 ? m : '0' + m;
      s = s >= 10 ? s : '0' + s;
      if (t > 0) {
        //timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
        $days.text(d + "天");
        $hours.text(h);
        $mins.text(m);
        $secs.text(s);
      } else if (t === 0) {
        //timeCon.innerHTML = "正点";
      } else {
        //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
        $(".right").hide();
        //过期一天后变为-预约下一期
        if (d < 0 && Math.abs(d) > 1) {
          $(".btn-operate").attr("data-text", "预约下期").text("预约下期");
        }
        //过期后变为-提交线索
        $(".btn-operate").attr("data-text", "提交线索");
        clearTimeout(timer);
        return; //一定要return才能停止
      }
      msd -= 1000;
      timer = setTimeout(function () {
        myMixin.getMsCount(msd)
      }, 1000);
    },
    /**
     * 一个页面多个倒计时
     * @param target 时间码
     * @param obj 对应的计时器元素的jq对象
     * @param isMillis 是否是毫秒
     * <ol class="counter">
     <li class="days">05</li>
     <li class="hours">05</li>
     <li class="mins">12</li>
     <li class="secs">10</li>
     </ol>
     */
    getMRCount: function (target, obj, isMillis, cb) {
      var t, d, h, m, s;
      var $days = obj.find(".days");
      var $hours = obj.find(".hours");
      var $mins = obj.find(".mins");
      var $secs = obj.find(".secs");
      //var $counter = $(".counter");
      var timer;
      if (isMillis) {
        //判断传过来的是否是数字
        if (typeof target != "number") {
          target = Number(target);
        }
        t = target;
        d = Math.floor(t / 1000 / 60 / 60 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24);
        m = Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60);
        h = h >= 10 ? h : '0' + h;
        m = m >= 10 ? m : '0' + m;
        s = s >= 10 ? s : '0' + s;
        if (t > 0) {
          //timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
          //$days.text(d + "天");
          $hours.text(h);
          $mins.text(m);
          $secs.text(s);
        } else if (t === 0) {
          //timeCon.innerHTML = "正点";
        } else {
          // alert("计时结束！");
          //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
          //$(".right").hide();
          ////过期一天后变为-预约下一期
          //if (d < 0 && Math.abs(d) > 1) {
          //    $(".btn-operate").attr("data-text", "预约下期").text("预约下期");
          //}
          ////过期后变为-提交线索
          //$(".btn-operate").attr("data-text", "提交线索");
          clearTimeout(timer);
          cb ? cb() : null;
          return; //一定要return才能停止
        }
        target -= 1000;
      } else {
        var BeginTime, EndTime;
        var NowTime = new Date(); //标准时间格式'
        //BeginTime = new Date(start);
        //判断传过来的是否是数字
        if (typeof target != "number") {
          if (target.indexOf("-") > -1) {
            target = target.replace(/-/g, '/'); //替换为斜杠以便兼容
            EndTime = new Date(target);
          } else {
            EndTime = new Date(parseInt(target));
          }
        } else {
          EndTime = target;
        }
        t = EndTime - NowTimyMixin.getTime();
        d = Math.floor(t / 1000 / 60 / 60 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24);
        m = Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60);
        h = h >= 10 ? h : '0' + h;
        m = m >= 10 ? m : '0' + m;
        s = s >= 10 ? s : '0' + s;
        if (t > 0) {
          //timeCon.innerHTML = d + "天" + h + "小时" + m + "分" + s + "秒";
          //$days.text(d + "天");
          $hours.text(h);
          $mins.text(m);
          $secs.text(s);
        } else if (t === 0) {
          //timeCon.innerHTML = "正点";
        } else {
          //timeCon.innerHTML = "已过去" + Math.abs(d) + "天" + Math.abs(h) + "小时" + Math.abs(m) + "分" + Math.abs(s) + "秒";
          obj.html("已结束");
          clearTimeout(timer);
          cb ? cb() : null;
          return; //一定要return才能停止
        }
      }

      timer = setTimeout(function () {
        isMillis ? myMixin.getMRCount(target, obj, 1, cb) : myMixin.getMRCount(target, obj, cb);
      }, 1000);
    },

    /**
     * 还剩多长时间+倒计时函数
     * @param 目标时间
     * @returns {*}
     */
    timePast: function (o) {
      var rules = /^[\d]{4}-[\d]{1,2}-[\d]{1,2}( [\d]{1,2}:[\d]{1,2}(:[\d]{1,2})?)?$/ig,
        str = '', //结果字符串
        conn, s;
      var result; //"-"分割结果
      var hans = ["天前", "小时前", "分钟前", "秒前"];
      var gaps = ""; //时间差
      if (!o.match(rules)) {
        alert('参数格式为"2012-01-01 01:01:01",\r其中[]内的内容可省略');
        return false;
      }
      var sec = (new Date(o.replace(/-/ig, '/')).getTime() - new Date().getTime()) / 1000;
      if (sec > 0) {
        conn = '还有';
      } else {
        conn = '已过去';
        sec *= -1;
      }
      s = {
        '天': sec / 24 / 3600,
        '小时': sec / 3600 % 24,
        '分': sec / 60 % 60,
        '秒': sec % 60
      };
      for (i in s) {
        //if (Math.floor(s[i]) > 0) str += Math.floor(s[i]) + i;
        if (Math.floor(s[i]) >= 0) str += Math.floor(s[i]) + "-";
      }
      if (Math.floor(sec) == 0) {
        str = '0秒';
      }
      //document.getElementById('show').innerHTML = '距离<u>' + o + '</u>' + conn + '<u>' + str + '</u>';

      //如需倒计时需开启倒计时
      //setTimeout(function () {
      //count_down(o)
      //}, 1000);
      //几天前/几小时前/几分钟前/几秒前
      result = str.slice(0, -1).split("-");
      for (var j = 0, len = result.length; j < len; j++) {
        if (result[j] != "0") {
          gaps = result[j] + hans[j];
          return gaps;
        }
      }
      //return result;
    },
    /**
     *
     * @param timeStamp
     * @returns {*}
     */
    niceTime: function (timeStamp) {
      var date = new Date(timeStamp);
      var now = new Date();

      var deltaTime = (now.getTime() - date.getTime()) / 1000;
      if (deltaTime < 60) {
        return '刚刚';
      } else if (deltaTime < 3600) {
        return parseInt(deltaTime / 60) + '分钟前';
      } else if (deltaTime < 3600 * 24) {
        return parseInt(deltaTime / 3600) + '小时前';
      }
      /*else if ( this.date(date) == this.date(now) ) {
       return this.date(date, 'HH:mm');
       } */
      else if (date.getFullYear() == now.getFullYear()) {
        return H5Utils.tools.date(timeStamp, 'MM-dd HH:mm');
      } else {
        return H5Utils.tools.date(timeStamp);
      }
    },

    /**
     * 简单验证码倒计时
     * @param obj
     * @param time
     */
    counter: function (obj, time) {
      var initTime = time;

      function timer() {
        if (initTime < 0) {
          obj.prop("disabled", false);
          obj.html("获取验证码");
          initTime = time;
        } else {
          obj.prop("disabled", true);
          obj.html("重新发送(" + initTime + ")");
          initTime--;
          setTimeout(timer, 1000);
        }
      }

      timer();
    },
    // 活动是否过期
    isActEnd: function () {
      var now = new Date().getTime(); //取今天的日期
      var end = new Date(myMixin.config.actEndTime).getTime();
      if (now > end) {
        return true;
      }
      return false;
    },
    // 禁止滑动
    cancleScroll: function (obj) {
      //document.addEventListener('touchmove', function (e) {
      //    e.preventDefault();
      //    return false;
      //}, false);
      obj.on("touchmove", function (e) {
        e.preventDefault();
        return false;
      });
    },
    /**
     * 可编辑div聚焦并移到最后
     * @param that
     */
    selLast: function (that) {
      var range = document.createRange();
      var len = that.childNodes.length;
      range.setStart(that, len);
      range.setEnd(that, len);
      getSelection().addRange(range);
      that.focus();
    },
    //获取鼠标当前坐标
    mouseCoords: function (ev) {
      if (ev.pageX || ev.pageY) {
        return {
          x: ev.pageX,
          y: ev.pageY
        };
      }
      return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
      };
    },
    /**
     *
     * @param obj
     * @param styleName
     * @returns {*}
     */
    //获取样式值
    getStyle: function (obj, styleName) {
      return window.getComputedStyle(obj, null).styleName || obj.currentStyle.styleName
    },
    /**
     * 获取js对象长度
     * @param o
     * @returns {*}
     */
    getObjLen: function (o) {
      var t = typeof o;
      if (t == 'string') {
        return o.length;
      } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
          n++;
        }
        return n;
      }
      return false;
    },
    //过滤对象中自带属性
    exceptOwnProperty: function (obj) {
      if (obj && me.isObject(obj)) {
        var tmpObj = {}
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            tmpObj[i] = obj[i]
          }
        }
        return tmpObj;
      }
    },
    /**
     * Changes XML to JSON
     * @param xml
     * @returns {{}}
     */
    xmlToJson: function (xml) {
      // Create the return object
      var obj = {};
      if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
      }
      // do children
      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof(obj[nodeName].length) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(myMixin.xmlToJson(item));
          }
        }
      }
      return obj;
    }
    ,
    /**
     * 延迟执行
     * @param func
     * @param time
     */
    timeOut: function (func, time) {
      setTimeout(func, time)
    }
    ,

    //------ 字符串操作
    //去除字符串空格
    trimStr: function (str, is_global) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (is_global) {
        result = result.replace(/\s/g, "");
      }
      return result;
    }
    ,
    //字符串中指定位置插入字符
    insertStr: function (str, flg, sn) {
      var newstr = "";
      for (var i = 0; i < str.length; i += sn) {
        var tmp = str.substring(i, i + sn);
        newstr += tmp + flg;
      }
      return newstr;
    }
    ,
    //删除指定位置的字符 x-删除的位置 num--删除字符的个数
    delStr: function (str, x, num) {
      return str.substring(0, x) + str.substring(x + num, str.length);
    }
    ,
    /**
     * 超过指定字数显示 “点点点”
     * @param str 字符
     * @param len 显示的字符个数
     * @param start 插入的起点，默认值 3
     * @param end 插入的终点，默认值同start
     * @returns {string|*}
     */
    ellipsis: function (str, len, start, end) {
      start = start || 3;
      str = (typeof(str)) != "String" ? str + '' : str;
      if (str.length > len) {
        start ? (str = str.substr(0, start) + "…" + str.substr(str.length - start || end)) : (str.substr(0, len) + "…");
      }
      return str;
    }
    ,

    //------ 数字操作
    //保留n位小数,(默认保留2位)
    toWan: function (val, n) {
      var num = n || 2;
      val = typeof val != "Number" ? parseInt(val) : val;
      return val >= 10000 ? (val / 10000).toFixed(num) : val;
    }
    ,

    /**数字前面自动补充数字或字符
     * num--传入的数字，--需要补充的内容，n--需要的字符长度
     */
    prefixNum: function (num, pre, n) {
      return parseInt((Array(n).join(pre) + num).slice(-n));
    }
    ,
    /**
     * 数字格式转换成千分位分隔（1234567.00转换为1,234,567.00）
     *@param num
     */
    numToThousand: function (num, fixNum) {
      if ((num + "").trim() == "") {
        return "";
      }
      if (isNaN(num)) {
        return "";
      }
      if (fixNum) {
        num = num.toFixed(fixNum);
      }
      num = num + "";
      if (/^.*\..*$/.test(num)) {
        var pointIndex = num.lastIndexOf(".");
        var intPart = num.substring(0, pointIndex);
        var pointPart = num.substring(pointIndex + 1, num.length);
        intPart = intPart + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(intPart)) {
          intPart = intPart.replace(re, "$1,$2")
        }
        num = intPart + "." + pointPart;
      } else {
        num = num + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
          num = num.replace(re, "$1,$2")
        }
      }
      return num;
    }
    ,
    /**
     * 千分位字符转换成数字格式（1,234,567.00转换为1234567.00）
     *@param str
     */
    thousandToNum: function (str) {
      var num = $.trim(str);
      var ss = num.toString();
      if (ss.length == 0) {
        return "0";
      }
      return ss.replace(/,/g, "");
    }
    ,
    /**
     *数字格式转换成大写中文
     * @param num
     * @returns {string}
     */
    numToChinese: function (num) {
      var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
      var BB = new Array("", "拾", "百", "千", "万", "亿", "", "");
      var CC = new Array("角", "分", "");

      var a = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = "";

      for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
          case 0:
            re = BB[7] + re;
            break;
          case 4:
            if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$").test(a[0]))
              re = BB[4] + re;
            break;
          case 8:
            re = BB[5] + re;
            BB[7] = BB[5];
            k = 0;
            break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
      }
      if (re.trim().length > 0) {
        re += "元";
      }
      if (a.length > 1) { //加上小数部分(如果有小数部分)
        re += BB[6];
        for (var i = 0; i < 2; i++) {
          re += AA[a[1].charAt(i)] + CC[i];
        }
        ;
      }

      return re;
    }
    ,

    /**
     * 移动端模拟hover
     * @param obj 对象
     * @param classFocus 高亮类名
     */
    mHover: function (obj, classFocus) {
      var curClass = obj.attr("class") || "";
      obj.on("touchstart", function (e) {
        e.preventDefault();
        obj.attr("class", curClass + "classFocus");
      })
      obj.on("touchend", function (e) {
        e.preventDefault();
        obj.attr("class", curClass);
      })
    }
    ,
    isOnlineEvt: function () {
      window.addEventListener('load', function () {
        var status = document.getElementById("status");

        function updateOnlineStatus(event) {
          var condition = navigator.onLine ? "online" : "offline";

          status.className = condition;
          status.innerHTML = condition.toUpperCase();

          log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
      });
    }
    ,
    isWindow: function (obj) {
      return obj != null && obj === obj.window;
    }
    ,
    isObject: function (obj) {
      return typeof obj === "object";
    }
    ,
    isEmptyObject: function (o) {
      for (var p in o) {
        if (p !== undefined) {
          return false;
        }
      }
      return true;
    }
    ,
    isArray: function (sources) {
      return '[object Array]' == Object.prototype.toString.call(sources);
    }
    ,
    isDate: function (sources) {
      return {}.toString.call(sources) === "[object Date]" && sources.toString() !== 'Invalid Date' && !isNaN(sources);
    }
    ,
    isElement: function (sources) {
      return !!(sources && sources.nodeName && sources.nodeType == 1);
    }
    ,
    isFunction: function (sources) {
      return '[object Function]' == Object.prototype.toString.call(sources);
    }
    ,
    isNumber: function (sources) {
      return '[object Number]' == Object.prototype.toString.call(sources) && isFinite(sources);
    }
    ,
    isObject: function (sources) {
      return '[object Object]' == Object.prototype.toString.call(sources);
    }
    ,
    isString: function (sources) {
      return '[object String]' == Object.prototype.toString.call(sources);
    }
    ,
    isBoolean: function (sources) {
      return typeof sources === 'boolean';
    },

    /**
     * 播放音频
     * @param audioSrc 音频地址
     * @param idName 元素id
     * @param toggleEle 音乐开关元素（默认空,会持续检查音乐状态，若有开关，记得加上开关元素）
     * @param autoPlay 是否自动播放，默认关闭
     * @param loop 是否循环，默认关闭
     * @param isCheckStatus 是否检查播放状态，默认检查
     */
    playAudio: function (audioSrc, idName, toggleEle, autoPlay, loop, isCheckStatus) {
      var mediaA = document.createElement('audio');
      mediaA.src = audioSrc;
      mediaA.preload = true;
      // mediaA.volume = 0.0;
      mediaA.muted = true; //是否静音（可用于预先播放加载音频）
      mediaA.id = idName || 'bgm';
      (loop === undefined && !loop) ? null : mediaA.loop = 'true';
      (autoPlay === undefined || !autoPlay) ? null : mediaA.autoplay = 'true';
      document.body.appendChild(mediaA);
      mediaA.load();
      if (autoPlay === undefined || !autoPlay) {
      } else {
        if (me.isWeixin) {
          try {
            document.addEventListener("WeixinJSBridgeReady", function () {
              mediaA.play();
            }, false)
          } catch (e) {
            mediaA.play();
          }
        } else {
          mediaA.play()
        }
      }
      //isCheckStatus !== undefined && !isCheckStatus ? mediaA.play() : myMixin.toggleSound("#" + mediaA.id, toggleEle);
    },

    /**
     * 音频关闭/开启
     * @param ele 音乐开关元素
     * @param audioEle 音乐元素
     */
    switchAudio: function (ele, audioEle) {
      var music = $(audioEle)[0]; //获取ID;
      $(ele).on('click', function () {
        var $this = $(this);
        if ($this.hasClass('off')) {
          $this.removeClass('off');
          music.play();
        } else {
          $this.addClass('off');
          music.pause();
        }
      });
    },

    /**
     * fix自动播放音频
     * @param audio 音乐元素
     * @param toggleEle 音乐开关元素
     */
    toggleSound: function (audio, toggleEle) {
      var music = $(audio)[0]; //获取ID
      if (music.paused) { //判读是否播放
        music.play();
        $(toggleEle).removeClass("off");
        $(document).on("touchstart", function () {
          toggleEle ? ($(toggleEle).hasClass("off") ? null : music.play()) : music.play(); //若有开关就判断，没有就播放
        })
      } else {
        music.pause();
        $(toggleEle).addClass("off");
      }
    },

    /**
     * 配置化播放音频
     * @param audio 音乐元素
     * @param isClose 是否关闭音乐
     * @param isMute 是否静音
     * @param cb cb
     */
    swSound: function (audio, isClose, isMute, cb) {
      try {
        var that = document.querySelector(audio);
        !isMute ? that.muted = false : null;
        var isPlaying = that.paused ? false : true; //判读是否播放
        (isClose === undefined || !isClose) ? (isPlaying ? (that.pause(), that.play()) : that.play()) : that.pause();
        cb ? cb(that) : null;
      } catch (e) {
        console.log(e)
      }
    },

    //iScroll无法点击问题修复
    iScrollClick: function () {
      if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
      if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
      if (/Silk/i.test(navigator.userAgent)) return false;
      if (/Android/i.test(navigator.userAgent)) {
        var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
        return parseFloat(s[0] + s[3]) < 44 ? false : true
      }
    }
    ,
    storeUser: function (key, obj) {
      myMixin.locals.set(key, obj);
    }
    ,
    readUser: function (key, ele1, ele2) {
      var data = myMixin.locals.get(key); //获取本地用户信息
      if (data !== null) {
        data = JSON.parse(data);
        $(ele1).val(data.n);
        $(ele2).val(data.p);
      }
    }
    ,
    //判断是否支持touch事件
    hasTouch: function () {
      var touchObj = {};
      touchObj.isSupportTouch = "ontouchend" in document ? true : false;
      touchObj.isEvent = touchObj.isSupportTouch ? "touchstart" : "click";
      return touchObj.isEvent;
    }
    ,
    //强制禁用整屏滚动
    switchScroll: function (status) {
      (status === -1) ? $("html,body").removeClass("disable-scroll") : $("html,body").addClass("disable-scroll");
    }
    ,
    //requestAnimationFrame动画
    theRaf: {
      activeRaf: function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
              },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
          };

        if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
            return;
          };
      }
    }
    ,

    //记录用户表单数据
    storeUser: function (key, obj) {
      myMixin.locals.set(key, obj);
    }
    ,
    readUser: function (key, ele1, ele2) {
      var data = myMixin.locals.get(key); //获取本地用户信息
      if (data !== null) {
        data = JSON.parse(data);
        $(ele1).val(data.n);
        $(ele2).val(data.p);
      }
    }
    ,
    // 图片加载出错时
    imgError: function (picEle, defaultSrc, callback) {
      $(picEle).on("error", function () {
        var $this = $(this);
        $this.onerror = null;
        defaultSrc ? $this.attr("src", defaultSrc) : $this.attr("src", 'http://avatar.csdn.net/1/E/E/1_qq_27080247.jpg');
        console.log('图片出错的时候调用默认的图片');
        callback ? callback() : null;
      })
    }
    ,
    webUploader: function () {
      if (window.WebUploader) {
        /**
         * 图片上传
         */
        var $list = $("#fileList"),
          thumbnailWidth = 40,
          thumbnailHeight = 40;
        var uploader = WebUploader.create({

          // 选完文件后，是否自动上传。
          auto: true,

          prepareNextFile: true,

          chunked: true, // 分片上传大文件

          chunkRetry: 10, // 如果某个分片由于网络问题出错，允许自动重传多少次？

          // swf文件路径
          swf: 'webuploader/Uploader.swf',

          // 文件接收服务端。
          server: 'http://upload.image.kakamobi.cn/api/open/admin-upload.htm?bucket=saturn-image',

          // 选择文件的按钮。可选。
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          pick: '#filePicker',
          fileNumLimit: 9,
          // 只允许选择图片文件。
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*,text/plain,application/msword,application/octet-stream,application/vnd.ms-excel,application/x-shockwave-flash'
          }
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
          var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
            $img = $li.find('img');

          // $list为容器jQuery实例
          if ($img.length > 2) {
            myMixin.lightPop("最多9张图！")
          } else {
            $list.append($li);
          }

          // 创建缩略图
          // 如果为非图片文件，可以不用调用此方法。
          // thumbnailWidth x thumbnailHeight 为 100 x 100
          uploader.makeThumb(file, function (error, src) {
            if (error) {
              $img.replaceWith('<span>不能预览</span>');
              return;
            }
            $img.attr('src', src);
          }, thumbnailWidth, thumbnailHeight);
        });

        //移除已上传图片
        $dom.on("click", ".file-item", function (e) {
          e.preventDefault();
          $(this).remove();
        })

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
          //if (theData.imgList.length > 2) {
          //    myMixin.showPop("<div>最多九张图</div>", '.noMorePic');
          //    //myMixin.lightPop("最多9张图！")
          //    return false;
          //} else {
          theData.isUploading = 1;
          myMixin.lightPop("上传中…", -1);
          var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

          // 避免重复创建
          if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>')
              .appendTo($li)
              .find('span');
          }

          $percent.css('width', percentage * 100 + '%');
          //}
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, obj) {
          theData.isUploading = 0;
          myMixin.lightPop("上传成功");
          theData.imgList.push(obj.data[0]);
          //console.log(theData.imgList);
          $('#' + file.id).addClass('upload-state-done');
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
          myMixin.lightPop("上传出错");
          theData.isUploading = 0;
          var $li = $('#' + file.id),
            $error = $li.find('div.error');

          // 避免重复创建
          if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
          }

          $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
          theData.isUploading = 0;
          $('#' + file.id).find('.progress').remove();
        });
      } else {
        console.error(">>>>> 请先引入webUploader!");
      }
    }
  }
  //myMixin.getInfo.storeBp();
  //myMixin.pos.getPos(); //获取当前位置信息
  window.myMixin = window.me = myMixin;

// 时间格式化
  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours() % 12,
      "H+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
// 判断闰年
  Date.prototype.isLeapYear = function () {
    return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
  }

//最小值
  Array.prototype.min = function () {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
      if (this[i] < min) {
        min = this[i];
      }
    }
    return min;
  }
//最大值
  Array.prototype.max = function () {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
      if (this[i] > max) {
        max = this[i];
      }
    }
    return max;
  }

// 扩展jquery（内滚动不影响外滚动）eq:$(ele).scrollUnique();
  $.fn.scrollUnique = function () {
    return $(this).each(function () {
      var eventType = 'mousewheel';
      if (document.mozHidden !== undefined) {
        eventType = 'DOMMouseScroll';
      }
      $(this).on(eventType, function (event) {
        // 一些数据
        var scrollTop = this.scrollTop,
          scrollHeight = this.scrollHeight,
          height = this.clientHeight;

        var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);

        if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
          // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
          this.scrollTop = delta > 0 ? 0 : scrollHeight;
          // 向上滚 || 向下滚
          event.preventDefault();
        }
      });
    });
  };

//------- 定义 && 导出 --------------------------
  if (typeof define === "function" && define.amd) {
    define("myMixin", ['jquery'], function ($) {
      return myMixin;
    });
  }

  // Map over myMixin/me in case of overwrite
  var _myMixin = window.myMixin, _me = window.me;

  myMixin.noConflict = function (deep) {
    if (window.me === myMixin) {
      window.me = _me;
    }

    if (deep && window.myMixin === myMixin) {
      window.myMixin = _myMixin;
    }
    return myMixin;
  };

  if (!noGlobal) {
    window.myMixin = window.me = myMixin;
  }
  return window.me || window.myMixin;
})
