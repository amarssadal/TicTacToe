////////////////////////////////////|GAME EVALUATION MODULE|////////////////////////////////////
let evaluation = (function () {
    let playerVal, curPlayer, curGameStat, lastMove, lastToLastMove, turnCount = 0;
    
    let winStateMatch = [
        [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
    ]
                                                                                                                                                                                            
    ////////////////////////////////////|Reset All
    function resetAll() {
        playerVal = {
            'human' : 'X',
            'comp': 'O'
        }
    
        //True means it's human's turn, false means computer's turn
        curPlayer = true;

        curGameState = {
            0: '',
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: ''
        };
    }

    ////////////////////////////////////|Move Made
    function updInt (cur) {
        if (curGameState[cur] === '') {
            curGameState[cur] = playerVal['human'];
            //console.log(['hp', cur, curGameState[cur]]);
            curPlayer = false;
            lastToLastMove = lastMove;
            lastMove = cur;
            return [cur, playerVal['human']];
        } else {
            return false;
        }
    }

    ////////////////////////////////////|Computer makes a move
    function compMove () {
        //------------------------------|find empty slots in the game
        function findEmpties (arr) {
            let status = [];
            let empties = [];
            let taken = [];
            for (emp in arr) {
                if (arr[emp] === '') {
                    empties.push(parseInt(emp));
                    status.push('');
                } else {
                    status.push(arr[emp]);
                    taken.push(parseInt(emp));
                }
            }
            return [status, empties, taken];
        }
        
        //------------------------------|create an array from the actual game state and id of slots that are taken and slots that are empty
        let status, empties, taken;
        [status, empties, taken] = findEmpties(curGameState);

        //------------------------------|checks if the human is one box away from winning the sides
        function sidesWin(arr) {
            let sideWinArray = [[0,1,2],[2,5,8],[8,7,6],[6,3,0]];
            for (side of sideWinArray) {
                let winVal = [];
                let emptyOnes = [];
                for (box of side) {
                    console.log(box);
                    if (arr[box] === playerVal['comp']) winVal.push(box);
                    if (arr[box] === '') emptyOnes.push(box);
                }
                if (winVal.length === 2 && emptyOnes.length === 1) {
                    console.log('sideWin', emptyOnes);
                    return emptyOnes[0];
                }

                // if (arr[side[0]] === playerVal['comp'] && arr[side[2]] === playerVal['comp'] && arr[side[1]] !== playerVal['']) {
                //     console.log(side[1]);
                //     return side[1];
                // }
            }
            return false;
        }

        //console.log(status, empties, taken);
        //------------------------------|Check if any corners are available, returns a random corner from those available
        function cornerStatus(arr) {
            let corners = [0,2,6,8];
            let avail = [];
            for (corner of corners) {
                if (arr[corner] !== playerVal['human'] && arr[corner] !== playerVal['comp']) {
                    avail.push(corner);
                }
            }
            let temp = Math.floor(Math.random() * avail.length);
            return avail[temp];
        }

        //------------------------------|Check if any sides are available, returns a random corner from those available
        function sideStatus(arr) {
            let sides = [1,3,5,7];
            let avail = [];
            for (side of sides) {
                if (arr[side] !== playerVal['human'] && arr[side] !== playerVal['comp']) {
                    avail.push(side);
                }
            }
            let temp = Math.floor(Math.random() * avail.length);
            return avail[temp];
        }

        //------------------------------|Step to win
        function stepToWin(arr) {
            let winCombos = [];
            for (let wins in winStateMatch) {
                let count = 0;
                for (let box of wins) {
                    if (arr[box] === playerVal['comp']) count++;
                    if (arr[box] === '') count--;
                }
                if (count === -1) winCombos.push(wins);
            }
            let temp = Math.floor(Math.random());
        }

        
        
        //------------------------------|if center is not taken and it's comp's first turn, take the center
        if (status[4] === '' && turnCount === 0) {
            curGameState[4] = playerVal['comp'];
            turnCount++;
            return[4, playerVal['comp']];
        //------------------------------|if center is taken and it's comp's first turn take one of the corners
        } else if (status[4] === playerVal['human'] && turnCount === 0) {
            let temp = cornerStatus(curGameState);
            curGameState[temp] = playerVal['comp'];
            turnCount++;
            return [temp, playerVal['comp']];
        //------------------------------|if center is taken and it's comp's second turn or any other turn after that
        } else if (status[4] === playerVal['human'] && turnCount >= 1) {
            //===========------=========|check if a win is possible if so return the winning box number
            if (sidesWin(curGameState) !== false) {
                let temp = sidesWin(curGameState);
                curGameState[temp] = playerVal['comp'];
                return [temp, playerVal['comp']];
            }
            //===========------=========|take the box opposite to the box human took in previous turn
            let opp = { 0: 8, 1: 7, 2: 6, 5: 3, 8: 0, 7: 1, 6: 2, 3: 5 };
            let temp = opp[lastMove];
            //===========------=========|check to make sure human did not take the box right oppposite the box comp picked in it's first turn
            if (curGameState[temp] !== playerVal['comp']) {
                console.log('test');
                curGameState[temp] = playerVal['comp'];
                //===========------=========|if yes then pick another random corner
            } else {
                temp = cornerStatus(curGameState);
                //===========------=========|if a corner is not available pick a random side
                if (!temp) temp = sideStatus(curGameState);
                curGameState[temp] = playerVal['comp'];
                console.log('test2', temp);
            }
            turnCount++;
            return [temp, playerVal['comp']];
        //------------------------------|if center is not taken and it's comp's second turn
        } else if (status[4] === playerVal['human'] && turnCount >= 1) {
            
        }
    }

    ////////////////////////////////////|Checks if a win has been had - needs to be called from another function to check both X and O
    function checkWin(m, currGame) {
        for (winArray of winStateMatch) {
            let win = [];
            for (winPos of winArray){
                if (currGame[winPos] === m) {
                    win.push(winPos);
                }
            }
            if (win.length === 3) return [m, win];
        }
        return false;
    }

    ////////////////////////////////////|Check if X or O has won by calling the above function
    function checkXO () {
        if(checkWin(playerVal['comp'], curGameState) !== false) return checkWin(playerVal['comp'], curGameState);
        if(checkWin(playerVal['human'], curGameState) !== false) return checkWin(playerVal['human'], curGameState);
        return false;
    }

    return {
        //------------------------------|initialise the game
        initGame: resetAll,
        //------------------------------|update internal after move made
        updateInternal: function (cur) {
            return updInt(cur);
        },
        //------------------------------|Check if anyone won
        checkWin: checkXO,
        compMove: compMove,
        testing: function () {
            console.log(curGameState);
        }
0
    }
})();


////////////////////////////////////|UI UPDATE MODULE|////////////////////////////////////
let updateUI = (function () {
    let cells = document.querySelectorAll('.cells');

    ////////////////////////////////////|Reset all boards
    function clearUI() {
        for(x of cells) {
            x.innerHTML = '';
        }
    }

    ////////////////////////////////////|Update the board
    function updateT(dta) {
        console.log('UI', dta);
        cells[dta[0]].innerHTML = dta[1];
    }

    ////////////////////////////////////|Declare winner
    function decWin(win) {
        for (cell of win[1]) {
            cells[cell].style.backgroundColor = 'green';
        }

    }

    return {
        initUI: clearUI,
        DOMStrings: { cells },
        updateTurn: function (dta) {
            updateT(dta);
        },
        declareWinner: decWin
    }
})();


////////////////////////////////////|MAIN CONTROLLER MODULE|////////////////////////////////////
let mainController = (function (evl, uiu) {
    ////////////////////////////////////|Save DOM Strings
    let DStrings = uiu.DOMStrings;
    
    ////////////////////////////////////|Setup enabling and disabling event listeners
    function addThis (x) {
        turnTaken(x.target.classList[1]);
    }
    function eventListeners (val) {
        DStrings.cells.forEach(el => el.addEventListener('click', addThis));
    }
    function removeListeners () {
        DStrings.cells.forEach(el => el.removeEventListener('click', addThis));
    }

    ////////////////////////////////////|Action on click
    function turnTaken (cur) {
        cur = cur === 'zer' ?0 :cur === 'fir' ?1 :cur === 'sec' ?2 :cur === 'thi' ?3 :cur === 'fou' ?4 :cur === 'fif' ?5 :cur === 'six' ?6 :cur === 'sev' ?7 :cur === 'eig' ?8 :0;
        //------------------------------|update internal data structure with move made
        let human = evl.updateInternal(cur);
        //------------------------------|update the UI
        if (human) uiu.updateTurn(human);
        //------------------------------|check if a win is had
        if (human) win = evl.checkWin();
        if (win) uiu.declareWinner(win);
        if (win) removeListeners();
        //------------------------------|if no win computer makes move
        let compu;
        if (!win) compu = evl.compMove();
        //------------------------------|update the UI with computer move
        if (compu) uiu.updateTurn(compu);
        //------------------------------|check if computer won
        if (compu) win = evl.checkWin();
        if (win) uiu.declareWinner(win);
        if (win) removeListeners();
    }

    ////////////////////////////////////|Initialise the game
    function gameInit () {
        //------------------------------|refresh all the data held
        evl.initGame();
        //------------------------------|clear all the cells - UI
        uiu.initUI();
        //------------------------------|call event listeners
        eventListeners('first');
    }

    return  {
        init: gameInit
    }

})(evaluation, updateUI);

mainController.init();