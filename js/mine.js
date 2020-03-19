
const MINE = '💣';


function putRandomMine(i, j) {
    // debugger
    var count = 0;
    while (count < gLevel.mines) {
        var indexI = getRandomIntInclusive(0, gLevel.size-1);
        var indexJ = getRandomIntInclusive(0, gLevel.size-1);        
        if (i === indexI && j === indexJ) continue;
        if (!gBoard[indexI][indexJ].isMine) {
            gBoard[indexI][indexJ].isMine = true;
            count++;
            // renderCell({ i: indexI, j: indexJ }, MINE);
        }
    }
}

