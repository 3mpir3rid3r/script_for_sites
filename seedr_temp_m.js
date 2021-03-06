// ==UserScript==
// @name         SEEDR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.seedr.cc/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.12.3/sweetalert2.min.js
// @resource     SweetAlert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/10.12.3/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';
    GM_getResourceText('SweetAlert2CSS');
    GM_addStyle(' .mr-3{margin-right: 3em;} .br{border-radius: 10px; padding: 3px 17px !important;} .swal2-actions{ margin: 0 !important;} ');

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-info mr-3 br',
            cancelButton: 'btn btn-info br'
        },
        buttonsStyling: false
    });

    function viewLinks(data){
        swalWithBootstrapButtons.fire({
            text: 'Yore links is here.you can copy it.',
            width: 1250,
            showCancelButton: true,
            html: '<span>Yore links is here.you can copy it.</span><br><textarea id="swal-input1" class="swal2-input" style=" height: 250px; font-size: 15px; ">'+data+'</textarea>',
            confirmButtonText: 'Copy',
            allowOutsideClick: false,
            onOpen: function(el) {
                var input = $('#swal-input1');
                input.select();
                input.prop('readonly', true);

                var container = $(el);
                var originalConfirmButton = container.find('.swal2-confirm');
                var clonedConfirmButton = originalConfirmButton.clone();

                originalConfirmButton.hide();
                clonedConfirmButton.insertAfter(originalConfirmButton);

                clonedConfirmButton.on('click', function() {
                    var input = $('#swal-input1');
                    input.select();
                    input.prop('readonly', true);
                    document.execCommand("copy")
                });
            },

        });
    }

    function getFoldersLinks(){
        var links='';
        var count=0;
        var list=$('div[folder_id][folder_id!="-1"]');
        $.each(list,function () {
            $.post("https://www.seedr.cc/content.php?action=create_empty_archive", {
                folder_id: 4565362,
                archive_arr:'[{"type":"folder","id":'+$(this).attr('folder_id').toString()+'}]'
            }).done(function (data) {
                if ((count + 1) == list.length) {
                    links = links + data.archive_url+'\n'
                    viewLinks(links);
                } else {
                    count = count + 1;
                    links = links + data.archive_url+'\n'
                }
            });
        });
    }

    function getFilesLinks(){
        var links='';
        var count=0;
        var list=$('div[folder_file_id]');
        $.each(list,function () {
            $.post("https://www.seedr.cc/content.php?action=fetch_file", {
                folder_file_id: $(this).attr('folder_file_id').toString()
            }).done(function (data) {
                if ((count + 1) == list.length) {
                    links = links + data.url+'\n'
                    viewLinks(links);
                } else {
                    count = count + 1;
                    links = links + data.url+'\n'
                }

            });
        });
    }

    $(document).on('click','#links',function(){
        swalWithBootstrapButtons.fire({
            text: "Select what you need!",
            showCancelButton: true,
            confirmButtonText: 'For All Folder',
            cancelButtonText: 'For All Files',
            focusConfirm: false
        }).then((result) => {
            if (result.isConfirmed) {
                getFoldersLinks();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                getFilesLinks();
            }
        });
    });

    $('#add-folder-button').parent('div').prepend('<button  id="links"  style="float:right;padding: 5px;    float: right;    display: block;    line-height: 12px;    margin-right: 35px;    background: none;    color: black;    outline: none;" class="radius"><i class="fa fa-copy"></i> Get Links</button>');

})();
