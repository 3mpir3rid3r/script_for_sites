// ==UserScript==
// @name         Make link for download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://baiscopedownloads.co/?s=*&data=create*
// @match        https://baiscopedownloads.co/*?view=download
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const $ = jQuery.noConflict(true);

    var parameter = new URLSearchParams(window.location.search);
    var search = parameter.get('s');
    var view = parameter.get('view');
    if (search) {

        var fullName = parameter.get('name');
        var split = parameter.get('split').split(',');
        $.get("https://baiscopedownloads.co/?s=" + search, function (data) {
            html = $(data);
            $.each($(html).find('a'), function (i, v) {
                if ($(v).html().indexOf(split[0]) > -1) {
                    console.log($(v).attr('href') + "?view=download");
                    window.location = $(v).attr('href') + "?view=download";
                }
            });
        });
    }

    if (view) {

        var html = $('div.entry-content.clearfix').children('*[data-blogger-escaped-data-mce-style="text-align: center;"]').toArray();
        html.pop();
        $($(html[0]).children('p')[0]).remove();
        $('body').empty();
        $('body').html(html);

    }

})();
