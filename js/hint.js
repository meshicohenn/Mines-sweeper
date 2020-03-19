const HINT = '💡';
var gHintArr = [false, false, false];
var gHintIsOn = false;
var gCoutHintClicked = 0;

function renderHint() {
    var strHtml = '';
    for (var i = 0; i < 3; i++) {
        var className = '"hint"';
        strHtml += `<button class=${className} data-hint = ${i} onclick="hintClicked(this)">
        ${HINT} </button>`
    }

    var elMat = document.querySelector('.hints');
    elMat.innerHTML = strHtml;
}

function hintClicked(elButton) {
    if (!gGame.isOn) return;
    if (gCounterCell === 0) return;
    var index = elButton.getAttribute('data-hint');

    gHintArr[index] = true;
    if (gCoutHintClicked === 3) return;
    gHintIsOn = true;

    elButton.classList.add('hint-clicked')
    gHintArr++;
}

function showAllNeighbors(i, j, gBoard) {

    var posOfNeighbors = countMines(i, j, gBoard);
    posOfNeighbors.push({ i: i, j: j });
    var value = cellClicked.isMine ? MINE : cellClicked.minesAroundCount;
    renderCell({ i: i, j: j }, value);

    for (var i = 0; i < posOfNeighbors.length; i++) {
        var indexI = posOfNeighbors[i].i;
        var indexJ = posOfNeighbors[i].j;
        var cell = gBoard[indexI][indexJ];
        if (cell.isShown) continue;

        value = cell.isMine ? MINE : cell.minesAroundCount;
        renderCell(posOfNeighbors[i], value);
    }
    setTimeout(closeAllNeighbors, 2000, posOfNeighbors);
}

function closeAllNeighbors(posOfNeighbors) {
    for (var i = 0; i < posOfNeighbors.length; i++) {
        if (gBoard[posOfNeighbors[i].i][posOfNeighbors[i].j].isShown === false) {
            renderCell({ i: posOfNeighbors[i].i, j: posOfNeighbors[i].j }, '');
        }
    }
}