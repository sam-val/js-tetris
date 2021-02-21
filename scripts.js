window.addEventListener("DOMContentLoaded", (e) => {

// constants:
const GRID_W = 12;
const GRID_H = 19;
const FPS = 2;
const grid = document.querySelector(".grid");
const START_POS = -GRID_W*2 + Math.floor(GRID_W/4);
const BLOCK_AREA_WIDTH = 5;
CENTER_PIECE_X = 2;
CENTER_PIECE_Y = 2;


// game variables:
var tetris  = false;
var piece_pos = START_POS;
var piece_array = new Array(4*4);
var board_array = new Array(GRID_W*GRID_H);
board_array.fill(0);
var current_piece = Math.floor(Math.random() * 7 + 1);
// current_piece = 4;


// intialising:
    // make grid:
for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
        let square = document.createElement("div");
        square.classList.add("square");
        if (x === 0 || x === GRID_W -1 || y === GRID_H - 1) {
            square.classList.add("border");
            board_array[y*GRID_W + x] = -1;
        }
        grid.appendChild(square);
        
    }
}
// MAKE THE PIECE:
setPiece(current_piece);

// game functions:

function setPiece(n) {
    // 1: I-block - cyan;
    // 2: J-block - blue;
    // 3: L-block - orange;
    // 4: O-block - yellow;
    // 5: Z-block - red;
    // 6: T-block - purple;
    // 7: S-block - green;

    piece_pos = START_POS;
    piece_array.fill(0);

    function setShape(y, line) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === "X") {
                piece_array[y*BLOCK_AREA_WIDTH + i] = 1;
            }
        }
    }

    if (n === 1) {

        setShape(0, ".....");
        setShape(1, ".....");
        setShape(2, ".XXXX");
        setShape(3, ".....");
        setShape(4, ".....");

    } else if (n === 2) {
        setShape(0, ".....");
        setShape(1, ".X...");
        setShape(2, ".XXX.");
        setShape(3, ".....");
        setShape(4, ".....");
        
    } else if (n === 3) {
        setShape(0, ".....");
        setShape(1, "...X.");
        setShape(2, ".XXX.");
        setShape(3, ".....");
        setShape(4, ".....");
        
    } else if (n === 4) {
        setShape(0, ".....");
        setShape(1, "..XX.");
        setShape(2, "..XX.");
        setShape(3, ".....");
        setShape(4, ".....");
        
    } else if (n === 5) {
        setShape(0, ".....");
        setShape(1, "..XX.");
        setShape(2, ".XX..");
        setShape(3, ".....");
        setShape(3, ".....");
        
    } else if (n === 6) {
        setShape(0, ".....");
        setShape(1, "..X..");
        setShape(2, ".XXX.");
        setShape(3, ".....");
        setShape(3, ".....");
        
    } else if (n === 7) {
        setShape(0, ".....");
        setShape(1, ".XX..");
        setShape(2, "..XX.");
        setShape(3, ".....");
        setShape(3, ".....");
        
    }
}

function checkPos(new_pos, array) {
    for (let x = 0; x < BLOCK_AREA_WIDTH; x++) {
        for (let y = 0; y < BLOCK_AREA_WIDTH; y++) {
            if (array[y*BLOCK_AREA_WIDTH + x]) {
                // if outside of board or over lap:
                let board_pos = new_pos + y*GRID_W + x;
                if (board_array[board_pos]) {
                    return false; 
                } else if (board_array[board_pos] === -1) {
                    return false;
                }
            }
        }
    }

    return true;

}

function lockBoard() {
    for (let x = 0; x < BLOCK_AREA_WIDTH; x++) {
        for (let y = 0; y < BLOCK_AREA_WIDTH; y++) {
            if (piece_array[y*BLOCK_AREA_WIDTH + x]) {
                let pos = piece_pos + y*GRID_W + x;
                board_array[pos] = current_piece;
            }
        }
    }

}

function cascadeBoard(y) {
    for (let i = y; i >0 ; i--) {
        for (let j = 1; j < GRID_W-1; j++) {
            board_array[i*GRID_W + j] = board_array[i*GRID_W + j - GRID_W];
        }
    }
}

function getTetrisLines() {
    let tetris = []
    for (let y = GRID_H-2; y > 0; y--) {
        for (let x = 1; x < GRID_W-1; x++) {
            if (!board_array[y*GRID_W + x]) {
                break;
            }
            if (x === GRID_W -2) {
                tetris.push(y);
            }
        }
    }
    return tetris;
}

function deleteTetris() {

    let lines = getTetrisLines();

    // update board data:
        for (let y = GRID_H-2; y > 0; y--) {
            for (let x = 1; x < GRID_W-1; x++) {
            if (!board_array[y*GRID_W + x]) {
                break;
            }
            if (x === GRID_W -2) {
                cascadeBoard(y);
                y++;
            }
        }
    }

    // animation and sound:
    if (lines.length !== 0) {
        let x = 1;
        setTimeout( () => {
            tetris_ani(x,lines);
        } , 50);
        setTimeout( () => {
            sound_tetris.play();
        } , 150);
    }

}   

function tetris_ani(x, lines) {
    for (let line of lines) {
        grid.children[line*GRID_W + x].classList.add("tetris");
    }
    if (x === GRID_W - 2) {
        tetris = true;
        return; 
    }
    x++;
    setTimeout( () => {
        tetris_ani(x,lines);
    } , 50);
}

function removeSquare(pos) {
    grid.children[pos].classList = "";
    grid.children[pos].classList.add("square");
}

function drawSquare(pos, piece) {
    switch (piece) {
        case 0:
            removeSquare(pos);
            break;
        case 1:
            grid.children[pos].classList.add("iBlock");
            break;
        case 2:
            grid.children[pos].classList.add("jBlock");
            break;
        case 3:
            grid.children[pos].classList.add("lBlock");
            break;
        case 4:
            grid.children[pos].classList.add("oBlock");
            break;
        case 5:
            grid.children[pos].classList.add("zBlock");
            break;
        case 6:
            grid.children[pos].classList.add("tBlock");
            break;
        case 7:
            grid.children[pos].classList.add("sBlock");
            break;
        default:
            break;
    }
}

function drawPiece() {
    for (let x = 0; x < BLOCK_AREA_WIDTH; x++) {
        for (let y = 0; y < BLOCK_AREA_WIDTH; y++) {
            if (piece_array[y*BLOCK_AREA_WIDTH + x]) {
                let pos = piece_pos + y*GRID_W + x;
                if (pos < 0) {
                    continue;
                } else {
                    drawSquare(pos, current_piece);
                }
            }
        }
    }
}

function unDrawPiece() {
    for (let x = 0; x < BLOCK_AREA_WIDTH; x++) {
        for (let y = 0; y < BLOCK_AREA_WIDTH; y++) {
            if (piece_array[y*BLOCK_AREA_WIDTH + x]) {
                let pos = piece_pos + y*GRID_W + x;
                if (pos < 0) {
                    continue;
                } else {
                    removeSquare(pos, current_piece);
                }
            }
        }
    }
}

function rotateClockWise(x,y) {
    let [rel_x, rel_y] =  [x - CENTER_PIECE_X, y - CENTER_PIECE_Y];
    let [new_rel_x, new_rel_y] = [rel_y, rel_x*-1];
    return [CENTER_PIECE_X + new_rel_x, CENTER_PIECE_Y + new_rel_y];
}

// game loop:
setTimeout(clock, 1000/FPS)

function clock() {
    // redraw and update the GUI BOARD if any tetris was found:
    if (tetris) {
        for (let i = GRID_H-2; i >=0 ; i--) {
            for (let j = 1; j < GRID_W-1; j++) {
                removeSquare(i*GRID_W +j);
                drawSquare(i*GRID_W + j, board_array[i*GRID_W + j]);
            }
        }
        tetris = false;
    }

    // check losing:
    for (let x = 0; x < GRID_W; x++) {
        if (board_array[x] !== 0 && board_array[x] !== -1) {
            alert("Lost!");
            return;
        }
    }

    // move the piece down:
    if (!checkPos(piece_pos + GRID_W, piece_array)) {
        lockBoard();
        deleteTetris(); // if any => do animation and update new board data
        // then make new tetris;
        // no need to update BOARD GUI; just leave the old piece there;
        current_piece = Math.floor(Math.random() * 7 + 1);
        setPiece(current_piece);
        sound_landing.play();

    } else {
        unDrawPiece();
        piece_pos+= GRID_W;
        drawPiece();
    }


    // check for tetris and do animation too:
    setTimeout(clock, 1000/FPS)
}

// bind user input -- movement of piece:
// INDEPENDENT OF GAME LOOP:
document.addEventListener("keydown", (e)=> {
    console.log("1")
    let new_pos = piece_pos;
    if (e.key == "ArrowDown") {
        new_pos+= GRID_W;
    } else if (e.key == "ArrowLeft") {
        new_pos--;
    } else if (e.key == "ArrowRight") {
        new_pos++;
    } 

    let temp_piece_array = piece_array;
    if (e.key == "ArrowUp") {
        sound_rotate.play();
        temp_piece_array = new Array(piece_array.length);
        temp_piece_array.fill(0);
        for (let x = 0; x < BLOCK_AREA_WIDTH; x++) {
            for (let y = 0; y < BLOCK_AREA_WIDTH; y++) {
                if (piece_array[y*BLOCK_AREA_WIDTH + x]) {
                    let [new_x, new_y] = rotateClockWise(x,y);
                    temp_piece_array[new_y*BLOCK_AREA_WIDTH + new_x] = 1; 
                }
            }
        }
    }
    // checking: legit:
    let rs = checkPos(new_pos, temp_piece_array);
    if (rs) {
        // undraw the piece:
        unDrawPiece();
        piece_array = temp_piece_array;
        piece_pos = new_pos;
    }


    // draw new piece:
    drawPiece();
})
})