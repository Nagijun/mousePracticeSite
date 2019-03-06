(function(){
    "use strict";
    // navのクリックイベントでiframeのsrcに追加
    $("nav dl dd").each(function(index,item) {
        if ($(item).find('a').length) {
            $(item).click(function() {
                let stageId = "";
                stageId = $(this).children('a').attr('data-stage');
                $('main iframe').attr('src', '/lessons/lesson'+stageId.slice(0,1)+'/lesson'+stageId+'.html');
            });
        }
    });
})();