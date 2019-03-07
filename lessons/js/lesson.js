(function(){
    "use strict";

    let targetPoints = [];
    let hideTPCount = 0;
    let stageId = "";
    let end_stageid = "";
    let isEndLesson = false;
    const MAX_TARGET = 5;

    // targetPointを5つ生成
    // width,height(20～100)ランダム
    // width === height
    // 配列targetPointsに格納
    function createRandSizeTarget() {
        let max_width = 100,min_width = 20;

        for (let i = 0; i < MAX_TARGET; i++) {
            let randum = getRandum(min_width, max_width);
            let tp = $('<div></div>')
                    .css('width', randum+"px")
                    .css('height', randum+"px")
                    .addClass('target-point')
                    .attr('data-id', i+1)
                    .text(i+1);
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

    // #stage区画の範囲にtargetPointをランダム表示
    // TP:targetPoint
    function showTP() {
        let stage = $('#stage');
        setStageId(stage.data('stage'));
        setEndStageId(stageId);
        // stagesKukakuをシャッフル
        let st_kukakus = getStageKukakus(stage);
        st_kukakus.shuffle();
        // ターゲットを5つ生成し、targetPointsに格納
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

    // targetの消えた個数をカウントし、hideTPCountにセット
    // targetPointによってmouseenterイベントを生成
    // mouseenterしたら、消える
    function setEventOfLesson1() {
        // target全てにmouseenterイベント実装
        targetPoints.forEach(function(item,index) {
            $(item).on({
                'mouseenter': function() {
                    $(this).fadeOut();
                    hideTPCount++;
                    $(this).off('mouseenter');
                    if(hideTPCount === MAX_TARGET) {
                        if (stageId === end_stageid) {
                            isEndLesson = true;
                        }
                        showStageClear(stageId, isEndLesson);
                    }
                }
            });
        });
    }

    function setEventOfLesson2() {
        // target全てにmouseenterイベント実装
        targetPoints.forEach(function(item,index) {
            $(item).on({
                'click': function() {
                    $(this).fadeOut();
                    hideTPCount++;
                    $(this).off('mouseenter');
                    if(hideTPCount === MAX_TARGET) {
                        if (stageId === end_stageid) {
                            isEndLesson = true;
                        }
                        showStageClear(stageId, isEndLesson);
                    }
                }
            });
        });
    }

    // stageIDを変数にセット
    function setStageId(stage_id) {
        stageId = stage_id;
    }

    // stageの終了IDを変数にセット
    function setEndStageId(stage_id) {
        let end_stages = [];
        let end_lessons = [];
        $('nav dl dd', parent.document).each(function() {
            end_stages.push($(this).children('a').data('endstage'));
        });
        end_stages.forEach(function(end_s) {
            end_lessons.push(end_s.slice(0,1));
        });
        end_lessons.forEach(function(end_l) {
            if (stage_id.slice(0,1) === end_l) {
                end_stageid = end_stages[parseInt(end_l)-1];
            }
        });
    }

    // 各レッスン事,targetにイベントを設定
    function setEventTarget() {
        let no_lesson = stageId.slice(0,1);
        if (no_lesson === '1') {
            setEventOfLesson1();
        }
        if (no_lesson === '2') {
            setEventOfLesson2();
        }
    }

    showTP();
    setEventTarget();
})();