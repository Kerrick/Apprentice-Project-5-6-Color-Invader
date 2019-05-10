const [Grey, Red, Yellow, Orange, Blue] = [0, 1, 2, 3, 4];

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
        return [[x, y + 1], [x + 1, y]];
    } else if (x + 1 === width && y + 1 === height) {
        return [[x - 1, y], [x, y - 1]];
    } else if (x > 0 && y === 0) {
        return [[x + 1, y], [x, y + 1], [x - 1, y]];
    } else if (x === 0 && y === 2) {
        return [[x, y - 1], [x + 1, y]];
    } else if (x === 0 && y === 1) {
        return [[x, y - 1], [x + 1, y], [x, y + 1]];
    } else if (y > x && y + 1 === height) {
        return [[x - 1, y], [x, y - 1], [x + 1, y]];
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
    console.log(oldBoard);
    return oldBoard;
};

// Game Play


// Creating the board
 let gameBoard = [[],[],[]];

 function generateBoard(){
     
 }





















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
                adjacentCoordinates([0, 0], 4, 3).sort(),
                [[0, 1], [1, 0]].sort(),
                "At the top left corner, only two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([6, 8], 7, 9).sort(),
                [[5, 8], [6, 7]].sort(),
                "At the bottom right corner, only two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([4, 7], 20, 10).sort(),
                [[3, 7], [5, 7], [4, 6], [4, 8]].sort(),
                "In the middle area, four are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([1, 0], 4, 3).sort(),
                [[2, 0], [1, 1], [0, 0]].sort(),
                "In the top middle area, three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 1], 4, 3).sort(),
                [[0, 0], [1, 1], [0, 2]].sort(),
                "In the middle left area, three are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([0, 2], 4, 3).sort(),
                [[0, 1], [1, 2]].sort(),
                "In the bottom left area, two are adjacent"
            );
            assert.deepEqual(
                adjacentCoordinates([1, 2], 4, 3).sort(),
                [[0, 2], [1, 1], [2, 2]].sort(),
                "In the bottom middle area, three are adjacent"
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
