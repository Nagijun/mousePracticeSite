(function(){
    "use strict";

    let targetPoints = [];

    // targetPointを5つ生成
    // width,height(20～100)ランダム
    // width === height
    // 配列targetPointsに格納
    function createRandSizeTarget() {
        let max_width = 100,min_width = 20;

        for (let i = 0; i < 5; i++) {
            let randum = getRandum(min_width, max_width);
            let tp = $('<div></div>')
                    .css('width', randum+"px")
                    .css('height', randum+"px")
                    .addClass('target-point')
                    .text(i+1)
                    .hover(function() {
                        $(this).fadeOut();
                    });
            targetPoints.push(tp);
        }
    }
    
    // stage範囲を8つの区画に割る
    // 戻り値：stages[]
    // {top: st_top, left: st_left, width: st_width, height: st_height};
    function getStageKukakus(stage) {
        let stages = [];
        // stage区画のwidth,heightを取得
        let st_width = Math.floor(stage.width()/4);
        let st_height = Math.floor(stage.height()/2);
        let st_top = 0;
        let st_left = 0;
        let len = 8;
        for (let i = 0; i < len; i++) {
            st_left = st_width*i;
            if (i > (len/2)-1) {
                st_top = st_height;
                st_left = st_width*(i-(len/2));
            }
            let hash = {top: st_top, left: st_left, width: st_width, height: st_height};
            stages.push(hash); 
        }
        return stages;
    }

    // #stageの範囲にtargetPointをランダム表示
    // stageによって範囲を変える
    // TP:targetPoint
    function showTP() {
        let stage = $('#stage');
        // stagesKukakuをシャッフル
        let st_kukakus = getStageKukakus(stage);
        st_kukakus.shuffle();
        console.log(st_kukakus);
        createRandSizeTarget();
        targetPoints.forEach(function(item,index) {
            // stage区画領域からはみ出さないようにTopとLeftを生成
            let thisTop = getRandum(st_kukakus[index].top, 
                                    st_kukakus[index].top+st_kukakus[index].height-Math.floor($(item).height())
                                    );
            let thisLeft = getRandum(st_kukakus[index].left, 
                                    st_kukakus[index].left+st_kukakus[index].width-Math.floor($(item).width())
                                    );
            $(item).css('top', thisTop);
            $(item).css('left', thisLeft);
        });
        stage.html(targetPoints);
    }
    showTP();
})();