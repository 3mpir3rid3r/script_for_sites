// ==UserScript==
// @name         pcloud uploader small
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://my.pcloud.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $(document).on('click','.remoteupload-ctrl',function () {

        var originalTextarea = $('textarea.remotearea.tarea');
        originalTextarea.attr('id','originalTextarea');
        var clonedTextarea = originalTextarea.clone();

        originalTextarea.hide();
        clonedTextarea.insertAfter(originalTextarea);
        clonedTextarea.attr('id','clonedTextarea');

        var originalConfirmButton = $('button.button.darkbut.modernbut');
        originalConfirmButton.attr('id','originalConfirmButton');
        var clonedConfirmButton = originalConfirmButton.clone();

        originalConfirmButton.hide();
        clonedConfirmButton.insertAfter(originalConfirmButton);
        clonedConfirmButton.attr('id','clonedConfirmButton');
        clonedConfirmButton.html('Upload All');
        clonedConfirmButton.on('click', function() {
            var count = 0;
            var b = $.trim($('#clonedTextarea').val()).split("\n");
            $.each(b, function (i, v) {
                setTimeout(function () {
                    console.log(v);
                    $('#originalTextarea').val(v);
                    $('#originalConfirmButton').click();

                }, count * 4000);
                count++;
            })
        });
    })
})();
