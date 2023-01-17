const fs = require('fs');

const initial = fs.readFileSync('initial-setup.txt').toString();

let previousGenArr = eval(initial);
let nextGenArr;

const iterationsCount = 1000;

let iteration = 0;

const interval = setInterval(()=>{
    nextGenArr = get6x6ZeroedArr();
    for(let i=0; i<6; i++) {
        for(let j=0; j<6; j++) {
            killOrReviveCell(i,j);
        }
    }
    previousGenArr = nextGenArr;
    displayGrid();
    iteration++;
    if (iteration>iterationsCount) {
        clearInterval(interval);
    }
},500);


aliveNeighborsCount(0, 0);

function killOrReviveCell(i,j) {
    const isAlive = previousGenArr[i][j];
    const aliveNeighbors = aliveNeighborsCount(i,j);
    if (isAlive && aliveNeighbors<2) {
        nextGenArr[i][j] = 0;
    } else if (isAlive && (aliveNeighbors==2 || aliveNeighbors==3)) {
        nextGenArr[i][j] = 1;
    } else if (isAlive && aliveNeighbors > 3) {
        nextGenArr[i][j] = 0;
    } else if (!isAlive && aliveNeighbors == 3) {
        nextGenArr[i][j] = 1;
    }
}

function aliveNeighborsCount(i,j) {
    let aliveNeighbors = 0;
    for (let x=i-1; x<=i+1; x++) {
        for (let y=j-1; y<=j+1; y++) {
            if ((x!=i || y!=j) && previousGenArr[x] && previousGenArr[x][y]){
                aliveNeighbors+=previousGenArr[x][y];
            }
        }
    }
    return aliveNeighbors;
}

function displayGrid() {
    console.clear();
    let line;
    for(let i=0; i<6; i++) {
        line = "|";
        for(let j=0; j<6; j++) {
            line += (previousGenArr[i][j] ? " * ":"   ");
        }
        line += "|";
        console.log(line);
    }
    
}

function get6x6ZeroedArr() {
    return [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
    ];
}

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.