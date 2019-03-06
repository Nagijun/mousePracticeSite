"use strict";

// min～maxまでのランダム数値を返す
function getRandum(min, max) {
    return Math.round(Math.random()*(max+1-min)) + min;
}

// shuffle実装
Array.prototype.shuffle = function() {
    //値を入れ替えるために、３つの変数を用意。tmpは一時変数
    let i,j,tmp;
    //i--で、直前に入れ替わった値の1個前にある値を入れ替えの対象とする
    for (i = this.length-1; i > 0; i--) {
        // 乱数を回し、入れ替える値を選ぶ
        j = Math.floor(Math.random()*(i+1));
        // 配列i番目とj番目を入れ替える
        tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }
    return this;
}

// ステージクリア画面表示
// レッスンが終了したらisEndLesson = true
// stage_id 例) 1-1
//(stage_id, isEndLesson)=(str, bool)
function showStageClear(stage_id, isEndLesson) {
    if(isEndLesson) {
        $('body main iframe', parent.document)
            .attr('src','/lessons/lesson1/lessonClear.html')
            .attr('data-id',stage_id);
            return;
    }
    $('body main iframe', parent.document)
        .attr('src', '/lessons/lesson1/stageClear.html')
        .attr('data-id',stage_id);
}