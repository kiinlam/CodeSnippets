export const appendScript = (url) => {
  var script = document.createElement("script");
  script.src = url;
  var n = document.getElementsByTagName("script")[0];
  n.parentNode.insertBefore(script, n);
}

// 在Tampermonkey中使用jQuery
// ==UserScript==
// @name         addJquery
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gugong.ktmtech.cn/
// @icon         https://www.google.com/s2/favicons?domain=ktmtech.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function () {
  'use strict';

  var jq = jQuery.noConflict(); // tampermonkey 加载的jq
  console.log(jq().jquery)
  var $ = $ || window.$; // 网页使用的jq
  console.log($().jquery)
})();