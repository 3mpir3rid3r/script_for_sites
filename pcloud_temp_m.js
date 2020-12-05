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
                        title: 'Uploading',
                        text: '0/' + b.length
                    })
                    Swal.showLoading();


                    $.each(b, function (i, v) {
                        $.post("https://api7.pcloud.com/downloadfile", {
                            folderid: 0,
                            progresshash: 'upload-16152850-xhr-359',
                            nopartial: 1,
                            url: v,
                            auth: auth
                        }).done(function (data) {
                            var count = Swal.getContent().textContent;
                            var currentCount = parseInt(count.split("/")[0]);
                            if ((currentCount + 1) == b.length) {
                                Swal.getTitle().textContent = 'Done.'
                                Swal.getContent().textContent = (currentCount + 1) + "/" + b.length;
                                Swal.hideLoading()
                            } else {
                                Swal.getContent().textContent = (currentCount + 1) + "/" + b.length;
                            }

                        });
                    })
                }
            }
        })
    });

    setTimeout(function () {
        $('.gridmanage').prepend("<div id='link' class='uploadfiles'>Upload All</div>");
    }, 4000);
})();