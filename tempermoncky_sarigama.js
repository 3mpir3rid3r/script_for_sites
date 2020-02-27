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

    var name=$('.user-name').html();
    if(name){

        $('.page-title').parent('div').append('<button id="play" style="float: right;margin-left: 10px;" disabled="disabled">Apply</button> <select id="chooseOption" style="float:right;"><option value="0">Select Option</option><option value="1">Add All And Play</option><option value="2">Add Random And Play</option></select>');
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

        $('#play').click(function(){
            var post=$.post('https://sarigama.lk/playlists/save',{'_token':$('meta[name="csrf-token"]').attr('content'),'name':$('.page-title').children('h1').html()});
            post.success(function() {
                var forms=$(post.responseText).find('form');
                $.each(forms,function(index,val){
                    var action=$(val).attr('action');
                    if(action){
                        var splits = action.split("/");
                        var id = splits[splits.length - 2];
                        console.log('Playlist id: '+id);
                        $('#tracks').find('a[target="_blank"]').each(function (key, value) {
                            var elm = $(this);
                            var s = elm.attr('href').split('/');

                            if($('#chooseOption').val()=="2" && elm.parent().siblings('input').is(':checked')==false){
                                console.log('Song id: '+s[s.length - 1] + ' --> false (Skiped by user)' );
                                return;
                            }

                            $.get('https://sarigama.lk/playlist/storesong/' + id + '/' + s[s.length - 1], function (data) {

                                if(data== true){
                                    elm.css('background','#b4deb4');
                                    console.log('Song id: '+s[s.length - 1] + ' --> ' + data);
                                }else{
                                    elm.css('background','#ffa4a4');
                                    console.log('Song id: '+s[s.length - 1] + ' --> ' + data);
                                }
                            });
                        });
                    }
                });
            });
        });
    }else{
        console.log('User not logged in');
    }
})();
