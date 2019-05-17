const [Grey, Red, Yellow, Orange, Blue] = [0, 1, 2, 3, 4];
const colors = ['grey', 'red', 'yellow', 'orange', 'blue'];
// Game Play Model

let counter = 100;
let board = randomizeBoard();
let gameStatus = 'ongoing'; // values can be: ongoing, userWon, gameOver

const gameBoard = document.getElementById('game-board');

const isEnemy = cell => {
    if (cell !== Grey) {
        return true;
    } else {
        return false;
    }
};
const adjacentCoordinates = (coordinates, width, height) => {
    let x = coordinates[0];
    let y = coordinates[1];
    if (x === 0 && y === 0) {
        return [[0, 1], [1, 0]];
    } else if (x + 1 === width && y + 1 === height) {
        return [[x - 1, y], [x, y - 1]];
    } else if (y === 0 && x+1 === width) {
        return [[x-1, 0], [x, 1]];
    } else if (x > 0 && x < width && y === 0) {
        return [[x + 1, 0], [x, 1], [x - 1, 0]];
    } else if (x === 0 && y+1 === height) {
        return [[0, y - 1], [1, y]];
    } else if (x === 0 && y < height) {
        return [[0, y - 1], [1, y], [0, y + 1]];
    } else if (x < width && y + 1 === height) {
        return [[x - 1, y], [x, y - 1], [x + 1, y]];
    } else if (y > 0 && y < height && x + 1 === width) {
        return [[x, y - 1], [x, y + 1], [x - 1, y]];
    } else {
        return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    }
};
const isBoardComplete = board =>
    board.every(row => row.every(el => el === Grey));

const changeAdjacentCellsRecursively = (board, x, y, clickedColor) => {
    let coordinatepairs = adjacentCoordinates(
        [x, y],
        board[0].length,
        board.length
    );
    for (let coordinatepair of coordinatepairs) {
        let [adjx, adjy] = coordinatepair;
        if (board[adjy][adjx] === clickedColor) {
            board[adjy][adjx] = Grey;
            changeAdjacentCellsRecursively(board, adjx, adjy, clickedColor);
        }
    }
    return;
};

const generateNewBoard = (clickedColor, oldBoard) => {
    for (let i = 0; i < oldBoard.length; i++) {
        let row = oldBoard[i];
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];
            if (cell === Grey) {
                let x = j;
                let y = i;
                changeAdjacentCellsRecursively(oldBoard, x, y, clickedColor);
            }
        }
    }
    return oldBoard;
};

// Create board
createBoard(board);
function createBoard(board){
    let table = '<table>';
    for(let row of board){
        table += '<tr>';
        for(let cell of row) {
            `square--${colors[cell]}`
            table += `<td class ="square--${colors[cell]} " > </td>`;
        }
        table += `</tr>`;
    }
    table += '</table>';
    gameBoard.innerHTML = table;
}


// Randomize the board

function randomizeBoard(){
     let rowMax = 32;
     let columnMax=20;
     let gameBoard = [];
     for (let i = 0; i <rowMax; i++){
         gameBoard.push([]) ;
         for(let j = 0; j < columnMax; j++){
             gameBoard[i][j] = _.sample([1,2,3,4])
         }
     }
     gameBoard[0][0] = 0; // Top left should aways be Grey
        return gameBoard;
 }



// Game Play controller

function invader(clickedColor){
    board = generateNewBoard(clickedColor,board);
    createBoard(board);
    counter -= 1;
    isGameOver();
}
function isGameOver() {
    let isComplete = isBoardComplete(board);
    if(isComplete){
        return gameStatus = 'userWon';
    } else if(!isComplete && counter == 0) {
        return gameStatus= 'gameOver';
    } else {
        return gameStatus = 'ongoing';
    }
}

 // Listening for Button clicks


document.getElementById("enemy-listener").addEventListener("click", function(){
    let clickedColor;
    clickedColor= event.target.textContent;
     invader(translateEnemyColor(clickedColor));
    document.getElementById("counter").textContent = counter; // Update Counter display


});

// Translate Enemy color string to number
function translateEnemyColor(colorString) {
    switch(colorString){
        case "Red":
            return 1;
        case "Yellow":
            return 2;
        case "Orange":
            return 3;
        case "Blue":
            return 4;
    }
}



//
// function onTimerTick() {
//     isBoardComplete(generateNewBoard(clickedColor, randomizeBoard()));
//     // return oldBoard
// }




















QUnit.module("Utility Functions", () => {
    QUnit.test(
        "The isEnemy() function tests whether a color is an enemy",
        assert => {
            assert.equal(isEnemy(Grey), false, "Grey is an ally");
            assert.equal(isEnemy(Orange), true, "Orange is an enemy");
            assert.equal(isEnemy(Red), true, "red is an enemy");
            assert.equal(isEnemy(Blue), true, "Blue is an enemy");
            assert.equal(isEnemy(Yellow), true, "Yellow is an enemy");
        }
    );
    QUnit.test(
        "The adjacentCoordinates() function gives you the indexes for cells that are adjacent to the one you passed",
        assert => {
            assert.deepEqual(
                adjacentCoordinates([0, 0], 100, 100).sort(),
                [[0, 1], [1, 0]].sort(),
                "1: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([54, 0], 55, 65).sort(),
                [[53, 0], [54, 1]].sort(),
                "2: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([122, 596], 123, 597).sort(),
                [[122, 595], [121, 596]].sort(),
                "3: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 15], 74, 16).sort(),
                [[0, 14], [1, 15]].sort(),
                "4: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([5, 0], 12, 23).sort(),
                [[4, 0], [6, 0], [5, 1]].sort(),
                "5: three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([44, 17], 45, 32).sort(),
                [[44, 16], [44, 18], [43, 17]].sort(),
                "6: three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([1234, 8975], 3425, 8976).sort(),
                [[1233, 8975], [1235, 8975], [1234, 8974]].sort(),
                "7: three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 3], 6, 9).sort(),
                [[0, 2], [0, 4], [1, 3]].sort(),
                "8: three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([23, 50], 34, 56).sort(),
                [[22, 50], [24, 50], [23, 49], [23, 51]].sort(),
                "9: four are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 0], 4, 3).sort(),
                [[0, 1], [1, 0]].sort(),
                "10: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([6, 8], 7, 9).sort(),
                [[5, 8], [6, 7]].sort(),
                "11: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([4, 7], 20, 10).sort(),
                [[3, 7], [5, 7], [4, 6], [4, 8]].sort(),
                "12: four are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([1, 0], 4, 3).sort(),
                [[2, 0], [1, 1], [0, 0]].sort(),
                "13: three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 1], 4, 3).sort(),
                [[0, 0], [1, 1], [0, 2]].sort(),
                "14: three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 2], 4, 3).sort(),
                [[0, 1], [1, 2]].sort(),
                "15: two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([1, 2], 4, 3).sort(),
                [[0, 2], [1, 1], [2, 2]].sort(),
                "16: three are adjacent"
            );
        }
    );
});
QUnit.module("Game Board Functions", () => {
    QUnit.test(
        "The isBoardComplete() function checks if the game is complete",
        assert => {
            assert.equal(
                isBoardComplete([
                    [Grey, Grey, Grey, Grey],
                    [Grey, Grey, Grey, Grey],
                    [Grey, Grey, Grey, Grey]
                ]),
                true,
                "A 4x3 board of all Grey squares is complete."
            );
            assert.equal(
                isBoardComplete([
                    [Grey, Blue, Yellow],
                    [Red, Blue, Red],
                    [Grey, Yellow, Grey],
                    [Yellow, Red, Blue]
                ]),
                false,
                "A 3x4 board of only some Grey squares is not complete."
            );
        }
    );
    QUnit.test(
        "The generateNewBoard() function creates a new board with the appropriate changes based on the button pressed",
        assert => {
            assert.deepEqual(
                generateNewBoard(Red, [
                    [Grey, Blue, Yellow, Red],
                    [Red, Yellow, Yellow, Blue],
                    [Blue, Red, Yellow, Blue]
                ]),
                [
                    [Grey, Blue, Yellow, Red],
                    [Grey, Yellow, Yellow, Blue],
                    [Blue, Red, Yellow, Blue]
                ],
                "It changes a single adjacent Red square to Grey"
            );
            assert.deepEqual(
                generateNewBoard(Red, [
                    [Grey, Red, Yellow, Red],
                    [Red, Yellow, Yellow, Blue],
                    [Blue, Red, Yellow, Blue]
                ]),
                [
                    [Grey, Grey, Yellow, Red],
                    [Grey, Yellow, Yellow, Blue],
                    [Blue, Red, Yellow, Blue]
                ],
                "It changes a two separate adjacent Red squares to Grey"
            );
            assert.deepEqual(
                generateNewBoard(Red, [
                    [Grey, Blue, Yellow, Red],
                    [Red, Yellow, Yellow, Blue],
                    [Red, Red, Yellow, Blue]
                ]),
                [
                    [Grey, Blue, Yellow, Red],
                    [Grey, Yellow, Yellow, Blue],
                    [Grey, Grey, Yellow, Blue]
                ],
                "It changes an entire blob of Red to Grey when Red is pressed"
            );
            assert.deepEqual(
                generateNewBoard(Red, [
                    [Grey, Blue, Yellow, Red],
                    [Yellow, Yellow, Yellow, Blue],
                    [Blue, Red, Yellow, Blue]
                ]),
                [
                    [Grey, Blue, Yellow, Red],
                    [Yellow, Yellow, Yellow, Blue],
                    [Blue, Red, Yellow, Blue]
                ],
                "It changes nothing if there were no adjacent Red squares when Red was pressed"
            );
            assert.deepEqual(
                generateNewBoard(1, [
                    [0, 0, 0, 1],
                    [0, 0, 1, 1],
                    [0, 0, 1, 2]
                ]),
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 2]
                ],
                "It changes squares in all directions"
            );
            assert.deepEqual(
                generateNewBoard(Red, [
                    [Blue, Red, Yellow, Red],
                    [Red, Grey, Red, Blue],
                    [Blue, Red, Yellow, Blue]
                ]),
                [
                    [Blue, Grey, Yellow, Red],
                    [Grey, Grey, Grey, Blue],
                    [Blue, Grey, Yellow, Blue]
                ],
                "It changes squares in all directions"
            );
        }
    );
});
