// ==UserScript==
// @name         pcloud uploader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://my.pcloud.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.12.3/sweetalert2.min.js
// @resource     SweetAlert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.12.3/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(GM_getResourceText('SweetAlert2CSS'));
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

    function randomHash() {
        var midle = Math.floor(Math.random() * (16900000 - 16000000 + 1) + 16000000);
        var last = Math.floor(Math.random() * (999 - 300 + 1) + 300);

        return 'upload-' + midle + '-xhr-' + last;
    }

    $(document).on('click', '#link', function () {
        Swal.fire({
            title: 'Paste Links',
            html: '<span>paste your links here.line breack consider as new link.</span><br><textarea id="swal-input1" class="swal2-input" style=" height: 250px; font-size: 15px; "></textarea>',
            width: 1250,
            showCancelButton: true,
            confirmButtonText: 'Upload',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value
                ]
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value) {
                    let auth = readCookie("pcauth");
                    var b = $.trim(result.value.toString()).split("\n");
                    Swal.fire({
                        title: 'Uploading..',
                        text: 'Feched ' + b.length + ' links.Processing..'
                    })
                    Swal.showLoading();

                    var count = 0;
                    var flag = true;
                    $.each(b, function (i, v) {
                        setTimeout(function () {
                            var hash = randomHash();
                            if (flag) {
                                $.post("https://api" + randomNumber() + ".pcloud.com/downloadfile", {
                                    folderid: 0,
                                    progresshash: hash,
                                    nopartial: 1,
                                    url: v,
                                    auth: auth
                                },function (params) {

                                }).done(function (data) {
                                    console.log(data);
                                    if (data.result === 0) {
                                        var count = Swal.getContent().textContent;
                                        var currentCount = parseInt((count.split("/")[0].indexOf('Processing..')> -1 ) ? 0 : count.split("/")[0]);
                                        if ((currentCount + 1) == b.length) {
                                            Swal.getTitle().textContent = 'Done.'
                                            Swal.getContent().textContent = (currentCount + 1) + "/" + b.length;
                                            Swal.hideLoading();
                                        } else {
                                            Swal.getContent().textContent = (currentCount + 1) + "/" + b.length;
                                        }
                                    } else {
                                        Swal.getTitle().textContent = 'Faild.'
                                        $('#swal2-content').html('<span style="color:red" >test</span>');
                                        Swal.getContent().textContent = data.error;
                                        Swal.hideLoading();
                                        flag = false;
                                    }

                                });
                            }
                        }, count * 4000);
                        count++;
                    })
                }
            }
        })
    });

    setTimeout(function () {
        $('.gridmanage').prepend("<div id='link' class='uploadfiles'>Upload All</div>");
    }, 6000);
})();
