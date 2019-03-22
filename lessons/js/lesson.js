(function(){
    "use strict";

    let targetPoints = [];
    let hideTPCount = 0;
    let stageId = "";       /* 例）1-1 */
    let endStageId = "";    /* 例）1-3 */
    let answerId = "0";     /* レッスン４の時に使う */
    let isEndLesson = false;

    const MAX_TARGET = 5;
    const MIN_TARGET = 1;
    const STAGE_KUKAKU = 8;

    //lesson4で使うtargetのカラー情報クラス
    // class TargetColorInfo {
    //     constructor(id, color_class, item_key) {
    //         this.id = id,
    //         this.color_class = color_class;
    //         this.item_key = item_key;
    //     }
    // }

    function getTargetColorInfo(id, color_class, item_key) {
        let obj = { "id":id, "color_class":color_class, "item_key":item_key };
        return obj;
    }
    // targetPointを5つ生成
    // width,height(20～100)ランダム
    // width === height
    // 配列targetPointsに格納
    // [参考]targetPointもオブジェクト化したほうがいいかも
    function createRandSizeTarget() {
        let max_width = 100,min_width = 20;

        for (let i = 0; i < MAX_TARGET; i++) {
            let randum = getRandum(min_width, max_width);
            // lesson5の時は一個だけ
            // width:50px;
            let les_no = stageId.slice(0,1);
            if(les_no === "5") {
                randum = 70;
            }
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
        for (let i = 0; i < STAGE_KUKAKU; i++) {
            st_left = st_width*i;
            if (i > (STAGE_KUKAKU/2)-1) {
                st_top = st_height;
                st_left = st_width*(i-(STAGE_KUKAKU/2));
            }
            let tmp = {top: st_top, left: st_left, width: st_width, height: st_height};
            stages.push(tmp); 
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
        // lesson5時以外、生成する
        if (stageId.slice(0,1) !== '5') {
            createRandSizeTarget();
        }
        targetPoints.forEach(function(item,index) {
            // stage区画領域からはみ出さないようにTopとLeftを生成
            let this_top = getRandum(st_kukakus[index].top, 
                                    st_kukakus[index].top+st_kukakus[index].height-Math.floor($(item).height())
                                    );
            let this_left = getRandum(st_kukakus[index].left, 
                                    st_kukakus[index].left+st_kukakus[index].width-Math.floor($(item).width())
                                    );
            $(item).css('top', this_top);
            $(item).css('left', this_left);
        });
        stage.append(targetPoints);
    }

    // targetの消えた個数をカウントし、hideTPCountにセット
    // targetPointによってmouseenterイベントを生成
    // mouseenterしたら、消える
    function setEventOfLesson1() {
        // target全てにmouseenterイベント実装
        targetPoints.forEach(function(item,index) {
            $(item).on({
                'mouseenter': function() {
                    // 順番通りhoverしていく処理
                    let id = $(this).attr('data-id');
                    if (String(hideTPCount+1) !== id) {
                        return;
                    }
                    $(this).fadeOut();
                    hideTPCount++;
                    $(this).off('mouseenter');
                    if(hideTPCount === MAX_TARGET) {
                        if (stageId === endStageId) {
                            isEndLesson = true;
                        }
                        showStageClear(stageId, isEndLesson);
                    }
                }
            });
        });
    }

    function setEventOfLesson2() {
        targetPoints.forEach(function(item,index) {
            $(item).on({
                'click': function() {
                    // 順番通りclickしていく処理
                    let id = $(this).attr('data-id');
                    if (String(hideTPCount+1) !== id) {
                        return;
                    }
                    $(this).fadeOut();
                    hideTPCount++;
                    $(this).off('click');
                    if(hideTPCount === MAX_TARGET) {
                        if (stageId === endStageId) {
                            isEndLesson = true;
                        }
                        showStageClear(stageId, isEndLesson);
                    }
                }
            });
        });
    }

    function setEventOfLesson3() {
        targetPoints.forEach(function(item,index) {
            $(item).on({
                'dblclick': function() {
                     // 順番通りdblclickしていく処理
                     let id = $(this).attr('data-id');
                     if (String(hideTPCount+1) !== id) {
                         return;
                     }
                    $(this).fadeOut();
                    hideTPCount++;
                    $(this).off('dblclick');
                    if(hideTPCount === MAX_TARGET) {
                        if (stageId === endStageId) {
                            isEndLesson = true;
                        }
                        showStageClear(stageId, isEndLesson);
                    }
                }
            });
        });
    }

    function setEventOfLesson4() {
        targetPoints.forEach(function(target,index) {
            // targetに対して、新しいコンテキストメニュー実装
            createContextMenu(target);
            // answerIdの初期値をターゲットのdata属性に格納
            $(target).attr("data-color_id", answerId);
            $(target).on({
                'contextmenu': function() {
                    $(this).off('contextmenu');
                }
            });
        });
    }

    function setEventOfLesson5() {
        enchant();
        let core = new Core($('#stage').width(), $('#stage').height());
        core.fps = 30;
        core.onload = function() {
            let Target = Class.create(Sprite, {
                initialize: function(x, y) {
                    Sprite.call(this, 40, 40);  //　継承元クラスの初期化処理
                    this.x = x;
                    this.y = y;                
                    this.image = this.createSurface(40, 40); // サーフェスを画像としてセット
                    core.rootScene.addChild(this);	// シーンに追加

                    this.on('touchmove', function(e) {
                        this.x = e.x - 20;
                        this.y = e.y - 20;
                    });
                },
                createSurface: function(width, height) {
                    let surface = new Surface(width, height);
                    // canvas 描画
                    surface.context.beginPath();
                    surface.context.fillStyle = "red";
                    surface.context.arc(20, 20, 20, 0, Math.PI / 180 * 360);
                    surface.context.fill();
                    return surface;
                }
            });
            let target = new Target($('#stage').width()-100,$('#stage').height()/2);
        };
        core.start();
    }

    let rand = function(n) {
        return Math.floor(Math.random() * (n+1));
    };

    // contextmenuの生成
    function createContextMenu(target) {
        let target_select = "div.target-point[data-id="+$(target).data('id')+"]";
        let target_all = "div.target-point";
        let arr_target_color_info = [];
        // 1.colorID
        // 2.class名
        // 3.itemsのKey名
        //IE対応するため、コメント
        // arr_target_color_info.push(new TargetColorInfo("1","target-back-blue","change-blue"));
        // arr_target_color_info.push(new TargetColorInfo("2","target-back-yellow","change-yellow"));
        // arr_target_color_info.push(new TargetColorInfo("3","target-back-green","change-green"));
        arr_target_color_info.push(getTargetColorInfo("1","target-back-blue","change-blue"));
        arr_target_color_info.push(getTargetColorInfo("2","target-back-yellow","change-yellow"));
        arr_target_color_info.push(getTargetColorInfo("3","target-back-green","change-green"));
        $.contextMenu({
            selector: target_select,
            callback: function(key, options) {
                arr_target_color_info.forEach(function(item) {
                    // targetの背景色変更
                    if(key === item.item_key) {
                        $(target_select).addClass(item.color_class)
                                        .attr('data-color_id', item.id);
                    } else {
                        $(target_select).removeClass(item.color_class);
                    }
                });
                // 全てのターゲットを検査
                /* 例）
                    レッスン：すべて青色
                    　　現在：一つだけ青色、他すべて何も変わっていない
                    青色ターゲットのdata-color_id：1(TargetColorInfo("1","target-back-blue","change-blue"))
                                               他：0
                    1.全てのターゲットをループでdata-color_id取得
                    2.現在のステージ番号が正しいcolor_idとなるので、
                    3.ステージ番号 === color_id　の時
                    4.hideTPCount++
                */
                $(target_all).each(function() {
                    let this_id = String($(this).attr('data-color_id'));
                    if (this_id === stageId.slice(-1)) {
                        hideTPCount++;
                    }
                });
                if(hideTPCount === MAX_TARGET) {
                    if (stageId === endStageId) {
                        isEndLesson = true;
                    }
                    showStageClear(stageId, isEndLesson);
                }
                // 初期化
                hideTPCount = 0;
            },
            items: {
                "change-blue": {name: "青色に変更", icon: "fas fa-palette icon-blue"},
                "change-yellow": {name: "黄色に変更", icon: "fas fa-palette icon-yellow"},
                "change-green": {name: "緑色に変更", icon: "fas fa-palette icon-green"}
            }
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
                endStageId = end_stages[parseInt(end_l)-1];
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
        if (no_lesson === '3') {
            setEventOfLesson3();
        }
        if (no_lesson === '4') {
            setEventOfLesson4();
        }
        if (no_lesson === '5') {
            setEventOfLesson5();
        }
    }

    showTP();
    setEventTarget();
})();