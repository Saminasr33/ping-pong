const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// game verbiles 

const COMP_LEVEL = 0.1;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 20;
const BALL_START_SPEED = 0.5;
const BALL_DELTA_SPEED = 0.1;

// object 
const player = {
    x: 0,
    y: canvas.height / 2 - PLAYER_HEIGHT / 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: '#3AB8ff',
    score: 0,
};

const computer = {
    x: canvas.width - PLAYER_WIDTH,
    y: canvas.height / 2 - PLAYER_HEIGHT / 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: '#f53303',
    score: 0,

};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radios: 10,
    speed: BALL_START_SPEED,
    velocitx: 5,
    velocity: 5,
    color: '#3AB8ff',
}


const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "#59ce8f",
};


// draw

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

drawRect(0, 0, canvas.width, canvas.height, 'black');




function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}


function drawtext(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '60px fantasy';
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// render 

function render() {
    drawRect(0, 0, canvas.width, canvas.height, '#8ef9fd');
    drawNet();

    // score 
    drawtext(player.score, canvas.width / 4.5, canvas.height / 5, '#59ce8f');
    drawtext(computer.score, (3 * canvas.width) / 4, canvas.height / 5, '#59ce8f');

    // draw player&computer 
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    // draw ball 
    drawCircle(ball.x, ball.y, ball.radios, ball.color);


}
// collision
function collision(b, p) {
    b.top = b.y - b.radios;
    b.bottom = b.y + b.radios;
    b.left = b.x - b.radios;
    b.right = b.x + b.radios;


    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;


    return (b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
    );

};
// reset ball 
function resetball() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = BALL_START_SPEED;
    ball.velocitx = -ball.velocitx;
}


// player_move

canvas.addEventListener('mousemove', (e) => {
    if (paused) return;

    let rect = canvas.getBoundingClientRect();
    player.y = e.clientY - rect.top - player.height / 2;
});


function lerp(a, b, t) {
    return a + (b - a) * t;
}

// pause 
let paused = false;


// update 
function update() {
    if (paused) return;
    // ball
    ball.x += ball.velocitx * ball.speed;
    ball.y += ball.velocity * ball.speed;
    // ... 
    if (ball.y + ball.radios > canvas.height || ball.y - ball.radios < 0) {
        ball.velocity = -ball.velocity;
    }
    // ... 
    let selectedPlayer = ball.x < canvas.width / 2 ? player : computer;
    if (collision(ball, selectedPlayer)) {
        ball.velocitx = -ball.velocitx;
        ball.speed += BALL_DELTA_SPEED;
    }

    // computer
    let targetPos = ball.y - computer.height / 2;
    let curreactpos = computer.y;
    computer.y = lerp(curreactpos, targetPos, COMP_LEVEL);
    // update_score
    if (ball.x - ball.radios < 0) {
        computer.score++;
        resetball();
    } else if (ball.x + ball.radios > canvas.width) {
        player.score++;
        resetball();
    }


}






function game() {
    update();
    render();
}



// ...lop


const Eps = 60;
setInterval(game, 1000 / Eps)

// button pause 
const pausebtn = document.querySelector('#pause');
pausebtn.addEventListener('click', () => {
    if (pausebtn.innerHTML === 'Resume') {
        pausebtn.innerHTML = 'pause';
        paused = false;
    } else {
        pausebtn.innerHTML = 'Resume';
        paused = true;
    }
})
