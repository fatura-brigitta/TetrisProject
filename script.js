const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);
let esesInterval = 250;
let fut = false;

function matrixCsinal(szelesseg, magassag){
    const matrix = [];
    while (magassag--){
        matrix.push(new Array(szelesseg).fill(0));
    }
    return matrix;
}

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
    "orange",
    "blue",
    "yellow",
    "red",
    "green",
    "purple",
    "pink"
]
