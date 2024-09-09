let saikoroCounts = {};
const maxSaikoroCount = 3;

let saikoroCountNew = 0;
const maxSaikoroCountNew = 3;

let ChildSaikoroDone = false;   //子と親が振り終わったかどうか
let ParentSaikoroDone = false;

let childGold = 1000;;
let parentGold = 1000;;

let beforeChildGold = childGold;
let beforeParentGold = parentGold;

let childCount = 0;
let childDoneCount = 0;

function addChild(){
    childCount++;

    const childDiv = document.createElement('div');
    childDiv.id = `child-${childCount}`;
    childDiv.innerHTML = `
         <h1>子 ${childCount}</h1>
            <p>
                <img id="sainome${childCount * 3 - 2}" src="dice/1.jpg" width="50" height="50">
                <img id="sainome${childCount * 3 - 1}" src="dice/1.jpg" width="50" height="50">
                <img id="sainome${childCount * 3}" src="dice/1.jpg" width="50" height="50">
            </p>
            <p><button id="saikoroButton${childCount}" onclick="Saikoro(${childCount});">サイコロを振る</button></p>
            <p id="kekka${childCount}"></p>
            <p id="yaku${childCount}"></p>
            <p id="counter${childCount}"></p>
            <p id="childGold${childCount}">ゼニー: 1000</p>
            <p id="bet${childCount}">ベット</p>
            
        <h2>ベット</h2>
            <p>ゼニー: <input type="number" id="betAmount${childCount}" value="100" min="1"></p>
    `;

    //子を<id="childContainer">に追加
    document.getElementById('childContainer').appendChild(childDiv);
}

function deleteChild(){
    if (childCount === 0) return;

    const childDiv = document.getElementById(`child-${childCount}`);
    if (childDiv) {
        childDiv.remove();  // 親ノードから削除する
    }

    childCount--;
}

function getBetAmount(){
    //賭け金の取得
    let betAmount = parseInt(document.getElementById(`betAmount${childCount}`).value);
    //賭け金が無効な場合（負の値とか）の処理
    return isNaN(betAmount) || betAmount <= 0 ? 100 :betAmount;
}

//子のサイコロ
function Saikoro(childId){
    if(!saikoroCounts[childId]){
        saikoroCounts[childId] = 0; //初回でカウント初期化
    }

    if(saikoroCounts[childId] < maxSaikoroCount){
        saikoroCounts[childId]++;
        let results = [];
        let images = [];
        
        //サイコロ三つ振る処理
        for (let i = 0; i<3; i++){
            let saikoro = Math.floor( Math.random() *6) +1; //ランダムで１～６の数字を作る
            results.push(saikoro);
            images.push("dice/"+ saikoro + ".jpg");
        }

        //結果の表示
        document.getElementById(`kekka${childId}`).innerHTML = `サイコロの結果: ${results.join(",")}`;
        document.getElementById(`sainome${childId * 3 - 2}`).src = images[0];
        document.getElementById(`sainome${childId * 3 - 1}`).src = images[1];
        document.getElementById(`sainome${childId * 3}`).src = images[2];
        document.getElementById(`counter${childId}`).innerHTML = saikoroCounts[childId]+"回目"

        //役判定と表示
        let yaku = 役判定(results);
        document.getElementById(`yaku${childId}`).innerHTML = "役:"+yaku;  

        //役が出るか、3回振ってボタン無効
        if(yaku !== "役無し" || saikoroCounts[childId] >= maxSaikoroCount){
            document.getElementById(`saikoroButton${childId}`).disabled = true;
            childDoneCount++;

            //親ボタンを有効にする
            if(childDoneCount >= childCount){
                document.getElementById("saikoroButtonNew").disabled = false;
            } 
        }
    }
}

//親のサイコロ
function SaikoroNew(){
    if(saikoroCountNew < maxSaikoroCountNew && childDoneCount >= childCount){
        saikoroCountNew++;
        let results = [];
        let images = [];

        //サイコロ三つ振る
        for (let i = 0; i<3; i++){
            let saikoro = Math.floor( Math.random() *6) +1; //ランダムで１～６の数字を作る
            results.push(saikoro);
             images.push("dice/"+ saikoro + ".jpg");
        }

        //結果の表示
        document.getElementById("kekkaNew").innerHTML = `サイコロの結果: ${results.join(",")}`;
        document.getElementById("sainomeP1").src = images[0];
        document.getElementById("sainomeP2").src = images[1];
        document.getElementById("sainomeP3").src = images[2];
        document.getElementById("counterNew").innerHTML = saikoroCountNew+"回目"

        //役判定と表示
        let yaku = 役判定(results);
        document.getElementById("yakuNew").innerHTML = "役:"+yaku;  

        //役が出るか、3回振ってボタンを無効化
        if(yaku !== "役無し" || saikoroCountNew >= maxSaikoroCountNew){
            document.getElementById("saikoroButtonNew").disabled = true;
            ParentSaikoroDone = true;
        }
        
        //勝敗判定
        if(ChildSaikoroDone && ParentSaikoroDone ){
            勝敗判定();
            document.getElementById("resetButton").disabled = false;
        }
    }
}


function 特殊役(array,elements){
    return elements.every(elements => array.includes(elements));
}

function 役判定(results){
    let shigoro = [4,5,6];
    let hihumi = [1,2,3];

    if(results[0] == results[1] && results[1] == results[2] ){
        if(results[0] == 1){
            return "ピンゾロ"
        }else if(results[0] == 2){
            return "2のアラシ"
        }else if(results[0] == 3){
            return "3のアラシ"
        }else if(results[0] == 4){
            return "4のアラシ"
        }else if(results[0] == 5){
            return "5のアラシ"
        }else{
            return "6のアラシ"
        }
    }else if(特殊役(results,shigoro)){
        return "シゴロ"
    }else if(特殊役(results,hihumi)){
        return "ヒフミ"
    }else if(results[0] == results[1]){
        return results[2] 
    }else if(results[0] == results[2]){
        return results[1]
    }else if(results[1] == results[2]){
        return results[0]
    }else{
        return "役無し"
    }
}

function 役の強さ(yaku){
    switch(yaku){
        case "ピンゾロ":return 14; 
        case "6のアラシ":return 13;
        case "5のアラシ":return 12;
        case "4のアラシ":return 11;
        case "3のアラシ":return 10;
        case "2のアラシ":return 9;
        case "シゴロ":return 8;
        case "6":return 7;
        case "5":return 6;
        case "4":return 5;
        case "3":return 4;
        case "2":return 3;
        case "1":return 2;
        case "役無し":return 1;
        case "ヒフミ":return 0;
        default:return -1;
    }
}

function 勝敗判定(childId){
    //賭け金取得
    let betAmount = getBetAmount();

    //役を取得
    const childYaku = document.getElementById(`yaku${childId}`).innerHTML.replace('役:','');
    const parentYaku = document.getElementById("yakuNew").innerHTML.replace('役:','');

    //役を数値変換
    let childValue = 役の強さ(childYaku);
    let parentValue = 役の強さ(parentYaku);

    //変動額初期値
    let childGoldChange = 0;
    let parentGoldChange = 0;

    //勝敗判定
    if(childValue > parentValue){   //子勝ち
        if(parentValue == 0){   //親ヒフミで
            if(childValue == 14){   //ピンゾロ
                childGoldChange += betAmount * 10;
                parentGoldChange -= betAmount * 10;
            } else if (childValue == 13 || childValue == 12 || childValue == 11 || childValue == 10 || childValue == 9){    //アラシ
                childGoldChange += betAmount * 6;
                parentGoldChange -= betAmount * 6;
            } else if(childValue == 8){    //シゴロ
                childGoldChange += betAmount * 4;
                parentGoldChange -= betAmount * 4;
            } else {    //ヒフミと出目
                childGoldChange += betAmount * 2;
                parentGoldChange -= betAmount * 2;
            }
        } else if(childValue == 14){   //ピンゾロ
            childGoldChange += betAmount * 5;
            parentGoldChange -= betAmount * 5;
        } else if (childValue == 13 || childValue == 12 || childValue == 11 || childValue == 10 || childValue == 9){    //アラシ
            childGoldChange += betAmount * 3;
            parentGoldChange -= betAmount * 3;
        } else if(childValue == 8){    //シゴロ
            childGoldChange += betAmount * 2;
            parentGoldChange -= betAmount * 2;
        } else {
            childGoldChange += betAmount;
            parentGoldChange -= betAmount;
        }
        document.getElementById("result").innerHTML = "子の勝ち";
    } else { //親の勝ち
        if(childValue == 0){    //子がヒフミ
            if(parentValue == 14){  //親ピンゾロ
                childGoldChange -= betAmount * 10;
                parentGoldChange += betAmount * 10;
            } else if(parentValue == 13 || parentValue == 12 || parentValue == 11 || parentValue == 10 ||parentValue == 9){    //アラシ
                childGoldChange -= betAmount * 6;
                parentGoldChange += betAmount * 6;
            } else if(parentValue == 8){    //シゴロ
                childGoldChange -= betAmount * 4;
                parentGoldChange += betAmount * 4;
            } else{     //ヒフミと出目
                childGoldChange -= betAmount * 2;
                parentGoldChange += betAmount * 2;
            }
        } else if(parentValue == 14){  //ヒフミ無し親ピンゾロ
            childGoldChange -= betAmount * 5;
            parentGoldChange += betAmount * 5;
        } else if(parentValue == 13 || parentValue == 12 || parentValue == 11 || parentValue == 10 ||parentValue == 9){    //アラシ
            childGoldChange -= betAmount * 3;
            parentGoldChange += betAmount * 3;
        } else if(parentValue == 8){    //シゴロ
            childGoldChange -= betAmount * 2;
            parentGoldChange += betAmount * 2;
        } else{     //出目
            childGoldChange -= betAmount;
            parentGoldChange += betAmount;
        }
        document.getElementById("result").innerHTML = "親の勝ち";
    }

    //所持金の更新
    childGold += childGoldChange;
    parentGold += parentGoldChange;

    document.getElementById("childGold").innerHTML = `ゼニー: ${childGold}(${childGoldChange >= 0 ? '+' : ''}${childGoldChange})`;
    document.getElementById("parentGold").innerHTML = `ゼニー: ${parentGold}(${parentGoldChange >= 0 ? '+' : ''}${parentGoldChange})`;
}

function resetGame(){
    //振った回数をリセット
    saikoroCount = 0;   //変更予定：for文ですべての子のサイコロのカウントを０に
    saikoroCountNew = 0;
    //ボタンの無効を無効化
    ChildSaikoroDone = false;
    ParentSaikoroDone = false;

    
    document.getElementById("saikoroButton").disabled = false;  //子のボタンを有効化
    document.getElementById("saikoroButtonNew").disabled = true;    //親のボタンを無効化
    document.getElementById("resetButton").disabled = true;     //リセットボタンを無効化

    document.getElementById("kekka").innerHTML = "";
    document.getElementById("yaku").innerHTML = "";
    document.getElementById("counter").innerHTML = "";
    document.getElementById("kekkaNew").innerHTML = "";
    document.getElementById("yakuNew").innerHTML = "";
    document.getElementById("counterNew").innerHTML = "";
    document.getElementById("result").innerHTML = "";

    document.getElementById("childGold").innerHTML = `ゼニー: ${childGold}`;
    document.getElementById("parentGold").innerHTML = `ゼニー: ${parentGold}`;

}


