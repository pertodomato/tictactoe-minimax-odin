
function boardUI(play){
let boardElmnt = document.querySelector('.board')

const cells = new Array(9).fill(0)

//making the board
//1 = X  against O ai
//2 = O against X ai
//3 = X against O pvp


for(let i = 0;9 > i;i++){
    let newCell = document.createElement('div')
    newCell.classList.add('cells')
    newCell.addEventListener('click',function(){
        if(cells[i] == 0 && gameEnd(cells)[0] == false){
            if(play == 3 || playerTurn(cells) == play){
                if(playerTurn(cells) == 1){
                    newCell.style.color = 'red'
                    newCell.textContent = 'X'
                    cells[i] = 1
                }
                else{
                    newCell.style.color = 'blue'
                    newCell.textContent = 'O'
                    cells[i] = 2
                }
                //console.log(getMoves(cells))
            }
            if(play != 3){
                let q = getBestMove(getBoard())
                console.log(q)
                makeMove(q)
            }
        }     
    })
    boardElmnt.appendChild(newCell)
}


function gameEnd(newPosition){
    let position = newPosition.slice()
    //console.log('gameEnd?')
    //console.log(position)
    for(let i = 1; i <= 2; i++){
        if((position[0] == i && position[1] == i && position[2] == i) ||
        (position[3] == i && position[4] == i && position[5] == i) ||
        (position[6] == i && position[7] == i && position[8] == i) ||

        (position[0] == i && position[3] == i && position[6] == i) ||
        (position[1] == i && position[4] == i && position[7] == i) ||
        (position[2] == i && position[5] == i && position[8] == i) ||

        (position[0] == i && position[4] == i && position[8] == i) ||
        (position[2] == i && position[4] == i && position[6] == i) 
        )
        {
            if(i == 1){
                return [true, 1]
            }
            else{
                return [true, -1]
            }
        }
    }
    if(countMoves(position) == 9){
        return [true, 0]
    }
    else{
        return [false, 0]
    }
}

function playerTurn(newPosition){
    let position = newPosition.slice()
    let counter = 0
    for(let i = 0; 9>i; i++){
        if(position[i] != 0){
            counter++
        }
    }
    if(counter%2 == 1){
        return 2
    }
    else{
        return 1
    }
}

function countMoves(newPosition){
    let position = newPosition.slice()
    let counter = 0
    for(let i = 0; 9>i; i++){
        if(position[i] != 0){
            counter++
        }
    }
    return counter
}

function makeMove(cell){
    moveCell = boardElmnt.querySelector(`:nth-child(${cell+1})`);
    
    //console.log('makeMove?')
    //console.log(cell)
    //console.log(cells[cell] == 0)
    //console.log(cells)
    //console.log('makeMove?')
    //console.log(gameEnd(cells)[0] === false)
    
    
    if(cells[cell] == 0 && gameEnd(cells)[0] == false && cell < 9){
        if(playerTurn(cells) == 1){
            moveCell.style.color = 'red'
            moveCell.textContent = 'X'
            cells[cell] = 1
        }
        else{
            moveCell.style.color = 'blue'
            moveCell.textContent = 'O'
            cells[cell] = 2
        }
        return getBoard()
    }
    else{
        return false
    }
}

function simulateMove(cell, position){
    let newposition = position.slice()
    if(newposition[cell] == 0 && gameEnd(newposition)[0] == false && cell < 9){
        
        if(playerTurn(newposition) == 1){
            newposition[cell] = 1
        }
        else{
            newposition[cell] = 2
        }
        //console.log('simluation valid position')
        //console.log(newposition)
        //console.log(cell)
        return newposition
    }
    else{
        //console.log('simluation invalid position')
        //console.log(newposition)
        //console.log(cell)
        return false
    }
}

function getBoard(){
    let clonedArray = cells.slice()
    return clonedArray
}

function getMoves(position){
    let moves = []
    if(gameEnd(position)[0]){
        //console.log('available moves')
        return []
    }
    for(let i = 0; 9>i; i++){
        if(position[i] == 0){
            moves.push(i);
        }
    }
    //console.log('available moves')
    //console.log(moves)
    return moves
}


function miniMax(oldPosition){
    //console.log('minmaxPosition')
    //console.log(oldPosition)
    let position = oldPosition.slice()
    let player = playerTurn(position)
    let end = gameEnd(position)
    let availableMoves = getMoves(position);

    //console.log(end)
    if (end[0] == true){
        return [end[1]]
    }
    //maximizingPlayer
    if(player == 1){
        let bestMove = null
        let maxValue = -Infinity

        for (let move of availableMoves) {
            //console.log('testing move')
            //console.log(move)
            let currentScore = Math.max(maxValue, miniMax(simulateMove(move, position))[0] )
            
            if(currentScore > maxValue){
                maxValue = currentScore
                bestMove = move
            }
            
        };
        return [maxValue, bestMove]
    }
    if(player == 2){
        let bestMove = null
        let minValue = Infinity

        for (let move of availableMoves){

            //console.log('testing move')
            //console.log(move)
            
            let currentScore = Math.min(minValue, miniMax(simulateMove(move, position))[0] )
            if(currentScore < minValue){
                minValue = currentScore
                bestMove = move
            }
            
        }; 
        return [minValue, bestMove]
    }
}

function getBestMove(position){
    let best = miniMax(position)[1]
    //console.log('best move')
    //console.log(best)
    return best
}

return {makeMove: makeMove, 
        getBoard: getBoard,
        gameEnd: gameEnd,
        playerTurn: playerTurn,
        getMoves:getMoves,
        getBestMove: getBestMove
    }
}



//1 = X  
//2 = O

//maxPlayer = x
//minPlayer = o
let btnsElement = document.querySelector('.panel')
let pvp = btnsElement.firstElementChild
let xAi = btnsElement.children[1]
let oAi = btnsElement.children[2]
pvp.addEventListener('click',function(){
    let game = boardUI(3)
    btnsElement.style.visibility = 'hidden';
    btnsElement.style.pointerEvents = 'none';
})
xAi.addEventListener('click',function(){
    let game = boardUI(1)
    btnsElement.style.visibility = 'hidden';
    btnsElement.style.pointerEvents = 'none';
})
oAi.addEventListener('click',function(){
    let game = boardUI(2)
    game.makeMove(game.getBestMove(game.getBoard()))
    btnsElement.style.visibility = 'hidden';
    btnsElement.style.pointerEvents = 'none';
})


//game.makeMove(game.getBestMove(game.getBoard()))
