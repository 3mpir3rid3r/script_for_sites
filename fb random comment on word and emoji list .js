

var wordList = ['ඒක ලස්සනයි', 'හොදට ලියල තියනවා', 'පට්ට', 'ජයවේවා', 'eekagathi', 'Lassanayi nangi', 'හරිම ලස්සනයි නිර්මාණය', 'ft', 'lassnai sis', 'මරූඌඌඌඌඌ', 'thawa liyanna', 'suba pathum', 'ගති ආආ', 'සුන්දරයි', 'ආශ්වාදනීයයි', 'nice', 'Amazing', 'lassanai'];
var emojiList = ['😍', '😘', '😋', '😗', '😙', '😚', '😲', '🤗', '😃', '😊', '👍', '💯', '😮', '😯', '😲', '😵', '😱', '👌', '🙌', '🏆', '🏅', '😀', '😻', '🙈', '😽'];


function randomNumber(min, max) {
    var val = Math.floor(Math.random() * (max - min + 1) + min);
    return val;
}


setTimeout(function () {

    var text = '';
    var activeText = 0;
    var leadEmoji = 0;
    var endEmoji = 0;
    var activeEmoji = 0;

    activeText = randomNumber(0, 1);
    leadEmoji = randomNumber(0, 1);
    endEmoji = randomNumber(0, 1);

    if (activeText == 1) {
        activeEmoji = randomNumber(0, 1);
    } else {
        activeEmoji = 1;
    }

    if (activeEmoji == 1 && endEmoji == 0 && leadEmoji == 0) {
        leadEmoji = 1;
    }

    if (activeEmoji == 1 && leadEmoji == 1) {
        text = ' ' + text + ' ' + emojiList[randomNumber(0, emojiList.length - 1)];
    }

    if (activeText == 1) {
        text = ' ' + text + ' ' + wordList[randomNumber(0, wordList.length - 1)];
    }

    if (activeEmoji == 1 && endEmoji == 1) {
        text = ' ' + text + ' ' + emojiList[randomNumber(0, emojiList.length - 1)];
    }
    document.querySelector("input[name='comment_text']").value = text;
    HTMLFormElement.prototype.submit.call(document.querySelectorAll("form[onsubmit]")[0]);
}, randomNumber(2000, 6000));
