// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baiscopelk.com/breaking-bad-*/
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

function _x(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}

(function() {
    'use strict';

    var href=$(_x('/html/body/div[1]/div[2]/div/div[4]/div[1]/article/div/div[2]/div[2]/div[1]/p[1]/a[2]')).attr('href');

    window.open(href);

    var next=$(_x('/html/body/div[1]/div[2]/div/div[4]/div[1]/article/div/div[2]/div[2]/p[6]/a/img')).parent().attr('href');

    window.location=next;

})();
