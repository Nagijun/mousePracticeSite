(function(){
    "use strict";

    // 例）1-1
    let id_clear_stage = $('body main iframe', parent.document).data('id');
    let next_stage = parseInt(id_clear_stage.slice(-1),10) + 1;
    let no_lesson = id_clear_stage.slice(0,1);

    // クリア画面表示
    // id_clear_stage（例：1-1）と同じtitleを表示、その他は非表示
    function showClearView() {
        let titles = $('header .title');
        titles.each(function(index, title) {
            if ($(title).data('stage') === id_clear_stage) {
                $(title).removeClass('title-hide');
            } else {
                $(title).addClass('title-hide');
            }
        });
        $('#stageClear').text('ステージ'+id_clear_stage+'クリア！');
        $('#nextStage a').attr('href','../lesson'+no_lesson+'/lesson'+no_lesson+'-'+next_stage+'.html');
    }
    showClearView();
})();