// ==UserScript==
// @name         Baiscope download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baiscopelk.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = jQuery.noConflict( true );

    var href=$('img.wp-image-13794').parent('a').attr('href');

    if(href){
        window.open(href);


        $.extend($.expr[':'], {
            'containsi': function(elem, i, match, array)
            {
                return (elem.textContent || elem.innerText || '').toLowerCase()
                    .indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        var next=$('img.wp-image-60645,img.wp-image-60684' ).parent('a').attr('href');

        if(next){
            window.location=next;
        }else{
            var spans =  $('span[data-mce-mark]');
            var anchor = spans.filter(":contains('Next episode')");
            var next = anchor.parent('a').attr('href');
            if(next){
                window.location=next;
            }else{
                var anchors =  $('a[target="_blank"]');
                var anchor = anchors.filter(":containsi('Next Episode >>')");
                var next = anchor.parent('a').attr('href');
                if(next){
                    window.location=next;
                }else{
                    var anchors =  $('a[target="_blank"]');
                    var anchor = anchors.filter(":containsi('Next Episode >>')");
                    var next = anchor.attr('href');
                    if(next){
                        window.location=next;
                    }
                }
            }
        }
    }

})();
