// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;


// shinchan
let shinWidth = 46;
let shinHeight = 46;
let shinX = boardWidth/2 - shinWidth/2;
let shinY = boardHeight*7/8-shinHeight;
let shinRightImg;
let shinLeftImg;

let shin = {
    img: null,
    x: shinX,
    y: shinY,
    width: shinWidth,
    height: shinHeight
}
// physics
let velocityX=0;
let velocityY=0;
let initialVelocity=-8;
let gravity=0.4;
// platforms
let platformArray=[];
let platformWidth=60;
let platformHeight=18;
let platformImage;
let gameOver=false;
let score=0;
let maxScore=0;
window.onload = function() {
    board = document.getElementById("board");
    board.height=boardHeight;
    board.width = boardWidth;
    context=board.getContext("2d"); // i'm using it to draw on the board so shinchan moves

    // draw shin
    // context.fillStyle = "green";
    // context.fillRect(shin.x,shin.y,shin.width,shin.height);
    // load images
    shinRightImg=new Image();
    shinRightImg.src='./2.png';
    shin.img=shinRightImg;
    shinRightImg.onload = function() {
        context.drawImage(shin.img, shin.x, shin.y, shin.width, shin.height);
    }
    shinLeftImg=new Image();
    shinLeftImg.src='./1.png';


    platformImage=new Image();
    platformImage.src='./platform.png';
    velocityY=initialVelocity;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveshin);
}
function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0,0,board.width,board.height);

    
    shin.x+=velocityX;
    if(shin.x>boardWidth) {
        shin.x=0;
    }
    else if (shin.x+shin.width<0) {
        shin.x=boardWidth;
    }

    velocityY+=gravity;
    shin.y+=velocityY;
    if(shin.y>board.height) {
        gameOver=true;
    }
    context.drawImage(shin.img, shin.x, shin.y, shin.width, shin.height);
    // platforms

    for (let i=0; i<platformArray.length; i++) {
        let platform = platformArray[i];
        if(velocityY<0&&shin.y<boardHeight*3/4) {
            platform.y-=initialVelocity;// slide platform down

        }
        if(detectCollision(shin,platform)&&velocityY>=0) {
            velocityY=initialVelocity; // jump off the platform
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new ones
    while(platformArray.length>0&&platformArray[0].y>=boardHeight) {
        platformArray.shift(); // removes first element from the array
        newPlatform();
    }
    updateScore();
    context.fillStyle="black";
    context.font="16px sans-serif";
    context.fillText(score,5,40);
    if(gameOver) {
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth/7,boardHeight*7/8);
    }
}
function moveshin(e) {
    if(e.code=="ArrowRight"||e.code=="KeyD") {
        velocityX=4;
        shin.img=shinRightImg;
    } else if(e.code=="ArrowLeft"||e.code=="KeyA") {
        velocityX=-4;
        shin.img=shinLeftImg;
    } else if(e.code=="Space"&&gameOver) {
        shin = {
            img: shinRightImg,
            x: shinX,
            y: shinY,
            width: shinWidth,
            height: shinHeight
        }
        velocityX=0;
        velocityY=initialVelocity;
        score=0;
        maxScore=0;
        gameOver=false;
        placePlatforms();
    }
}
function placePlatforms() {
    platformArray=[];

    // starting platforms
    // let platform = {
    //     img: platformImage,
    //     x: boardWidth/2,
    //     y: boardHeight-50,
    //     width: platformWidth,
    //     height: platformHeight

    // }
    // platformArray.push(platform);

    // platform = {
    //     img: platformImage,
    //     x: boardWidth/2,
    //     y: boardHeight-150,
    //     width: platformWidth,
    //     height: platformHeight

    // }
    // platformArray.push(platform);
    for (let i=0; i<7; i++) {
        let randomX = Math.floor(Math.random()*boardWidth*3/4);
        let platform = {
            img: platformImage,
            x: randomX,
            y: boardHeight-75*(i-1) -150,
            width: platformWidth,
            height: platformHeight
    
        }
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random()*boardWidth*3/4);
    let platform = {
        img: platformImage,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight

    }
    platformArray.push(platform);
}
function detectCollision(a, b) {
    return a.x<b.x+b.width&&
        a.x+a.width>b.x&&
        a.y<b.y+b.height&&
        a.y+a.height>b.y;
}

function updateScore() {
    let points = Math.floor(50*Math.random()); // 50 *(0,1)
    if(velocityY<0) {
        // negative going up
        maxScore+=points;
        if(score<maxScore) {
            score=maxScore;
        }
        
    }
    else if(velocityY>=0) {
        maxScore-=points;
    }
}

setTimeout(function(){
    document.getElementById("my_audio").play();
}, 8000)