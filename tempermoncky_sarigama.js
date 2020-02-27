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
(function () {
    'use strict';
    var name = $('.user-name').html();
    if (name) {
        $('.page-title').parent('div').append('<button id="play" style="float: right;margin-left: 10px;" disabled="disabled">Apply</button> <select id="chooseOption" style="float:right;"><option value="0">Select Option</option><option value="1">Add All And Play</option><option value="2">Add Random And Play</option></select>');
        $('.page-title').attr('style', 'float: left;');
        $('#chooseOption').change(function () {
            var val = $(this).val();
            if (val == "0") {
                $('.item-info').each(function (index) {
                    $(this).children('.item-title').attr('style', '');
                    $(this).children('.check').remove();
                });
                $('#play').attr('disabled', true);
            } else if (val == "2") {
                $('.item-info').each(function (index) {
                    $(this).children('.item-title').attr('style', 'float: left;');
                    $(this).append('<input class="check" type="checkbox" style="float: right;">');
                });
                $('#play').attr('disabled', true);
            } else if (val == "1") {
                $('.item-info').each(function (index) {
                    $(this).children('.item-title').attr('style', '');
                    $(this).children('.check').remove();
                });
                $('#play').attr('disabled', false);
            }
        });
        $(document).on('click', '.check', function () {
            $('.check').each(function (index) {
                if ($(this).is(':checked') == true) {
                    $('#play').attr('disabled', false);
                    return false;
                } else {
                    $('#play').attr('disabled', true);
                }
            });
        });
        $('#play').click(function () {
            $('#play').attr('disabled', true);
            var post = $.post('https://sarigama.lk/playlists/save', {
                '_token': $('meta[name="csrf-token"]').attr('content'),
                'name': $('.page-title').children('h1').html()
            });

            post.success(function () {
                var forms = $(post.responseText).find('form');
                $.each(forms, function (index, val) {
                    var action = $(val).attr('action');
                    if (action) {
                        var splits = action.split("/");
                        var id = splits[splits.length - 2];
                        console.log('Playlist id: ' + id);
                        var songs = $('#tracks').find('a[target="_blank"]');
                        addSongsAndPlay(songs, 0, id);
                    }
                });
            });
            $('#play').attr('disabled', false);
        });
    } else {
        console.log('User not logged in');
    }

    function addSongsAndPlay(songs, index, id) {
        var elm = songs.eq(index);
        if (songs.length > index) {
            var s = elm.attr('href').split('/');
            if ($('#chooseOption').val() == "2" && elm.parent().siblings('input').is(':checked') == false) {
                elm.css('background', '#ffa4a4');
                console.log('Song id: ' + s[s.length - 1] + ' --> false (Skiped by user)');
                index = index + 1;
                addSongsAndPlay(songs, index, id);
                return;
            }
            $.get('https://sarigama.lk/playlist/storesong/' + id + '/' + s[s.length - 1], function (data) {
                if (data == true) {
                    elm.css('background', '#b4deb4');
                } else {
                    elm.css('background', '#ffa4a4');
                }
                console.log('Song id: ' + s[s.length - 1] + ' --> ' + data);

            }).always(function() {
                index = index + 1;
                addSongsAndPlay(songs, index, id);
            });;

        } else {
            var scope = angular.element($('[ng-controller="searchController"]')).scope()
            addInjectionCode(scope);
            scope.playAll(id);
        }
    }

    function addInjectionCode(scope) {
        scope.create_UUID = function () {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }
        scope.API_URL = 'https://sarigama.lk/api/v1/';
        scope.SITE_URL = 'https://sarigama.lk/';
        scope.tabUUID = scope.create_UUID();
        scope.songs = [];
        scope.searchtext = "";
        scope.selectedSong = null;
        scope.showmodel = scope.songs.length > 0 ? true : false;
        scope.onleavetext = function () {
            //scope.showmodel = false;
            $timeout(function () {
                scope.showmodel = false;
            }, 125)
        }
        scope.onfocus = function () {
            if (scope.songs.length > 0) {
                scope.showmodel = true;
            }
        }
        scope.chagetext = function () {
            if (scope.searchtext.length > 1) {
                $http.get(scope.API_URL + "search/songs/" + scope.searchtext).then(function (response) {
                    scope.songs = [];
                    if (response.status == 200) {
                        scope.songs = response.data.hits.hits;
                        scope.showmodel = scope.songs.length > 0 ? true : false;
                    }
                }, function (error) {
                    console.log(error);
                });
            } else {
                scope.songs = [];
            }
        }
        scope.selectItem = function (item) {
            scope.selectedSong = item._source;
            scope.searchtext = item._source.title;
        }
        scope.songToAdd = null;
        scope.player = null;
        scope.isPlayerOpen = false;
        scope.checkPlayerTimer = null;
        scope.playlistId = 0;
        localStorage.setItem('checkPlayerState', JSON.stringify({
            'state': 1,
            'uuid': scope.tabUUID,
            'type': 'single',
            'stage': 'init'
        }));
        window.addEventListener("storage", function (e) {
            if (e.key == "checkPlayerState") {
                var newVal = JSON.parse(e.newValue);
                if (newVal.state == 0 && newVal.uuid == scope.tabUUID) {
                    scope.isPlayerOpen = true;
                    if (newVal.stage != "init") {
                        if (scope.checkPlayerTimer != null) {
                            clearInterval(scope.checkPlayerTimer);
                        }
                        if (newVal.type == 'single') {
                            localStorage.setItem('song', 0);
                            localStorage.setItem('song', scope.songToAdd);
                            scope.songToAdd = null;
                        }
                        if (newVal.type == 'list') {
                            localStorage.setItem('playlist', 0);
                            localStorage.setItem('playlist', scope.playlistId);
                        }
                    }
                }
            }
            if (e.key == "playerclose") {
                if (e.newValue == 1) {
                    scope.isPlayerOpen = false;
                }
            }
        });
        scope.addToPlaylist = function (songId, type) {
            if (typeof songId != 'undefined') {
                scope.songToAdd = songId;
                //   localStorage.setItem('checkPlayerState', JSON.stringify({'state' : 1 , 'uuid' : scope.tabUUID,'type':type}));
                // setTimeout(function(){
                if (!scope.isPlayerOpen) {
                    scope.player = scope.openplayer(scope.SITE_URL + "player", "Sarigama Player", 400, 700);
                    scope.checkPlayerTimer = setInterval(function () {
                        localStorage.setItem('checkPlayerState', JSON.stringify({
                            'state': 0,
                            'uuid': scope.tabUUID,
                            'type': type,
                            'stage': 'add'
                        }));
                        localStorage.setItem('checkPlayerState', JSON.stringify({
                            'state': 1,
                            'uuid': scope.tabUUID,
                            'type': type,
                            'stage': 'add'
                        }));
                        console.log("checking player");
                    }, 1000);
                } else {
                    // scope.player.focus();
                    scope.checkPlayerTimer = setInterval(function () {
                        localStorage.setItem('checkPlayerState', JSON.stringify({
                            'state': 0,
                            'uuid': scope.tabUUID,
                            'type': type,
                            'stage': 'add'
                        }));
                        localStorage.setItem('checkPlayerState', JSON.stringify({
                            'state': 1,
                            'uuid': scope.tabUUID,
                            'type': type,
                            'stage': 'add'
                        }));
                        console.log("checking player");
                    }, 1000);
                }
                return false;
                // },1500);
            }
        }
        scope.openplayer = function (url, title, w, h) {
            // Fixes dual-screen position                         Most browsers      Firefox
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            //var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            var newWindow = window.open(url, '_blank');
            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }
            return newWindow;
        }
        scope.playAll = function (id) {
            scope.playlistId = id;
            scope.addToPlaylist(0, 'list');
        }
        scope.saveToPlaylist = function (playlist, song) {
            if (typeof playlist != 'undefined' && typeof song != 'undefined') {
                $http.get(scope.SITE_URL + "playlist/storesong/" + playlist + "/" + song).then(function (response) {
                    if (response.status == 200) {
                        if (response.data) alert("Added Successful");
                    }
                });
            }
        }
    }
})();
