const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(40, 40);
let esesInterval = 250;
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

const colors = [
    null,
    "orange",
    "blue",
    "yellow",
    "red",
    "green",
    "purple",
    "pink"
]

// Function to draw a matrix with borders
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const color = colors[value];
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.lineJoin = "round"

                // Add a border
                context.strokeStyle = 'black'; // Change the border color as needed
                context.lineWidth = 0.1; // Adjust the border width as needed
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Function to merge Tetrimino into the arena
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Function to rotate a matrix
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach((row) => row.reverse());
    } else {
        matrix.reverse();
    }
}

// Function to check for collisions
function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

const arena = matrixCsinal(12, 20);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};

let dropCounter = 0;

let lastTime = 0;

let isPaused = false; // Track pause state
let animationId; // Store the animation frame ID

// Function to start/restart the game
// Function to start/restart the game
function startGame() {
        // Initialize game variables and start the game loop
        if (!fut) {
        playerReset();
        updateScore();
        update();
        startButton.innerText = "Restart";
        fut = true;
        
       
        }
        playerReset();
        updateScore();
        context.clearRect(0, 0, canvas.width, canvas.height);
        arena.forEach((row) => row.fill(0));
        esesInterval;
        
         // Change button text to "Restart"
        // Disable the Start/Restart button during gameplay
}



    // Clear the canvas
function stopGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Clear the arena
    arena.forEach((row) => row.fill(0));

    // Reset the player
    playerReset();

    // Update the score (set to 0)
    player.score = 0;
    updateScore();
    
    // Enable the Start button
    isGameRunning = false; // Set the game as not running
    
    startButton.innerHTML = "Start Game"
    isPaused = false

    
    // Stop the game loop
    cancelAnimationFrame(animationId);
}

// Function to reset the player
function playerReset() {
    const pieces = "TJLOSZI";
    player.matrix = formatCsinal(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
        arena.forEach((row) => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

// Function to update the player's score on the web page
function updateScore() {
    document.getElementById("score").innerText = "Score: " + player.score;
}

// Event listener for keyboard input
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

// Function to start the game loop
function update(time = 0) {
    if (!isPaused) {
        const deltaTime = time - lastTime;
        dropCounter += deltaTime;
        if (dropCounter > esesInterval) {
            playerDrop();
        }
        lastTime = time;
        draw();
    }

    animationId = requestAnimationFrame(update);
}

// Function to move the player horizontally
function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

// Function to drop the player's Tetrimino
function playerDrop() {
    
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        if (player.pos.y <= 1) {
            // Game over condition
            gameOver();
            return;
        }
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}



function gameOver() {
    stopGame()
    alert('Game Over! Your score: ' + player.score);
    location.reload();

// To refresh the page after a specified time (in milliseconds):
    setTimeout(function() {
    location.reload();
    }, 1000) // Stop the game loop
    // You can also reset the game state or perform any other actions as needed
}

// Function to rotate the player's Tetrimino
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

// Function to handle clearing completed rows
function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// Function to draw the game state
function draw() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}
