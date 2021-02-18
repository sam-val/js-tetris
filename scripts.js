// constants:
const GRID_W = 10;
const GRID_H = 20;
const FPS = 1;
const grid = document.querySelector(".grid");
const START_POS = 0;


// game variables:
piece_pos = START_POS;
piece_array = new Array(4*4);
board_array = new Array(GRID_W*GRID_H);
current_piece = Math.floor(Math.random() * 7 + 1);
// current_piece = 1;
// intialising:
    // make grid:
for (let x = 0; x < GRID_W*GRID_H; x++) {
        let square = document.createElement("div");
        square.classList.add("square");
        grid.appendChild(square);
    
}
// MAKE THE PIECE:
setPiece(current_piece);

// draw new piece:
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (piece_array[y*4 + x]) {
                drawSquare(piece_pos + y*GRID_W + x, current_piece);
            }
        }
    }

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
                piece_array[y*4 + i] = 1;
            }
        }
    }

    if (n === 1) {

        setShape(0, "....");
        setShape(1, "XXXX");
        setShape(2, "....");
        setShape(3, "....");

    } else if (n === 2) {
        setShape(0, "....");
        setShape(1, ".X..");
        setShape(2, ".XXX");
        setShape(3, "....");
        
    } else if (n === 3) {
        setShape(0, "....");
        setShape(1, "...X");
        setShape(2, ".XXX");
        setShape(3, "....");
        
    } else if (n === 4) {
        setShape(0, "....");
        setShape(1, ".XX.");
        setShape(2, ".XX.");
        setShape(3, "....");
        
    } else if (n === 5) {
        setShape(0, "...");
        setShape(1, ".XX.");
        setShape(2, "XX..");
        setShape(3, "....");
        
    } else if (n === 6) {
        setShape(0, "....");
        setShape(1, ".X..");
        setShape(2, "XXX.");
        setShape(3, "....");
        
    } else if (n === 7) {
        setShape(0, "....");
        setShape(1, "XX..");
        setShape(2, ".XX.");
        setShape(3, "....");
        
    }
}

function checkPos(new_pos, direction) {
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (piece_array[y*4 + x]) {
                // if outside of board:
                let board_pos = new_pos + y*GRID_W + x;
                if ((board_pos > board_array.length - 1) || board_pos < 0) {
                    return false;
                } else if (board_array[board_pos]) {
                    return false; 
                } else if (direction == "ArrowLeft") {
                    if ((board_pos + 1) % GRID_W === 0) {
                        return false;
                    }
                } else if (direction == "ArrowRight") {
                    if ((board_pos - 1) % GRID_W === (GRID_W-1)) {
                        return false;
                    }
                }
            }
        }
    }

    return true;

}

function lockAndDrawBoard() {
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (piece_array[y*4 + x]) {
                let pos = piece_pos + y*GRID_W + x;
                board_array[pos] = current_piece;
            }
        }
    }

}

function checkBoard() {
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
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (piece_array[y*4 + x]) {
                    drawSquare(piece_pos + y*GRID_W + x, current_piece);
                }
            }
        }

    
}

function unDrawPiece() {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (piece_array[y*4 + x]) {
                    removeSquare(piece_pos + y*GRID_W + x);
                }
            }
        }

}

// game loop:
setTimeout(clock, 1000/FPS)

function clock() {

    // check winning or losing:

    // move the piece down:
    if (!checkPos(piece_pos + GRID_W)) {
        lockAndDrawBoard();
        current_piece = Math.floor(Math.random() * 7 + 1);
        console.log("current piece", current_piece)
        setPiece(current_piece);
    } else {
        unDrawPiece();
        piece_pos+= GRID_W;
        drawPiece();
    }


    // check for tetris and do animation too:
    checkBoard();

    setTimeout(clock, 1000/FPS)
}

// bind user input -- movement of piece:
// INDEPENDE OF GAME LOOP:
document.addEventListener("keydown", (e)=> {
    console.log("1")
    let new_pos = piece_pos;
    let direction = e.key;
    if (e.key == "ArrowDown") {
        new_pos+= GRID_W;
    } else if (e.key == "ArrowLeft") {
        new_pos--;
    } else if (e.key == "ArrowRight") {
        new_pos++;
    }

    // checking: legit:
    let rs = checkPos(new_pos, direction);
    if (rs) {
        // undraw the piece:
        unDrawPiece();
        piece_pos = new_pos;
    }


    // draw new piece:
    drawPiece();
})

