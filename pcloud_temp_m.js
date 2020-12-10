// ==UserScript==
// @name         pcloud uploader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://my.pcloud.com/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function randomNumber() {
        var val = Math.floor(Math.random() * (19 - 6 + 1) + 6);
        val = (val === 13) ? randomNumber() : val;
        return val;
    }

    $(document).on('click', '#link', function () {
        Swal.fire({
            title: 'paste links',
            text: 'paste your links here.line breack consider as new link.',
            input: 'textarea',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Upload',
            showLoaderOnConfirm: true
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value) {
                    let auth = readCookie("pcauth");
                    var b = result.value.split("\n");

                    Swal.fire({
                        title: 'Uploading..',
                        text: 'Processing..'
                    })
                    Swal.showLoading();

                    var count = 0;
                    var flag = true;
                    $.each(b, function (i, v) {
                        setTimeout(function () {
                            if (flag) {
                                $.post("https://api" + randomNumber() + ".pcloud.com/downloadfile", {
                                    folderid: 0,
                                    progresshash: 'upload-16152850-xhr-359',
                                    nopartial: 1,
                                    url: v,
                                    auth: auth
                                }).done(function (data) {
                                    console.log(data);
                                    if (data.result !== 4001) {
                                        var count = Swal.getContent().textContent;
                                        var currentCount = parseInt((count.split("/")[0] === 'Processing..') ? 0 : count.split("/")[0]);
                                        if ((currentCount + 1) == b.length) {
                                            Swal.getTitle().textContent = 'Done.'
                                            Swal.getContent().textContent = (currentCount + 1) + "/" + b.length;
                                            Swal.hideLoading();
                                        } else {
                                            Swal.getContent().textContent = (currentCount + 1) + "/" + b.length;
                                        }
                                    } else {
                                        Swal.getTitle().textContent = 'Faild.'
                                        Swal.getContent().textContent = data.error;
                                        Swal.hideLoading();
                                        flag = false;
                                    }

                                });
                            }
                        }, count * 4000);
                        count++;
                        console.log(flag);
                    })
                }
            }
        })
    });

    setTimeout(function () {
        $('.gridmanage').prepend("<div id='link' class='uploadfiles'>Upload All</div>");
    }, 4000);
})();
