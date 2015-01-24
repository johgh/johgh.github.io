jQuery.fn.selectText = function() {
    var doc = document
    var element = this[0];
    var range;
    var selection;

    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
$(function(){
    $('.selectButton').click(function() {
        var id = $(this).data('id');
        $(id).selectText();
    });
});
