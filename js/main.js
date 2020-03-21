'use strict'
const FLAG = '🏳️‍🌈';
const NORMAL = '🤩';
const SAD = '☹️';
const SUNGLASSES = '😎';
const LIFE = '❤️';
const UNLIFE = '🖤';

var gBoard = [];
var gNeighbors = [];
var gCounterCell = 0;
var gIntervalTimer;
var gLives = 3;
var gBestScore = [{ size: 4, bestScore: 0 }, { size: 8, bestScore: 0 }, { size: 12, bestScore: 0 }];

var gLevel = {
    size: 4,
    mines: 2,
    bestScore: -Infinity
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
};

function init() {
    document.querySelector('.start').style.display = 'none';
    gGame = setgGame();
    gBoard = createBoard();
    gCoutHintClicked = 0;
    gHintIsOn = false;
    gCounterCell = 0;
    gLives = 3;
    renderScore();
    renderBestScore();
    renderLives();
    renderBoard(gBoard);
}

function setgGame() {
    var game = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
    };
    return game;
}

function setgLevel(size, mines) {
    // debugger
    gLevel.size = size;
    gLevel.mines = mines;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            countMines(i, j, board);
        }
    }
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    var value;

    if (!gGame.isOn) return;

    if (cell.isShown) return;

    if (gCounterCell === 0 && !gHintIsOn) {
        gCounterCell++;
        putRandomMine(i, j);
        setMinesNegsCount(gBoard);
        timerBtMillisec();
    }

    if (gHintIsOn) {
        gHintIsOn = false;
        showAllNeighbors(i, j, gBoard);
        return;
    }

    if (cell.isMine) {
        gLives--;
        renderLives();
        // changeColorLives('#f30b50');
        // setTimeout(changeColorLives, 1000);
    }


    if (cell.isMine && gLives === 0) {
        value = MINE;
        renderCell({ i: i, j: j }, value);
        return gameOver();
    }
    if (cell.minesAroundCount > 0 && !cell.isMine) {
        value = cell.minesAroundCount;
        cell.isShown = true;
        elCell.classList.add('clicked');
        gGame.shownCount++;
        renderScore();
        renderCell({ i: i, j: j }, value);
    }
    else if (cell.minesAroundCount === 0 && !cell.isMine) {
        cell.isShown = true;
        elCell.classList.add('clicked');
        gGame.shownCount++;
        renderScore();

        var locationNeighbors = countMines(i, j, gBoard);

        for (var i = 0; i < locationNeighbors.length; i++) {
            var indexI = locationNeighbors[i].i;
            var indexJ = locationNeighbors[i].j;
            var cell = gBoard[indexI][indexJ];
            if (cell.isShown) continue;

            value = cell.minesAroundCount;
            cell.isShown = true;
            var cellId = getIdName(locationNeighbors[i]);
            var elCellById = document.getElementById(cellId);
            elCellById.classList.add('clicked');
            gGame.shownCount++;
            renderScore();
            if (cell.minesAroundCount !== 0) {
                renderCell(locationNeighbors[i], value);
            }
        }
    }
    if (checkBoardStatus()) return win();
}

function cellMarked(i, j) {
    // console.log(elCell);
    if (!gGame.isOn) return;
    var cell = gBoard[i][j];
    if (cell.isMarked) {
        gGame.markedCount--
        cell.isMarked = false;
        renderCell({ i: i, j: j }, '');
        return;
    }
    if (cell.isShown) return;
    cell.isMarked = true;
    gGame.markedCount++;
    renderCell({ i: i, j: j }, FLAG);
    if (checkBoardStatus()) return win();
}

function win() {
    renderSmile(SUNGLASSES);
    clearInterval(gIntervalTimer);
    document.querySelector('.start').style.display = 'none';
    gGame.isOn = false;
    document.querySelector('.win').style.display = 'block';
    setTimeout(() => {
        document.querySelector('.start').style.display = 'block';
    }, 2000);

}

function gameOver() {
    updateBestScore();
    renderSmile(SAD);
    clearInterval(gIntervalTimer);
    document.querySelector('.start').style.display = 'none';
    gGame.isOn = false;
    document.querySelector('.game-over').style.display = 'block';
    setTimeout(() => {
        document.querySelector('.start').style.display = 'block';
    }, 2000);

}

function checkBoardStatus() {
    var sumOfShowenCount = gLevel.size * gLevel.size - gLevel.mines;
    // console.log('shownCount:', gGame.shownCount, sumOfShowenCount);
    // console.log('markedCount:', gGame.markedCount, gLevel.mines);
    updateBestScore();
    return (gGame.shownCount === sumOfShowenCount && gGame.markedCount === gLevel.mines)

}

function start() {
    init();
    gCounterCell = 0;
    // document.querySelector('.start').style.display = 'block';
    document.querySelector('.win').style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';

}

function levelChange(size, mines) {
    clearInterval(gIntervalTimer);
    setgLevel(size, mines);
    start();
}

function renderLives(value) {
    var elLives = document.querySelector('.lives');
    elLives.innerText = '';
    for (var i = 0; i < gLives; i++) {
        elLives.innerText += LIFE;
    }
    for (i = 0; i < 3 - gLives; i++) {
        elLives.innerText += UNLIFE;
    }
}

function renderScore() {
    var elScore = document.querySelector('.current-score');
    elScore.innerText = 'score: ' + gGame.shownCount;
}

function renderBestScore() {
    var elBestScore = document.querySelector('.best-score');
    // console.log(elBestScore);
    elBestScore.innerText = 'best score: ' +findBestScore();

}

function findBestScore() {
    for (var i = 0; i < gBestScore.length; i++) {
        if (gBestScore[i].size === gLevel.size) {
            return gBestScore[i].bestScore;
        }
    }
}

function updateBestScore(){
    for (var i = 0; i < gBestScore.length; i++) {
        if (gBestScore[i].size === gLevel.size) {
           return gBestScore[i].bestScore = gGame.shownCount > gBestScore[i].bestScore ?
             gGame.shownCount : gBestScore[i].bestScore;
        }
    }
}