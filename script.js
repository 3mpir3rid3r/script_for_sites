

//-------------------------------sarigama script------------------------------------//

var playListId = '8d4e080d-9d7d-4f2c-a244-fca0a3eb84ac';

$('#tracks').find('a').each(function (key, value) {
	var elm = $(this);
    var s = elm.attr('href').split('/');

    $.get('https://sarigama.lk/playlist/storesong/' + playListId + '/' + s[s.length - 1], function (data) {
		
		if(data== true){
			elm.css('background','#b4deb4');
			console.log(s[s.length - 1] + ' --> ' + data);
		}else{
			elm.css('background','#ffa4a4');
			console.log(s[s.length - 1] + ' --> ' + data);			
		}
		
    });

});


//------------------------------today tv searis script------------------------------------//

var x, i,y;
x = document.querySelectorAll("a.hvr-icon-sink-away");
for (i = 0; i < x.length; i++) {
	y= x[i].getAttribute("href");
	window.open(y,'_blank');
}

//------------------------------baiscopelk script(incomplete)------------------------------------//

function downloadFile(url) {
	$.get(url, function (data) {
		var page = $(data);
		var found = $('a', page);
		$.each(found, function (index, value) {
			var html = $(value).html();
			if (html.indexOf('සිංහල උපසිරැසි මෙතනින් බාගන්න') != -1) {
				window.open($(value).attr('href'), '_blank');
				$.each(found, function (index, value) {
					var html = $(value).html();
					if (html.indexOf('Next Episode >>') != -1) {
						downloadFile($(value).attr('href'));
					}
				});
			}
		});
	});
}

if (typeof jQuery == 'undefined' || jQuery.fn.jquery != '3.3.1') {
	var jq = document.createElement('script');
	jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
	document.getElementsByTagName('head')[0].appendChild(jq);
	setTimeout(downloadFile(window.location.href), 3000);
} else {
	downloadFile(window.location.href);
}



//------------------------------seedr link genarate for file------------------------------------//
  $('div[folder_file_id]').each(function () {
        $.post("https://www.seedr.cc/content.php?action=fetch_file", {folder_file_id: $(this).attr('folder_file_id').toString()}, function (data) {
            console.log(data.url);
        });
    })

//------------------------------seedr link genarate for folder------------------------------------//
  $('div[folder_id]').each(function () {
        $.post("https://www.seedr.cc/content.php?action=create_empty_archive", {folder_id: 4565362,archive_arr: {type:"folder",id:$(this).attr('folder_id').toString()}}, function (data) {
            console.log(data.archive_url);
        });
    })

//------------------------------pcloud upload script------------------------------------//

var a = $('textarea[name="upload"]').val()
    var b = a.split("\n");
    $.each(b, function (i, v) {
        $.post("https://api7.pcloud.com/downloadfile", {
            folderid: 0,
            progresshash: 'upload-16152850-xhr-359',
            nopartial: 1,
            url: v,
            auth: '5QS5hkZIopH7ZrTaYUpD75fpThAl1ztrLqhxwiGtk'
        }, function (data) {
            console.log(data);
        });
    })
