// ==UserScript==
// @name         SEEDR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.seedr.cc/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`.mr-3{margin-right: 3em;} .br{border-radius: 10px;}`);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-info mr-3 br',
            cancelButton: 'btn btn-info br'
        },
        buttonsStyling: false
    });

    function viewLinks(data){
        swalWithBootstrapButtons.fire({
            text: 'paste your links here.line breack consider as new link.',
            input: 'textarea',
            inputAttributes: {
                autocapitalize: 'off'
            },
            inputValue: data,
            confirmButtonText: 'Ok',
            onOpen: function() {
                var input = swal.getInput()
                input.setSelectionRange(0, input.value.length)
            }
        });
    }

    function getFoldersLinks(){
        var links='';
        var count=0;
        var list=$('div[folder_id][folder_id!="-1"]');
        $.each(list,function () {
            $.post("https://www.seedr.cc/content.php?action=create_empty_archive", {
                folder_id: 4565362,
                archive_arr: {
                    type:"folder",id:$(this).attr('folder_id').toString()
                }
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
