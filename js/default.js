/**
 * Created by konohanaruto on 2017/12/30.
 */

/**
 * 前端静态页专用的js文件，请不要在实际项目中将其它js写入该文件
 */

$.fn.selectRange = function(start, end) {
    if(!end) end = start;
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
}

$.fn.getCharacterLength = function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var length = val.charCodeAt(i);
        if(length>=0&&length<=128)
        {
            len += 1;
        }
        else
        {
            len += 2;
        }
    }
    return len;
}

$(function () {

    function adjustHeight(el, minHeight) {
        // compute the height difference which is caused by border and outline
        var outerHeight = parseInt(window.getComputedStyle(el).height, 10);
        var diff = outerHeight - el.clientHeight;

        // set the height to 0 in case of it has to be shrinked
        el.style.height = 0;

        // set the correct height
        // el.scrollHeight is the full height of the content, not just the visible part
        el.style.height = Math.max(minHeight, el.scrollHeight + diff) + 'px';
    }


    // we use the "data-adaptheight" attribute as a marker
    var textAreas = [].slice.call(document.querySelectorAll('textarea[data-adaptheight]'));

    // iterate through all the textareas on the page
    textAreas.forEach(function(el) {

        // we need box-sizing: border-box, if the textarea has padding
        el.style.boxSizing = el.style.mozBoxSizing = 'border-box';

        // we don't need any scrollbars, do we? :)
        el.style.overflowY = 'hidden';

        // the minimum height initiated through the "rows" attribute
        var minHeight = el.scrollHeight;

        el.addEventListener('input', function() {
            adjustHeight(el, minHeight);
        });

        // we have to readjust when window size changes (e.g. orientation change)
        window.addEventListener('resize', function() {
            adjustHeight(el, minHeight);
        });

        // we adjust height to the initial content
        adjustHeight(el, minHeight);

    });

    var homePublishTrendTextarea = $('.publish-trend-modal textarea.js-trend-content');
    $('.publish-trend-modal .tag-list .js-add-tag').on('click', function () {
        $(this).parents('.publish-trend-modal').find('.js-placeholder').addClass('hide');

        if ($(this).hasClass('custom-tag')) {
            homePublishTrendTextarea.val(homePublishTrendTextarea.val() + '##').selectRange(1);
        } else {
            homePublishTrendTextarea.val(homePublishTrendTextarea.val() + $(this).html());
        }
    });

    homePublishTrendTextarea.on('focus', function () {
        if (! $(this).val()) {
            $('.publish-trend-modal').find('.js-placeholder').addClass('hide');
        }
    });

    homePublishTrendTextarea.on('blur', function () {
        if (! $(this).val()) {
            $('.publish-trend-modal').find('.js-placeholder').removeClass('hide');
        }
    });

    homePublishTrendTextarea.on('input keyup', function (e) {
        var contentLength = $.fn.getCharacterLength($(this).val());
        $(this).parent().find('.js-word-count').html(contentLength);
        $(this).parent().find('.js-word-count').removeClass('warning');

        if (contentLength > 163) {
            $(this).parent().find('.js-word-count').addClass('warning');
        }
    });

    $('.publish-trend-modal .icon-close').on('click', function () {
        $('.publish-trend-modal').addClass('hide');
    });

    $('.upload-bar .g-upload-photo-trigger').on('click', function () {
        $('.publish-trend-modal').removeClass('hide');
    });
});