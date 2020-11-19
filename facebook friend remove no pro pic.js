function getParents(el, selector) {
    var n = el;
    do {
        n = n.parentNode;
    }
    while (!n.matches(selector) && n !== document.body);
    return n;
}

function getSiblingsList(n, skipMe, selector) {
    for (; n; n = n.nextSibling) {
        if (n.nodeType == 1 && n != skipMe && n.matches(selector)) {
            return n;
        }
    }
    return null;
}

function getSiblings(n, selector) {
    return getSiblingsList(n.parentNode.firstChild, n, selector);
}

function scrollToBottom() {
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function runProcess() {
    setTimeout(function () {
        var elms = document.querySelectorAll('i[style*="84688533_170842440872810_7559275468982059008_n"], i[style*="84241059_189132118950875_4138507100605120512_n"]');

        if (elms && elms.length > 0) {
            console.error('Fetch data from page ' + elms.length);
            for (; i < elms.length; i++) {
                var parent = getParents(elms[i], '._8yo0')
                if (parent) {
                    var buttonParent = getSiblings(parent, '._8-j9');
                    if (buttonParent) {
                        var button = buttonParent.querySelectorAll('button._54k8._52jg._56bs._26vk._3cqr._8yzo._8yo0._56bt');
                        if (button) {
                            button[0].click();
                            var link = buttonParent.querySelectorAll('a._54k8._55i1._58a0.touchable');
                            if (link) {
                                link[1].click();
                                console.log(elms[i].getAttribute('aria-label').split(',')[0] + ' > Removed.');
                            } else {
                                console.log('Link error');
                            }
                        } else {
                            console.log('Button error');
                        }
                    } else {
                        console.log('Siblings error');
                    }
                } else {
                    console.log('Parent error');
                }
            }
        } else {
            console.log('No data on page');
        }
        scrollToBottom();
        runProcess();
    }, 10000)
}
var i = 0;
var scrollingElement = (document.scrollingElement || document.body);
runProcess();
