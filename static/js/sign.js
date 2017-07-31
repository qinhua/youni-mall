/* eslint-disable */
window.sign=function(a){var c=Math.abs(parseInt(new Date().getTime()*Math.random()*10000)).toString();var d=0;for(var b=0;b<c.length;b++){d+=parseInt(c[b])}var e=function(f){return function(g,h){return(0>=(h-""+g.length))?g:(f[h]||(f[h]=Array(h+1).join(0)))+g}}([]);d+=c.length;d=e(d,3-d.toString().length);return a.toString()+c+d};
