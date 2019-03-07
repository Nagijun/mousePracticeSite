(function(){
    "use strict";
    // 例）1-1
    let id_clearStage = $('body main iframe', parent.document).data('id');
    let this_lesson = id_clearStage.slice(0,1);
    // lessonクリア画面表示切替
    let titles = $('main div[data-lesson]');
    titles.each(function(index, title) {
        if ($(title).data('lesson').toString() === this_lesson) {
            $(title).removeClass('title-hide');
        } else {
            $(title).addClass('title-hide');
        }
    });
})();