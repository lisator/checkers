//Checkers Multiplayer Game

    /* Game State Data */
const board = [
    null, "red-piece-1", null, "red-piece-2", null, "red-piece-3", null, "red-piece-4",
    "red-piece-5", null, "red-piece-6", null, "red-piece-7", null, "red-piece-8", null,
    null, "red-piece-9", null, "red-piece-10", null, "red-piece-11", null, "red-piece-12",
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    "black-piece-1", null, "black-piece-2", null, "black-piece-3", null, "black-piece-4", null,
    null, "black-piece-5", null, "black-piece-6", null, "black-piece-7", null, "black-piece-8",
    "black-piece-9", null, "black-piece-10", null, "black-piece-11", null, "black-piece-12", null   
]

    /* Global Variables */

//DOM Elements
const cells = document.querySelectorAll("td");
const redTurn = document.querySelectorAll(".Red-Turn");
const blackTurn = document.querySelectorAll(".Black-Turn");
const divider = document.querySelectorAll("#divider");
const resetButton = document.getElementById("resetButton");

//Player Data
let turn = true;
let redScore = 12;
let blackScore = 12;

//Selected Piece Data
let selectedPiece = {
    el: null,
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusEighteenthSpace: false
}//end selectedPiece

    /* Helper Functions */
// Function to find the index of a piece on the board array based on its ID, returns -1 if not found
const findPiece = (pieceId) => {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === pieceId) {
            return i;
        }//end if
    }//end for
    return -1;
}//end findPiece

// Debug function to log messages and relevant game state information for troubleshooting
function debug(message) {
    console.log(`[DEBUG] ${message}`);
    console.log('Selected piece:', selectedPiece);
    console.log('Board state at relevant indices:', {
        oldIndex: board[selectedPiece.indexOfBoardPiece],
        boardAtOld: board[selectedPiece.indexOfBoardPiece]
    });
}
// Debug function to log the current state of the board and count of pieces for each player
// Had issues with available spaces and jumps not updating correctly
function debugBoard() {
   console.log('Board State:', board);
   console.log('Red pieces: ', board.filter(id => id && id.includes('red')).length);
   console.log('Black pieces: ', board.filter(id => id && id.includes('black')).length);
}

// Function to reset selected piece data to default values, used after a move is made or when a new piece is selected
function resetSelectedPieceData() {
    selectedPiece = {
        el: null,
        pieceId: -1,
        indexOfBoardPiece: -1,
        isKing: false,
        seventhSpace: false,
        ninthSpace: false,
        fourteenthSpace: false,
        eighteenthSpace: false,
        minusSeventhSpace: false,
        minusNinthSpace: false,
        minusFourteenthSpace: false,
        minusEighteenthSpace: false
    }//end selectedPiece
}//end resetSelectedPieceData

        /* Event Listeners */
// Function to start the game by adding click event listeners to the pieces of the current player
function startGame() {
    const pieces = document.querySelectorAll(turn ? ".red-piece" : ".black-piece");
    pieces.forEach(p => p.addEventListener("click", getPlayerPieces));
}

// Function to handle piece selection and determine available moves based on the selected piece's position and type (king or regular)
function getPlayerPieces() {
    // Check if it's this player's turn based on piece color
    const isRedPiece = this.classList.contains("red-piece");
    if ((turn && !isRedPiece) || (!turn && isRedPiece)) {
        return; // Not this player's turn
    }
    // Remove onclick attributes and borders from all cells to reset the board state
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
        cells[i].style.border = "none";
        const p = cells[i].querySelector('p, span');
        if (p) {
            p.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        }//end if
    }//end for
    const pieceId = this.id;
    const boardIndex = findPiece(pieceId);
    // Check if the piece was found on the board and log an error if not
    if (boardIndex === -1) {
        debug(`Error: Piece with ID ${pieceId} not found on the board.`);
        return;
    }//end if

    debug(`Selected piece ID: ${pieceId} at board index: ${boardIndex}`);
    // Update selected piece data with the selected piece's element, ID, index on the board, and whether it's a king
    selectedPiece.el = this;
    selectedPiece.pieceId = this.id;
    selectedPiece.indexOfBoardPiece = findPiece(this.id);
    selectedPiece.isKing = this.classList.contains("king");
    // Give the selected piece a border to indicate it's selected and check for available moves based on the piece's position and type
    this.style.border = "2px solid white";
    getAvailableSpaces();
}
// Function to remove onclick attributes from all cells, used after a move is made or when resetting the board
function removeCellsOnClick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

// Function to reset all cell borders to default and clear selected piece datawhen a new piece is selected or after a move is made
function resetBorders() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.border = "1px solid var(--board-dark)";
    }
    resetSelectedPieceData();
    getSelectedPiece();
}
// Function to get the selected piece's ID and index on the board, then check if it's a king
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(selectedPiece.el.id);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
    isPieceKing();
}

// Function to check if the selected piece is a king and update the selected piece accordingly
function isPieceKing() {
    if (selectedPiece.el.classList.contains("king")) {
        selectedPiece.isKing = true;
    } else {
        selectedPiece.isKing = false;
    }
    getAvailableSpaces();
};
// Function to check available spaces for the selected piece in all four diagonal directions and update the selectedPiece object accordingly
function getAvailableSpaces() {
    const idx = selectedPiece.indexOfBoardPiece;
    // Reset available spaces before checking
    selectedPiece.seventhSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.minusSeventhSpace = false;
    selectedPiece.minusNinthSpace = false;
    // Check each diagonal direction for available spaces and update selectedPiece properties
    debug(`Checking available spaces from index ${idx}`);
    // Check if the target index is within bounds and if the cell is empty and a playable square before marking it as an available move
    if (idx + 7 <= 63) {
        const targetCell = cells[idx + 7];
        // Check if the target cell is empty and a playable square before marking it as an available move
        if (board[idx + 7] === null && !targetCell.classList.contains("blank")) {
            selectedPiece.seventhSpace = true;
            debug(`Seventh space available at index ${idx + 7}`);
        }//end if
        else {
            debug(`Seventh space at index ${idx + 7} is not available. Board = ${board[idx + 7]}, blank = ${targetCell.classList.contains("blank")}`);
        }//end else
    }//end if
    // Check if the target index is within bounds and if the cell is empty and a playable square before marking it as an available move
    if (idx + 9 <= 63) {
        const targetCell = cells[idx + 9];
        // Check if the target cell is empty and a playable square before marking it as an available move
        if (board[idx + 9] === null && !targetCell.classList.contains("blank")) {
            selectedPiece.ninthSpace = true;
            debug(`Ninth space available at index ${idx + 9}`);
        }
        else {
            debug(`Ninth space at index ${idx + 9} is not available. Board = ${board[idx + 9]}, blank = ${targetCell.classList.contains("blank")}`);
        }
    }
    // Check if the target index is within bounds and if the cell is empty and a playable square before marking it as an available move
    if (idx - 7 >= 0) {
        const targetCell = cells[idx - 7];
        // Check if the target cell is empty and a playable square before marking it as an available move
        if (board[idx - 7] === null && !targetCell.classList.contains("blank")) {
            selectedPiece.minusSeventhSpace = true;
            debug(`Minus seventh space available at index ${idx - 7}`);
        }
        else {
            debug(`Minus seventh space at index ${idx - 7} is not available. Board = ${board[idx - 7]}, blank = ${targetCell.classList.contains("blank")}`);
        }
    }

    if (idx - 9 >= 0) {
        const targetCell = cells[idx - 9];
        // Check if the target cell is empty and a playable square before marking it as an available move
        if (board[idx - 9] === null && !targetCell.classList.contains("blank")) {
            selectedPiece.minusNinthSpace = true;
            debug(`Minus ninth space available at index ${idx - 9}`);
        }
        else {
            debug(`Minus ninth space at index ${idx - 9} is not available. Board = ${board[idx - 9]}, blank = ${targetCell.classList.contains("blank")}`);
        }
    }
    checkAvailableJumps();
}

// Function to check for available jumps in all four diagonal directions
function checkAvailableJumps() {
    const idx = selectedPiece.indexOfBoardPiece;
    const opponent = turn ? "black" : "red";
    
    debug(`Checking jumps for ${turn ? 'red' : 'black'} piece at index ${idx}`);
    
    // Reset jump spaces
    selectedPiece.fourteenthSpace = false;
    selectedPiece.eighteenthSpace = false;
    selectedPiece.minusFourteenthSpace = false;
    selectedPiece.minusEighteenthSpace = false;
    // Helper function to check if a jump is valid in a given direction
    const jump = (target, middle) => {
        if (target < 0 || target > 63) {
            return false; // Target out of bounds
        }

        const targetCell = cells[target];
        const middleCell = cells[middle];
        // Check if target cell is empty
        if (board[target] !== null) {
            debug(`Jump target ${target} is not empty: ${board[target]}`);
            return false;
        }
        // Check if target cell is a playable square
        if (targetCell.classList.contains("blank")) {
            debug(`Jump target ${target} is not a playable square`);
            return false;
        }
        
        // Check if middle square has an opponent piece
        if (board[middle] === null) {
            debug(`Jump middle ${middle} is empty, no piece to capture`);
            return false;
        }
        // Check if the piece in the middle is an opponent's piece
        if (!board[middle].includes(opponent)) {
            debug(`Jump middle ${middle} has ${board[middle]}, not opponent (${opponent})`);
            return false;
        }
        
        // Check if middle square is a playable square (should be, but just in case)
        if (middleCell.classList.contains("blank")) {
            debug(`Jump middle ${middle} is not a playable square`);
            return false;
        }
        // If all checks pass, it's a valid jump
        debug(`Valid jump from ${idx} to ${target} capturing ${board[middle]} at ${middle}`);
        return true;
    }
    // Check each of the four possible jump directions
    if (jump(idx + 14, idx + 7)) {
        selectedPiece.fourteenthSpace = true;
    }//end if
    if (jump(idx + 18, idx + 9)) {
        selectedPiece.eighteenthSpace = true;
    }//end if
    if (jump(idx - 14, idx - 7)) {
        selectedPiece.minusFourteenthSpace = true;
    }//end if
    if (jump(idx - 18, idx - 9)) {
        selectedPiece.minusEighteenthSpace = true;
    }//end if
    // After checking jumps, check piece conditions to update available moves based on whether the piece is a king or not
    checkPieceConditions();
}

// Function to check if the piece is a king and adjust available moves accordingly
function checkPieceConditions() {
    if (!selectedPiece.isKing) {
        if (turn) {
            selectedPiece.minusSeventhSpace = false;
            selectedPiece.minusNinthSpace = false;
            selectedPiece.minusFourteenthSpace = false;
            selectedPiece.minusEighteenthSpace = false;
        } else {
            selectedPiece.seventhSpace = false;
            selectedPiece.ninthSpace = false;
            selectedPiece.fourteenthSpace = false;
            selectedPiece.eighteenthSpace = false;
        }//end if-else
    }//end if
    giveCellsOnClick();
}//end checkPieceConditions

// Function to give the selected piece a border and set onclick for valid move cells
function giveBorder() {
    if (selectedPiece.seventhSpace || selectedPiece.ninthSpace || selectedPiece.fourteenthSpace || selectedPiece.eighteenthSpace || selectedPiece.minusSeventhSpace || selectedPiece.minusNinthSpace || selectedPiece.minusFourteenthSpace || selectedPiece.minusEighteenthSpace) {
        document.getElementById(selectedPiece.pieceId).style.border = "2px solid var(--highlight)";
        giveCellsOnClick();
    } else {
        return;
    }//end if-else
}//end giveBorder

// Function to set onclick attributes for valid move cells based on selected piece's available moves
function giveCellsOnClick() {
    // Define an array of move options with corresponding keys in selectedPiece
    const options = [
        { key: 'seventhSpace', value: 7 },
        { key: 'ninthSpace', value: 9 },
        { key: 'fourteenthSpace', value: 14 },
        { key: 'eighteenthSpace', value: 18 },
        { key: 'minusSeventhSpace', value: -7 },
        { key: 'minusNinthSpace', value: -9 },
        { key: 'minusFourteenthSpace', value: -14 },
        { key: 'minusEighteenthSpace', value: -18 }
    ]
    // Flag to track if any valid moves were found
    let hasOptions = false;
    // Loop through all possible move options and set onclick for valid moves
    options.forEach(option => {
        if (selectedPiece[option.key]) {
            let hasOptions = true;
            const targetIndex = selectedPiece.indexOfBoardPiece + option.value;
            debug(`Setting onclick for cell ${targetIndex} with offset ${option.value}`);

            cells[targetIndex].setAttribute("onclick", `movePiece(${option.value})`);
            cells[targetIndex].style.border = "2px solid rgba(255, 255, 255, 0.4)";
        }
    });
    // Check if no options were available
    if (!hasOptions) {
        debug("No available moves for this piece.");
    }//end if
}//end giveCellsOnClick

// Main function to move a piece on the board
window.movePiece = function(offset) {

    debug(`Attempting to move piece with offset: ${offset}`);

    const oldIndex = selectedPiece.indexOfBoardPiece;
    const newIndex = oldIndex + offset;
    // Check if the new index is within bounds of the board array
    if (newIndex < 0 || newIndex > 63) {
        debug(`Invalid move: target index ${newIndex} is out of bounds.`);
        return;
    }//end if
    // Check if the target cell is empty before moving the piece
    if (board[newIndex] !== null) {
        debug(`Invalid move: target cell at index ${newIndex} is not empty.`);
        return;
    }//end if

    const canJump = Math.abs(offset) > 9;
    let jumpedPieceId = null;
    // Move the piece in the board array and update the DOM
    board[oldIndex] = null;
    board[newIndex] = selectedPiece.pieceId;
    // Get the piece element from the DOM and append it to the new cell
    const piece = document.getElementById(selectedPiece.pieceId);
    cells[newIndex].appendChild(piece);
    // if the piece reaches the opposite end of the board, crown it as a king by adding the "king" class
    if (turn && newIndex >= 56 || !turn && newIndex <= 7) {
        piece.classList.add("king");
    }//end if
    // If the move is a jump, remove the jumped piece from the board and update the score
    if (canJump) {
        const middleIndex = oldIndex + (offset / 2);
        jumpedPieceId = board[middleIndex];
        board[middleIndex] = null;
        // Check if there is a piece to jump and if it's an opponent's piece before removing it
        if (!jumpedPieceId) {
            debug(`Error: No piece to jump at index ${middleIndex}.`);
            return;
        }//end if
        // Check if the jumped piece belongs to the opponent or player before allowing the jump
        const isJumpedRed = jumpedPieceId.includes("red");
        if ((turn && isJumpedRed) || (!turn && !isJumpedRed)) {
            debug('Invalid jump: cannot jump over own piece.');
            return;
        }//end if
        debug(
            `Capturing piece with ID ${jumpedPieceId} at index ${middleIndex}.`
        )
    }//end if
        // Update the board state and DOM for the moved piece and any captured piece
        const currentPiece = document.getElementById(selectedPiece.pieceId);
        // Check if the current piece element exists in the DOM before trying to move it
        if (!currentPiece) {
            debug(`Error: Current piece with ID ${selectedPiece.pieceId} not found in DOM.`);
            return;
        }//end if
        board[oldIndex] = null;
        // Check if the target cell is empty before capturing a piece
        if (canJump) {
            const middleIndex = oldIndex + (offset / 2);
            board[middleIndex] = null;
            const jumpedPiece = document.getElementById(jumpedPieceId);
            if (jumpedPiece) {
                jumpedPiece.remove();
            }//end if
            if (turn) {
                blackScore--;
            } else {
                redScore--;
            }//end if-else
        }//end if
        if (turn && newIndex >= 56 || !turn && newIndex <= 7) {
            currentPiece.classList.add("king");
            debug(`Piece with ID ${selectedPiece.pieceId} has been crowned as a king.`);
        }//end if


    // Remove all onclick attributes and borders
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
        cells[i].style.border = "none";
    }
    
    // Clear the selected piece's border
    if (selectedPiece.el) {
        selectedPiece.el.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    }
    
    // Reset selected piece data
    resetSelectedPieceData();

    debug(`Moved piece to index ${newIndex} successfully. Board state updated.`);
    
    checkWinCondition();
}

// Function to update the board state and DOM after a move is made, including handling piece movement, capturing, and kinging
function changeData(indexOfBoardPiece, newIndex, removedPieceIndex) {
    board[indexOfBoardPiece] = null;
    board[newIndex] = selectedPiece.pieceId;
    // Get the piece element from the DOM and append it to the new cell
    const pieceElement = document.getElementById(selectedPiece.pieceId);
    // Check if the piece element exists in the DOM before trying to move it
    if (turn && selectedPiece.pieceId < 12 && newIndex >= 57) {
        pieceElement.classList.add("king");
    }//end if
    if (turn === false && selectedPiece.pieceId >= 12 && newIndex <= 7) {
        pieceElement.classList.add("king");
    }//end if
    if (removedPieceIndex) {
        board[removedPieceIndex] = null;
        if(turn && selectedPiece.pieceId < 12) {
            cells[removedPieceIndex].innerHTML = "";
            blackScore--;
        }
        else if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removedPieceIndex].innerHTML = "";
            redScore--;
        }
        resetSelectedPieceData();
        removeCellsOnClick();
        removeEventListeners();
        changePlayer();
    }//end if
}// end changeData

// Function to remove click event listeners from the current player's pieces and check for win conditions after a move is made
function removeEventListeners() {
    const pieces = document.querySelectorAll(turn ? ".red-piece" : ".black-piece");
    pieces.forEach(p => p.removeEventListener("click", getPlayerPieces));
    checkWinCondition();
}//end removeEventListeners

// Function to check if a player has won the game by checking if either player's score has reached zero
function checkWinCondition() {
    // Logic to check if a player has won the game
    if (redScore === 0 || blackScore === 0) {
        alert(redScore === 0 ? "Black Wins!" : "Red Wins!");
        location.reload();
    } else {
        changePlayer();
    }//end if-else
}//end checkWinCondition

// Function to change the current player after a move is made and update the UI to indicate whose turn it is
function changePlayer() {
    const pieces = document.querySelectorAll(".red-piece, .black-piece");
    pieces.forEach(p => p.removeEventListener("click", getPlayerPieces));
    turn = !turn;
    document.querySelector('.Red-Turn').style.opacity = turn ? "1" : "0.3";
    document.querySelector('.Black-Turn').style.opacity = !turn ? "1" : "0.3";
    startGame();
}//end changePlayer

// Event listener for the reset button to reload the page and reset the game
resetButton.addEventListener("click", () => {
    location.reload();
});//end event listener

/* Initialize Game */
startGame();