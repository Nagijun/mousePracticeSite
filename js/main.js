(function(){
    "use strict";
    // navのクリックイベントでiframeのsrcに追加
    $("nav dl dd").each(function(index,item) {
        if ($(item).find('a').length) {
            $(item).children('a').click(function(e) {
                // hrefのクリックイベントキャンセル
                e.preventDefault();
                let stage_id = "";
                stage_id = $(this).attr('data-stage');
                $('#lessonStage').attr('src', './lessons/lesson'+stage_id.slice(0,1)+'/lesson'+stage_id+'.html');
            });
        }
    });
})();