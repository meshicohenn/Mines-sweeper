
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
  var elCell = document.getElementById(`cell${location.i}-${location.j}`);
  elCell.innerText = value;
}

function renderSmile(value){
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

function timerBtMillisec(){
  gStartTime = Date.now();
  gIntervalTimer = setInterval(() => {
      var dif = Date.now() - gStartTime;
      var elMlSeconds = document.querySelector('.mil-seconds');
      elMlSeconds.innerText = dif /1000;
  }, 10);
  }
  
  function copy2Darray(mat){
      var board = [];
      for (var i = 0; i < mat.length; i++) {
          var row = mat[i].slice();
          board.push(row);
      }
      return board;
  }
