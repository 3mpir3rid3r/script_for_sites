// ==UserScript==
// @name         Get file link from download site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baiscopelk.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const $ = jQuery.noConflict(true);

    $('#tfade').remove();
    $('#tlight').remove();
    var href;
    $.each($('a[title~="උපසිරැසි"]'), function (index, value) {
        if ($(value).html().indexOf('සිංහල උපසිරැසි මෙතනින් බාගන්න') > -1) {
            href = $(value);
        }
    })

    if (href) {
        var name = $('span[itemprop="name"]').html().replace(' Sinhala Subtitles', '').replace(' [සිංහල උපසිරසි]', '');
        var split = name.split('|');
        var search = split[0].replace(/\d+/g, '').replace(/[()]/g, '').trim();
        $('<iframe src="https://baiscopedownloads.co/?s=' + encodeURIComponent(search) + '&data=create&name=' + encodeURIComponent(name) + '&split=' + encodeURIComponent(split) + '" id="downloadFrame" style="width: 100%;height:500px" ></iframe>').insertBefore("div.author-shortcodes");
    }


})();
