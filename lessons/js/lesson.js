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
                    .attr('data-id', i+1);
            tp.append('<p>'+(i+1)+'</p>')
              .css('font-size', (randum-10)+'px')
              .css('line-height', randum+'px');
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
                initialize: function(x, y, w, h) {
                    Sprite.call(this, w, h);  //　継承元クラスの初期化処理
                    this.x = x;
                    this.y = y;
                    this.width = w;
                    this.height = h;     
                    this.image = this.createSurface(w, h); // サーフェスを画像としてセット
                    
                    let group = new Group();
                    // targetの中心に表示
                    let target_to_hit = new this.TargetToHit(x + w/4, y + h/4, w/2, h/2);
                    group.addChild(target_to_hit);
                    group.addChild(this);
                    core.rootScene.addChild(group);
                    
                    group.addEventListener(Event.TOUCH_START, function(e) {
                        this.addEventListener(Event.TOUCH_MOVE, onMove);
                    });

                    let onMove = function(e) {
                        this.x = e.x - x - w/2;
                        this.y = e.y - y - h/2;
                        if (isBridgeOver(e.target.firstChild, spBridge) || isStageOver(e.x, e.y, $('#stage').width(), $('#stage').height())) {
                            this.x = 0;
                            this.y = 0;
                            this.removeEventListener(Event.TOUCH_MOVE, onMove, false);
                        }
                    };

                    group.addEventListener(Event.TOUCH_END, function(e) {
                        if (isGoal(e.target.firstChild, spBridge.parentNode.lastChild)) {
                            if (stageId === endStageId) {
                                isEndLesson = true;
                            }
                            showStageClear(stageId, isEndLesson);
                        }
                    });
                },
                createSurface: function(width, height) {
                    let surface = new Surface(width, height);
                    // canvas 描画
                    surface.context.beginPath();
                    surface.context.fillStyle = "red";
                    surface.context.arc(Math.floor(width/2), Math.floor(height/2), Math.floor(width/2), 0, Math.PI / 180 * 360);
                    surface.context.fill();
                    return surface;
                },
                TargetToHit: Class.create(Sprite, {
                    initialize: function(x, y, w, h){
                        Entity.call(this, w, h);
                        this.x = x;
                        this.y = y;
                        this.width = w;
                        this.height = h;
                        this.backgroundColor = 'blue';
                    }
                })
            });

            let Bridge = Class.create(Sprite, {
                initialize: function(x, y, w, h) {
                    Sprite.call(this, w, h);  //　継承元クラスの初期化処理
                    this.x = x;
                    this.y = y;
                },
                createSurface: function(x, y, width, height, color) {
                    let surface = new Surface(width, height);
                    // canvas 描画
                    surface.context.save();
                    surface.context.beginPath();
                    surface.context.fillStyle = color;
                    surface.context.fillRect(x, y, width, height);
                    surface.context.fill();
                    surface.context.restore();
                    
                    return surface;
                },
                createGoalSurface: function(x, y, width, height) {
                    let surface = new Surface(width, height);
                    // canvas 描画
                    surface.context.save();
                    surface.context.beginPath();
                    surface.context.fillStyle = "blue";
                    surface.context.fillRect(0, 0, width, height);
                    surface.context.fill();
                    surface.context.restore();

                    return surface;
                },
                createLabel: function(str, x, y, w, h) {
                    let label = new Label(str);
                    label.x = x;
                    label.y = y;
                    label.font = '20px Arial';
                    label.color = 'white';
                    label.textAlign = 'center';
                    label.textBaseline = 'middle';
                    label.width = w;
                    label.height = h;
                    label.moveTo(x, y+h/2-10);

                    return label;
                },
                createSprite: Class.create(Sprite, {
                    initialize: function(x, y, w, h){
                        Sprite.call(this, w, h)
                        this.width = w;
                        this.height = h;
                        this.x = x;
                        this.y = y;
                    },
                    setSurface: function(surface) {
                        this.image = surface;
                    }
                }),
                draw: function() {
                    let tmp = this.changeBridgeByStage();
                    let bridges = tmp.bridges;
                    let start = tmp.start;
                    let goal = tmp.goal;

                    let group = new Group();
                    let spBridges = [];
                    for (let i = 0; i < bridges.length; i++) {
                        spBridges[i] = new this.createSprite(bridges[i].x, bridges[i].y, bridges[i].width, bridges[i].height);
                        spBridges[i].setSurface(this.createSurface(0, 0, bridges[i].width, bridges[i].height, "gray"));
                    }
                    group.addChild(this);
                    spBridges.forEach(function(item) {
                        group.addChild(item);
                    });
                    
                    let spStart = new this.createSprite(start.x, start.y, start.width, start.height);
                    spStart.setSurface(this.createSurface(0, 0, start.width, start.height, 'green'));
                    group.addChild(spStart);

                    group.addChild(this.createLabel('スタート', start.x, start.y, start.width, start.height));

                    let spGoal = new this.createSprite(goal.x, goal.y, goal.width, goal.height);
                    spGoal.setSurface(this.createGoalSurface(0, 0, goal.width, goal.height));

                    group.addChild(spGoal);
                    group.addChild(this.createLabel('ゴール', goal.x, goal.y, goal.width, goal.height));

                    core.rootScene.addChild(group);
                },
                changeBridgeByStage: function() { // ステージ番号によって、描画する橋をdrawメソッドに渡す
                    let now_stage = stageId.slice(-1);
                    if (now_stage === '1') {
                        return this.stage1Bridges();
                    }
                    if (now_stage === '2') {
                        return this.stage2Bridges();
                    }
                    if (now_stage === '3') {
                        return this.stage3Bridges();
                    }
                    return null;
                },
                stage1Bridges: function() {
                    let obj = {};
                    obj.start = { x: 660, y: this.y, width: 80, height: 80 }, // start
                    obj.bridges = [{ x: this.x, y: this.y, width: 740, height: 80 }],
                    obj.goal = { x: 0, y: this.y, width: 80, height: 80 } // goal
                    return obj;
                },
                stage2Bridges: function() {
                    let obj = {};
                    obj.start =  { x: this.x, y: 430, width: 80, height: 80 }, // start
                    obj.bridges = [{ x: this.x, y: this.y, width: 80, height: 510 }],
                    obj.goal = { x: this.x, y: 0, width: 80, height: 80 } // goal
                    return obj;
                },
                stage3Bridges: function() {
                    let obj = {};
                    obj.start =  { x: 310, y: 430, width: 80, height: 80 }, // start
                    obj.bridges = [{ x: this.x, y: this.y, width: 430, height: 80 }
                                ,{ x: 660, y: 0, width: 80, height: 510 }
                                ,{ x: 0, y: 0, width: 740, height: 80 }
                                ,{ x: 0, y: 0, width: 80, height: 250 }
                                ,{ x: 0, y: 250, width: 400, height: 80 }],
                    obj.goal = { x: 320, y: 250, width: 80, height: 80 } // goal
                    return obj;
                }
            });

            let spBridge;
            // 橋とターゲットを表示
            // ステージによって位置を帰る
            function drawBridgeAndTarget() {
                let now_stage = stageId.slice(-1);
                if (now_stage === '1') {
                    spBridge = new Bridge(0, $('#stage').height()/2, $('#stage').width(), 80);
                    spBridge.draw();
                    new Target($('#stage').width()-75, $('#stage').height()/2+5, 70, 70);
                }
                if (now_stage === '2') {
                    spBridge = new Bridge(310, 0, 80, 510);
                    spBridge.draw();
                    new Target(310+5, 430+5, 70, 70);
                }
                if (now_stage === '3') {
                    spBridge = new Bridge(310, 430, 80, 80);
                    spBridge.draw();
                    new Target(310+5, 430+5, 70, 70);
                }
            }

            drawBridgeAndTarget();
            
        };
        core.start()
    }

    // マウスがステージの範囲外に出た時の判定
    function isStageOver(ex, ey, sw, sh) {
        let isover = false;
        // exがステージ外
        if (ex > (sw - 10) || ex < 10) {
            isover =  true;
        }
        //eyがステージ害
        if (ey > (sh - 10) || ey < 10) {
            isover = true;
        }
        return isover;
    }

    // ターゲットが橋から出たときの判定
    function isBridgeOver(target, bridge) {
        let isOver = true;
        bridge.parentNode.childNodes.forEach(function(item) {
            if (target.intersect(item)) {
                isOver =  false;
            }
        });
        return isOver;
    }

    // ターゲットとゴール能力当たり判定
    function isGoal(target, goal) {
        if (target.intersect(goal)) {
            return true;
        }
        return false
    }

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