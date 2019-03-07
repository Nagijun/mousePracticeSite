(function(){
    "use strict";

    // 例）1-1
    let id_clearStage = $('body main iframe', parent.document).data('id');
    let nextStage = parseInt(id_clearStage.slice(-1),10) + 1;
    let no_lesson = id_clearStage.slice(0,1);

    // クリア画面表示
    // id_clearStage（例：1-1）と同じtitleを表示、その他は非表示
    function showClearView() {
        let titles = $('header .title');
        titles.each(function(index, title) {
            if ($(title).data('stage') === id_clearStage) {
                $(title).removeClass('title-hide');
            } else {
                $(title).addClass('title-hide');
            }
        });
        $('#stageClear').text('ステージ'+id_clearStage+'クリア！');
        $('#nextStage a').attr('href','../lesson'+no_lesson+'/lesson'+no_lesson+'-'+nextStage+'.html');
    }
    showClearView();
})();