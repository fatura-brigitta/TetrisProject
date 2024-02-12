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


const shapes = [
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    [
        [1,1],
        [1,1]
    ]
];

const colors = [
    "orange",
    "blue",
    "yellow",
    "red",
    "green",
    "purple",
    "pink"
]