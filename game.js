let chips = 1000;
let bet = 100;

    document.getElementById("white-panel").style.display = "flex";

let chipsArea = document.getElementById("chips");
let betArea = document.getElementById("bet");

let suits = ["♠", "♥", "♦", "♣"];

let ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
];

let deck = [];

let playerHand = [];
let dealerHand = [];

let gameOver = true;

let playerArea = document.getElementById("player-hand");
let dealerArea = document.getElementById("dealer-hand");
let playerScoreArea = document.getElementById("player-score");
let dealerScoreArea = document.getElementById("dealer-score");
let resultArea = document.getElementById("result");
let inpeiButton = document.getElementById("inpei-button");

let startButton = document.getElementById("start-button");
let hitButton = document.getElementById("hit-button");
let standButton = document.getElementById("stand-button");
let betMinusButton = document.getElementById("bet-minus");
let betPlusButton = document.getElementById("bet-plus");

function createDeck() {

    deck = [];

    for (let suit of suits) {
        for (let rank of ranks) {

            let card = suit + rank;

            deck.push(card);
        }
    }
}


function shuffleDeck() {

    for (let i = deck.length - 1; i > 0; i--) {

        let randomIndex = Math.floor(Math.random() * (i + 1));

        let temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}
     inpeiButton.disabled = false;

function drawCard() {

    let card = deck.pop();

    return card;
}


function startGame() {

    // チップが賭け金より少なかったら開始できない
    if (chips < bet) {
        return;
    }

        inpeiButton.disabled = false;

    resultArea.textContent = "";
    dealerScoreArea.textContent = "";

    gameOver = false;

    // 賭け金をチップから引く
    chips -= bet;

    // 画面のチップを更新
    chipsArea.textContent = chips;

    startButton.disabled = true;
hitButton.disabled = false;
standButton.disabled = false;

betMinusButton.disabled = true;
betPlusButton.disabled = true;

    // ① 新しい52枚のデッキを作る
    createDeck();

    // ② シャッフルする
    shuffleDeck();

    // ③ 手札を空にする
    playerHand = [];
    dealerHand = [];

    // ④ プレイヤーに2枚配る
    playerHand.push(drawCard());
    playerHand.push(drawCard());

    // ⑤ ディーラーに2枚配る
    dealerHand.push(drawCard());
    dealerHand.push(drawCard());

    // ⑥ プレイヤーのカードを表示
    playerArea.innerHTML = "";
    playerScoreArea.textContent = "合計：" + calculateScore(playerHand);

    for (let card of playerHand) {
        playerArea.innerHTML += `<div class="card">${card}</div>`;
    }

    // ⑦ ディーラーのカードを表示
   dealerArea.innerHTML = "";

dealerArea.innerHTML += `<div class="card">?</div>`;
dealerArea.innerHTML += `<div class="card">${dealerHand[1]}</div>`;

    console.log("プレイヤー:", playerHand);
    console.log("ディーラー:", dealerHand);
    console.log("残りのカード:", deck.length);
}
function hit() {

    if (gameOver) {
        return;
    }

    // 現在の点数を確認
    let currentScore = calculateScore(playerHand);

    // すでに21を超えていたら何もしない
    if (currentScore > 21) {
        return;
    }

    // プレイヤーに1枚追加
    playerHand.push(drawCard());

    // プレイヤーのカードを表示
    playerArea.innerHTML = "";

    for (let card of playerHand) {
        playerArea.innerHTML += `<div class="card">${card}</div>`;
    }

    // 点数を計算
    let score = calculateScore(playerHand);

    // 点数を表示
    playerScoreArea.textContent = "合計：" + score;

    // 21を超えたらバースト
    if (score > 21) {

        playerScoreArea.textContent = "バースト！ 合計：" + score;
        resultArea.textContent = "バースト！あなたの負け";

        // ゲーム終了
        gameOver = true;

        // ボタンを変更
        startButton.disabled = false;
        hitButton.disabled = true;
        standButton.disabled = true;

          betMinusButton.disabled = false;
    betPlusButton.disabled = false;

    }

    console.log("プレイヤー:", playerHand);
}

function changeBet(amount) {

    // ゲーム中なら賭け金を変更できない
    if (!gameOver) {
        return;
    }

    let newBet = bet + amount;

    // 10未満にはできない
    if (newBet < 10) {
        return;
    }

    // 持っているチップ以上にはできない
    if (newBet > chips) {
        return;
    }

    bet = newBet;

    betArea.textContent = bet;
}

function calculateScore(hand) {

    let score = 0;
    let aceCount = 0;

    for (let card of hand) {

        let rank = card.substring(1);

        if (rank === "A") {
            score += 11;
            aceCount++;
        } else if (rank === "J" || rank === "Q" || rank === "K") {
            score += 10;
        } else {
            score += Number(rank);
        }
    }

    // Aを11点から1点に変更する
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;

}

function stand() {

    if(gameOver) {
        return;
    }

    // ディーラーが17点未満ならカードを引く
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }

    // ディーラーのカードを表示
    dealerArea.innerHTML = "";

    for (let card of dealerHand) {
        dealerArea.innerHTML += `<div class="card">${card}</div>`;
    }

    // 点数を計算
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand);

    dealerScoreArea.textContent = "合計：" + dealerScore;

    console.log("プレイヤーの点数:", playerScore);
    console.log("ディーラーの点数:", dealerScore);

    // 勝敗を判定
   if (playerScore > 21) {

    resultArea.textContent = "バースト！あなたの負け";

} else if (dealerScore > 21) {

    resultArea.textContent = "ディーラーがバースト！あなたの勝ち！";

    chips += bet * 2;

} else if (playerScore === 21 && playerHand.length === 2) {

    resultArea.textContent = "ブラックジャック！あなたの勝ち！";

    chips += bet * 2.5;

} else if (playerScore > dealerScore) {

    resultArea.textContent = "あなたの勝ち！";

    chips += bet * 2;

} else if (playerScore < dealerScore) {

    resultArea.textContent = "あなたの負け";

} else {

    resultArea.textContent = "引き分け！";

    chips += bet;
}

chipsArea.textContent = chips;

gameOver = true;

startButton.disabled = false;
hitButton.disabled = true;
standButton.disabled = true;

betMinusButton.disabled = false;
betPlusButton.disabled = false;

}

function inpei() {
   document.getElementById("white-panel").style.display = "flex";
}

function closePanel() {
    
}

function showPassword() {

    // 北海道の画面を閉じる
    closePanel();

    // パスワード画面を表示
    document.getElementById("password-panel").style.display = "flex";

    // 入力欄を空にする
    document.getElementById("password-input").value = "";

    // メッセージを消す
    document.getElementById("password-result").textContent = "";

    // 入力欄にカーソルを合わせる
    document.getElementById("password-input").focus();
}


function checkPassword() {

    let password = document.getElementById("password-input").value;

    if (password === "abc123") {

        // 正解
        document.getElementById("password-result").textContent =
            "正解！！";
            document.getElementById("white-panel").style.display = "none";

        document.getElementById("password-panel").style.display = "none";

    } else {

        // 不正解
        document.getElementById("password-result").textContent =
            "パスワードが違います！";

    }
}
