(function(){
    "use strict";
    // navのクリックイベントでiframeのsrcに追加
    $("nav dl dd").each(function(index,item) {
        if ($(item).find('a').length) {
            $(item).children('a').click(function(e) {
                // hrefのクリックイベントキャンセル
                e.preventDefault();
                let stageId = "";
                stageId = $(this).attr('data-stage');
                $('#lessonStage').attr('src', '/lessons/lesson'+stageId.slice(0,1)+'/lesson'+stageId+'.html');
            });
        }
    });
})();