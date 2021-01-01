// ==UserScript==
// @name         Baiscope download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baiscopelk.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = jQuery.noConflict( true );

    var href=$('img.wp-image-13794').parent('a').attr('href');

    if(href){
        window.open(href);

        var next=$('img.wp-image-60645,img.wp-image-60684' ).parent('a').attr('href');

        if(next){
            window.location=next;
        }else{
            var spans =  $('span[data-mce-mark]');
            var anchor = spans.filter(":contains('Next Episode >>')");
            var next = anchor.parent('a').attr('href');
            if(next){
                window.location=next;
            }else{
                var anchors =  $('a[target="_blank"]');
                var anchor = anchors.filter(":contains('Next Episode >>')");
                var next = anchor.parent('a').attr('href');
                if(next){
                    window.location=next;
                }
            }
        }
    }

})();
