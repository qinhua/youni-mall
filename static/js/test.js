/* eslint-disable */
function al(txt) {
  alert(txt);
};

function lg(a, b, c) {
  if (b && c) {
    console.log(a, b, c);
    return;
  } else if (b) {
    console.log(a, b);
    return;
  }
  console.log(a);
};

function lgm(content, style) {
  console.log(content, style);
};

function info(txt) {
  console.info(txt);
};

function warn(txt) {
  console.warn(txt);
};

function err(txt) {
  console.error(txt);
};

function prof(txt) {
  console.profile(txt);
};

function args() {
  console.log(arguments);
};

function lgmd(txt, style) {
  console.log('%c' + txt, style);
};

function jump(url) {
  location.href = url;
};

function toJson(jsonStr) {
  return JSON.parse(jsonStr);
};

function jsonStr(json, indent) {
  lg(JSON.stringify(json, null, indent));
};

function getSearch() {
  return window.location.search;
};

function getUrl() {
  return window.location.href;
};

function getReferrer() {
  return document.referrer;
};
//图片出错时加载
function whenError(a) {
  a.onerror = null;
  a.src = 'http://avatar.csdn.net/1/E/E/1_qq_27080247.jpg';
  console.log('图片出错的时候调用默认的图片');
}
