function scrollToBottom() {
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}
function runProcess() {
    setTimeout(function () {
        var elms = document.querySelectorAll('button._54k8._52jg._56bs._26vk._2b4n._8yzq._3cqr._8yo0._56bt');
		if (elms && elms.length > 0) {
            console.error('Fetch data from page ' + elms.length);
            for (; i < elms.length; i++) {
			    console.error('Fetch data from page ' + elms.length);
                elms[i].click();
            }
        } else {
            window.reload();
        }
        scrollToBottom();
        runProcess();
    }, 5000)
}
var i = 0;
var scrollingElement = (document.scrollingElement || document.body);
runProcess();
