let saikoroCount = 0;
const maxSaikoroCount = 3;

let saikoroCountNew = 0;
const maxSaikoroCountNew = 3;

let ChildSaikoroDone = false;   //子と親が振り終わったかどうか
let ParentSaikoroDone = false;

let childGold = 1000
let parentGold = 1000

function getBetAmount(){
    //賭け金の取得
    let betAmount = parseInt(document.getElementById("betAmount").value);
    //賭け金が無効な場合（負の値とか）の処理
    return isNaN(betAmount) || betAmount <= 0 ? 100 :betAmount;
}

//子のサイコロ
function Saikoro(){
    if(saikoroCount < maxSaikoroCount){
        saikoroCount++;
        let results = [];
        let images = [];
        
        //サイコロ三つ振る処理
        for (let i = 0; i<3; i++){
            let saikoro = Math.floor( Math.random() *6) +1; //ランダムで１～６の数字を作る
            results.push(saikoro);
            images.push("dice/"+ saikoro + ".jpg");
        }

        //結果の表示
        document.getElementById("kekka").innerHTML = `サイコロの結果: ${results.join(",")}`;
        document.getElementById("sainome1").src = images[0];
        document.getElementById("sainome2").src = images[1];
        document.getElementById("sainome3").src = images[2];
        document.getElementById("counter").innerHTML = saikoroCount+"回目"

        //役判定と表示
        let yaku = 役判定(results);
        document.getElementById("yaku").innerHTML = "役:"+yaku;  

        //役が出るか、3回振ってボタン無効
        if(yaku !== "役無し" || saikoroCount >= maxSaikoroCount){
            document.getElementById("saikoroButton").disabled = true;
            ChildSaikoroDone = true; 
        }

        //親ボタンを有効にする
        if(ChildSaikoroDone){
            document.getElementById("saikoroButtonNew").disabled = false;
        } 
    }
}

//親のサイコロ
function SaikoroNew(){
    if(saikoroCountNew < maxSaikoroCountNew && ChildSaikoroDone){
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
        document.getElementById("sainome4").src = images[0];
        document.getElementById("sainome5").src = images[1];
        document.getElementById("sainome6").src = images[2];
        document.getElementById("counterNew").innerHTML = saikoroCountNew+"回目"

        //役判定と表示
        let yaku = 役判定(results);
        document.getElementById("yakuNew").innerHTML = "役:"+yaku;  

        //役が出るか、3回振ってボタンを無効化
        if(yaku !== "役無し" || saikoroCount >= maxSaikoroCount){
            document.getElementById("saikoroButtonNew").disabled = true;
            ParentSaikoroDone = true;
        }
    
        //勝敗判定
        if(ChildSaikoroDone && ParentSaikoroDone ){
            勝敗判定();
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

console.log(yaku);

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

function 勝敗判定(){
    //賭け金取得
    let betAmount = getBetAmount();

    //役を取得
    const childYaku = document.getElementById("yaku").innerHTML.replace('役:','');
    const parentYaku = document.getElementById("yakuNew").innerHTML.replace('役:','');

    //役を数値変換
    let childValue = 役の強さ(childYaku);
    let parentValue = 役の強さ(parentYaku);

    //勝敗判定
    if(childValue > parentValue){   //子勝ち
        if(parentValue == 0){   //親ヒフミで
            if(childValue == 14){   //ピンゾロ
                childGold += betAmount * 10;
                parentGold -= betAmount * 10;
            } else if (childValue == 13 || childValue == 12 || childValue == 11 || childValue == 10 || childValue == 9){    //アラシ
                childGold += betAmount * 6;
                parentGold -= betAmount * 6;
            } else if(childValue == 8){    //シゴロ
                childGold += betAmount * 4;
                parentGold -= betAmount * 4;
            } else {    //ヒフミと出目
                childGold += betAmount * 2;
                parentGold -= betAmount * 2;
            }
        } else if(childValue == 14){   //ピンゾロ
            childGold += betAmount * 5;
            parentGold -= betAmount * 5;
        } else if (childValue == 13 || childValue == 12 || childValue == 11 || childValue == 10 || childValue == 9){    //アラシ
            childGold += betAmount * 3;
            parentGold -= betAmount * 3;
        } else if(childValue == 8){    //シゴロ
            childGold += betAmount * 2;
            parentGold -= betAmount * 2;
        } else {
            childGold += betAmount;
            parentGold -= betAmount;
        }
        document.getElementById("result").innerHTML = "子の勝ち";
    } else { //親の勝ち
        if(childValue == 0){    //子がヒフミ
            if(parentValue == 14){  //親ピンゾロ
                childGold -= betAmount * 10;
                parentGold += betAmount * 10;
            } else if(parentValue == 13 || parentValue == 12 || parentValue == 11 || parentValue == 10 ||parentValue == 9){    //アラシ
                childGold -= betAmount * 6;
                parentGold += betAmount * 6;
            } else if(parentValue == 8){    //シゴロ
                childGold -= betAmount * 4;
                parentGold += betAmount * 4;
            } else{     //ヒフミと出目
                childGold -= betAmount * 2;
                parentGold += betAmount * 2;
            }
        } else if(parentValue == 14){  //ヒフミ無し親ピンゾロ
            childGold -= betAmount * 5;
            parentGold += betAmount * 5;
        } else if(parentValue == 13 || parentValue == 12 || parentValue == 11 || parentValue == 10 ||parentValue == 9){    //アラシ
            childGold -= betAmount * 3;
            parentGold += betAmount * 3;
        } else if(parentValue == 8){    //シゴロ
            childGold -= betAmount * 2;
            parentGold += betAmount * 2;
        } else{     //出目
            childGold -= betAmount;
            parentGold += betAmount;
        }
        document.getElementById("result").innerHTML = "親の勝ち";
    }

    //所持金の更新
    document.getElementById("childGold").innerHTML = `所持金: ${childGold}`;
    document.getElementById("parentGold").innerHTML = `所持金: ${parentGold}`;
}

function resetGame(){
    
}


