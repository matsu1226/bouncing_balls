// reference URL
// https://developer.mozilla.org/ja/docs/Learn/JavaScript/Objects/Object_building_practice

//pパラメータ設定
const EvilCircleSize = 10;
const ballNum = 3000;
const ballVelX = 3 ;
const ballVelY = 3;
const ballSizeMin = 5;
const ballSizeMax = 10;

// exists:trueのballの個数を数えるために、変数countを設定。
// ballが1増えるとcountも1増え、textを変更。
const ballCountText = document.getElementById('ballCount');
let count = 0;



// ---setup canvas
// canvasクエリの取得
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// canvasのサイズを定義（呼び出しは最後に）。
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// ---function to generate random number
function random(min, max) {
    // floor() ->小数点以下切り下げ
    // random()->0~1の乱数を取得
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}




// ---constructor of Shape。基本的なプロパティを用意。
class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX; //velocityの略
        this.velY = velY;
        this.exists = exists; //ballが存在しているか否か（true/false）
    }
};
// shapeを継承したBall class
class Ball extends Shape {
    constructor(x, y, velX, velY, exists, color, size) {
        super(x, y, velX, velY, exists);    //Shapeのconstructorを継承
        this.color = color;
        this.size = size;
    }
}
// shapeを継承したEvilCircle class
class EvilCircle extends Shape {
    constructor(x, y, velX, velY, exists) {
        super(x, y, velX, velY, exists);    //Shapeのconstructorを継承
        this.color = 'white';
        this.size = EvilCircleSize;
    }
}




// ---function to drawing balls
// Ballクラス（オブジェクト）のプロトタイプとして、drawメソッドを追加。
Ball.prototype.draw = function () {
    ctx.beginPath(); //pathの初期化
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    //arc(x, y, radius, startAngle, endAngle [, anticlockwise ] ) 
    // Math.PI = 3.1415…, Angleはラジアン表記なのでn度を表現するには”n/180*Math.PI”となる。
    ctx.fill(); //beginPath ~ fillで描画を実行。
}

// ---function to bounding and velocity of balls
// Ballクラス（オブジェクト）のプロトタイプとして、updateメソッドを追加。
Ball.prototype.update = function () {
    // if((ボール中心のx位置 + ボールの半径 )> canvasの幅)
    // =>ballの右端が画面からはみ出ていたら、
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);   //速度を反転
    }
    // ballの左端が画面からはみ出ていたら、
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    // ballの左端が画面からはみ出ていたら、
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX; //x位置にvelXの値を加算　=>updateメソッドのたびに、xがvelXだけ移動。
    this.y += this.velY;
}

//function to collision balls
Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        //ball[j]が自分以外のballだったら、
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x; //dx = 自分のx位置 - ball[j]のx位置
            const dy = this.y - balls[j].y;
            // Math.sqrt(n) =>nの平方根(square root)
            // distance^2 = dx^2 + dy^2
            const distance = Math.sqrt(dx * dx + dy * dy);

            // distanceが２つのballの半径より小さかったら、=>ball同士が衝突したら
            // ball[j].exists===falseでも、ball[j]は透明で残っているので衝突判定の対象となってしまう…。
            if ((distance < this.size + balls[j].size) && (balls[j].exists === true)) {
                //ball同士がランダムに選ばれた色に変わる。2つのballの色は同じ。
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}



EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function () {
    // EvilCircleの右端が画面からはみ出ていたら、
    if ((this.x + EvilCircleSize) >= width) {
        this.x = this.x - EvilCircleSize/2;   //少しだけ、内側にバウンド
    }
    // EvilCircleの左端が画面からはみ出ていたら、
    if ((this.x - EvilCircleSize) <= 0) {
        this.x = this.x + EvilCircleSize/2;   //少しだけ、内側にバウンド
    }
    // EvilCircleの下端が画面からはみ出ていたら、
    if ((this.y + EvilCircleSize) >= height) {
        this.y = this.y - EvilCircleSize/2;   //少しだけ、内側にバウンド
    }
    if ((this.y - EvilCircleSize) <= 0) {
        this.y = this.y + EvilCircleSize/2;   //少しだけ、内側にバウンド
    }
}

EvilCircle.prototype.setControls = function () {
    let _this = this;   //if文のスコープの都合上、thisを定義
    window.onkeydown = function (e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;  //xの位置をvelXだけ増やす
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.key === 'w') {
            _this.y -= _this.velY;
        } else if (e.key === 's') {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        //ball[j]が存在していたら、
        if (balls[j].exists === true) {
            const dx = this.x - balls[j].x; //dx = 自分のx位置 - ball[j]のx位置
            const dy = this.y - balls[j].y;

            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                ballCountText.textContent = 'Ball count: '+ count;
            }
        }
    }
}




// ---Array of balls
let balls = [];
//ballが25個未満の場合、
while (balls.length < ballNum) {
    // 生成されるball sizeを設定
    let size = random(ballSizeMin, ballSizeMax);
    // ballインスタンス（object)の生成
    let ball = new Ball(
        random(0 + size, width - size), // Ballの第1引数（x） 
        random(0 + size, height - size), // Ballの第2引数（y） 
        random(-ballVelX, ballVelX),   // Ballの第3引数（velX）
        random(-ballVelY, ballVelY),   // Ballの第4引数（velY）
        true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',    // Ballの第5引数（color）
        size    // Ballの第6引数（size）
    );
    balls.push(ball);   //pushメソッドにより、配列ballsの末尾にballプロパティを追加。
    count++;
    ballCountText.textContent = 'Ball count: '+ count;
};


let evilCircle1 = new EvilCircle(
    random(EvilCircleSize, width - EvilCircleSize),     
    random(EvilCircleSize, height - EvilCircleSize),
    20,
    20,
    true
);
evilCircle1.setControls();





// ---function to loop
function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);

    // balls Array の要素数の回数、処理を実行。
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists === true) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evilCircle1.draw();
    evilCircle1.checkBounds();
    evilCircle1.collisionDetect();

    requestAnimationFrame(loop);
}

loop();
