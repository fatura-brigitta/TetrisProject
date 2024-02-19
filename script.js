const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(40, 40);
let esesIdo = 250;
let fut = false;

function matrixCsinal(szelesseg, magassag){
    const matrix = [];
    while (magassag--){
        matrix.push(new Array(szelesseg).fill(0));
    }
    return matrix;
}

const startButton = document.getElementById("start");
startButton.addEventListener("click", startGame);

function formatCsinal(forma) {
    if (forma === "I") {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (forma === "L") {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (forma === "J") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (forma === "O") {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (forma === "Z") {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (forma === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (forma === "T") {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

const szinek = [
    null,
    "orange",
    "blue",
    "yellow",
    "red",
    "green",
    "purple",
    "pink"
]

function matrixRajzol(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const color = szinek[value];
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.lineJoin = "round";
                context.strokeStyle = 'black';
                context.lineWidth = 0.1;
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(palya, player){
    player.matrix.forEach((sor, y) => {
        sor.forEach((value, x) => {
            if (value !== 0) {
                palya[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function forgatas(matrix, irany){
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (irany > 0) {
        matrix.forEach((sor) => sor.reverse());
    } else {
        matrix.reverse();
    }
}

function utkozes(palya, jatekos){
    const m = jatekos.matrix;
    const o = jatekos.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (palya[y + o.y] && palya[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

const palya = matrixCsinal(12, 20);
const jatekos = {
    pos: { x: 0, y: 0 },
    matrix: null,
    pontszam: 0,
};
let esesSzamlalo = 0;
let lastTime = 0;
let animationId;

function startGame(){
        if (!fut) {
        visszaallit();
        pontszamFrissit();
        update();
        startButton.innerText = "Restart";
        fut = true;
        }
        visszaallit();
        pontszamFrissit();
        context.clearRect(0, 0, canvas.width, canvas.height);
        palya.forEach((row) => row.fill(0));
        esesIdo;
}

function stopGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    palya.forEach((row) => row.fill(0));
    visszaallit();
    jatekos.pontszam = 0;
    pontszamFrissit();
    isGameRunning = false;
    startButton.innerHTML = "Start Game";
    cancelAnimationFrame(animationId);
}

function visszaallit(){
    const formak = "TJLOSZI";
    jatekos.matrix = formatCsinal(formak[(formak.length * Math.random()) | 0]);
    jatekos.pos.y = 0;
    jatekos.pos.x = ((palya[0].length / 2) | 0) - ((jatekos.matrix[0].length / 2) | 0);
    if (utkozes(palya, jatekos)) {
        palya.forEach((row) => row.fill(0));
        jatekos.pontszam = 0;
        pontszamFrissit();
    }
}

function pontszamFrissit(){
    document.getElementById("score").innerText = "Score: " + jatekos.pontszam;
}

document.addEventListener("keydown", (event) =>{
    if (event.keyCode === 37) {
        elmozgat(-1);
    } else if (event.keyCode === 39) {
        elmozgat(1);
    } else if (event.keyCode === 40) {
        eses();
    } else if (event.keyCode === 81) {
        formaForgat(-1);
    } else if (event.keyCode === 87) {
        formaForgat(1);
    }
});

function update(time = 0) {
    const deltaTime = time - lastTime;
    esesSzamlalo += deltaTime;
    if (esesSzamlalo > esesIdo) {
        eses();
    }
    lastTime = time;
    kirajzol();
    animationId = requestAnimationFrame(update);
}

function elmozgat(offset){
    jatekos.pos.x += offset;
    if (utkozes(palya, jatekos)) {
        jatekos.pos.x -= offset;
    }
}

function eses(){
    jatekos.pos.y++;
    if (utkozes(palya, jatekos)) {
        jatekos.pos.y--;
        merge(palya, jatekos);
        if (jatekos.pos.y <= 1) {
            gameOver();
            return;
        }
        visszaallit();
        sorTorles();
        pontszamFrissit();
    }
    esesSzamlalo = 0;
}

function gameOver(){
    stopGame();
    alert('A pontszámod: ' + jatekos.pontszam);
    location.reload();
    setTimeout(function() {
        location.reload();
    }, 1000);
}

function formaForgat(dir){
    const pos = jatekos.pos.x;
    let offset = 1;
    forgatas(jatekos.matrix, dir);
    while (utkozes(palya, jatekos)) {
        jatekos.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > jatekos.matrix[0].length) {
            forgatas(jatekos.matrix, -dir);
            jatekos.pos.x = pos;
            return;
        }
    }
}

function sorTorles(){
    let rowCount = 1;
    loop: for (let y = palya.length - 1; y > 0; --y) {
        for (let x = 0; x < palya[y].length; ++x) {
            if (palya[y][x] === 0) {
                continue loop;
            }
        }
        const row = palya.splice(y, 1)[0].fill(0);
        palya.unshift(row);
        ++y;
        jatekos.pontszam += rowCount * 10;
        rowCount *= 2;
    }
}

function kirajzol(){
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    matrixRajzol(palya, { x: 0, y: 0 });
    matrixRajzol(jatekos.matrix, jatekos.pos);
}
