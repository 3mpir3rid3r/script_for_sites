// ==UserScript==
// @name         Sarigama Playlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sarigama.lk/artist/*
// @match        https://sarigama.lk/index.php/artist/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('.page-title').parent('div').append('<button id="play" style="float: right;margin-left: 10px;" >Apply</button> <select id="chooseOption" style="float:right;"><option value="0">Select Option</option><option value="1">Add All And Play</option><option value="2">Add Random And Play</option></select>');
    $('.page-title').attr('style','float: left;');

    $('#chooseOption').change(function(){
        var val=$(this).val();
        if(val=="0"){
            $('.item-info').each(function( index ) {
                $(this).children('.item-title').attr('style','');
                $(this).children('.check').remove();
            });
            $('#play').attr('disabled',true);
        }else if(val=="2"){
            $('.item-info').each(function( index ) {
                $(this).children('.item-title').attr('style','float: left;');
                $(this).append('<input class="check" type="checkbox" style="float: right;">');
            });
            $('#play').attr('disabled',true);
        }else if(val=="1"){
            $('.item-info').each(function( index ) {
                $(this).children('.item-title').attr('style','');
                $(this).children('.check').remove();
            });
            $('#play').attr('disabled',false);
        }
    });


    $(document).on('click','.check',function(){
        $('.check').each(function(index){
            if($(this).is(':checked')==true){
                $('#play').attr('disabled',false);
                return false;
            }else{
                $('#play').attr('disabled',true);
            }
        });
    });

})();
