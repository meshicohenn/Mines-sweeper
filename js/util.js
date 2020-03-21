
function createBoard() {
  var board = [];
  for (var i = 0; i < gLevel.size; i++) {
    board.push([])
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  return board;
}

function renderBoard(board) {
  var strHtml = '';
  for (var i = 0; i < board.length; i++) {
    var row = board[i];
    strHtml += '<tr>';
    for (var j = 0; j < row.length; j++) {
      // debugger
      // var cell = board[i][j]
      var cell = board[i][j].isShown ? board[i][j].minesAroundCount : ''
      // TODO: figure class name
      var className = '"cell"';
      var tdId = `cell${i}-${j}`;
      strHtml += `<td id="${tdId}" class=${className} onclick="cellClicked(this,${i},${j})" 
      oncontextmenu="cellMarked(${i},${j})">
                  ${cell}</td>`
    }
    strHtml += '</tr>';
  }

  renderHint();
  renderSmile(NORMAL);
  var elMat = document.querySelector('.game-board');
  elMat.innerHTML = strHtml;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var newValue = value === 0 ? '' : value;
  var elCell = document.getElementById(`cell${location.i}-${location.j}`);
  elCell.innerText = newValue;
}

function renderSmile(value) {
  var elSmile = document.querySelector('.smile');
  elSmile.innerHTML = value;
}

function getIdName(location) {
  var cellId = 'cell' + location.i + '-' + location.j;
  return cellId;
}



function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function countMines(cellI, cellJ, mat) {
  var neighbors = [];
  // gCountMines = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {

      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine) mat[cellI][cellJ].minesAroundCount++;
      neighbors.push({ i: i, j: j });
    }
  }
  return neighbors;
}

function countAllMines(posI, posJ) {
  if (posI < 0 || posJ < 0 || posI === gLevel.size || posJ === gLevel.size
    || gBoard[posI][posJ].isMine || gBoard[posI][posJ].isShown ) {
    return;
  }

  var cell = gBoard[posI][posJ];
  var value = cell.minesAroundCount;
  var cellId = getIdName({i:posI,j:posJ});
  var elCellById = document.getElementById(cellId);
  elCellById.classList.add('clicked');
  cell.isShown = true;
  gGame.shownCount++;
  renderScore();
  if(cell.isMarked) gGame.markedCount--;
  renderCell({i:posI,j:posJ}, value);


  if (cell.minesAroundCount > 0) {
    return;
  }
  for (var i = posI - 1; i <= posI + 1; i++) {
    for (var j = posJ - 1; j <= posJ + 1; j++) {
      countAllMines(i, j)
    }
  }

}

// function expendedReveal(cellI, cellJ) {
//   if (cellI < 0 ||
//     cellJ < 0 ||
//     cellI === gBoard.length ||
//     cellJ === gBoard.length ||
//     gBoard[cellI][cellJ].isMine ||
//     gBoard[cellI][cellJ].isShown) {
//     return
//   }
//   //Handle current Cell
//   var currentElement = getCellElement(cellI, cellJ)
//   if (currentElement.innerText === FLAG && gBoard[cellI][cellJ].minesAroundCount === 0 && !gBoard[cellI][cellJ].isMine) { //removing "floating" flags 
//     gBoard[cellI][cellJ].isMarked = false
//     currentElement.innerText = ''
//     console.log('removed floating flag')
//     gGame.markedCount--
//     document.querySelector('.flag-counter').innerText = gLevel.MINES - gGame.markedCount
//   }
//   var classToAdd = 'neg' + gBoard[cellI][cellJ].minesAroundCount
//   currentElement.classList.add(classToAdd)
//   gBoard[cellI][cellJ].isShown = true
//   gGame.shownCount++
//   // Stop also when getting to cell with some negs
//   if (gBoard[cellI][cellJ].minesAroundCount > 0) {
//     return
//   }
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       expendedReveal(i, j)
//     }
//   }
// }

function timerBtMillisec() {
  gStartTime = Date.now();
  gIntervalTimer = setInterval(() => {
    var dif = Date.now() - gStartTime;
    var elMlSeconds = document.querySelector('.mil-seconds');
    elMlSeconds.innerText = dif / 1000;
  }, 10);
}

function copy2Darray(mat) {
  var board = [];
  for (var i = 0; i < mat.length; i++) {
    var row = mat[i].slice();
    board.push(row);
  }
  return board;
}

function changeColorLives(color) {
  if (!color) {
    color = '#f59cdd';
  }
  var elLives = document.querySelector('.lives');
  elLives.style.backgroundColor = color;
}