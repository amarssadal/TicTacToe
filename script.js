////////////////////////////////////|GAME EVALUATION MODULE|////////////////////////////////////
let evaluation = (function () {
    let playerVal, curGameState, lastMove, turnCount = 0;
    
    ////////////////////////--------|Defining winning combos
    let winStateMatch = [
        [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
    ]
                                                                                                                                                                                            
    ////////////////////////--------|Reset All
    function resetAll() {
        playerVal = {
            'human' : 'X',
            'comp': 'O'
        }

        lastMove = '';
        turnCount= 0;

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

    ////////////////////////--------|Internal data is update with the move made by human
    function updInt (cur) {
        if (curGameState[cur] === '') {
            curGameState[cur] = playerVal['human'];
            //console.log(['hp', cur, curGameState[cur]]);
            lastMove = cur;
            return [cur, playerVal['human']];
        } else {
            return false;
        }
    }

    ////////////////////////--------|Computer makes a move
    function compMove () {
        /////////-------------------|Find empty slots in the game
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
        
        /////////-------------------|Create an array from the actual game state and id of slots that are taken and slots that are empty
        let status, empties, taken;
        [status, empties, taken] = findEmpties(curGameState);

        /////////-------------------|Checks if a win is possible, if so return the winning box number
        function win(w, arr) {
            let sideWinArray = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
            for (side of sideWinArray) {
                let winVal = [];
                let emptyOnes = [];
                for (box of side) {
                    if (arr[box] === w) winVal.push(box);
                    if (arr[box] === '') emptyOnes.push(box);
                }
                if (winVal.length === 2 && emptyOnes.length === 1) {
                    return emptyOnes[0];
                }
            }
            return false;
        }

        /////////-------------------|Check if any corners are available, returns a random corner from those available
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

        /////////-------------------|Check if any sides are available, returns a random side from those available
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

        /////////-------------------|Check if human's last move is a side or a corner - returns sides = true, corner = false.
        function checkMove () {
            let sides = [1,5,7,3];
            let corner = [0,2,8,6];
            if (sides.indexOf(lastMove) !== -1) return true;
            if (corner.indexOf(lastMove) !== -1) return false;
        }

        
        
        /////////-------------------|If center is not taken and it's comp's first turn, take the center
        if (status[4] === '' && turnCount === 0) {
            curGameState[4] = playerVal['comp'];
            turnCount++;
            return[4, playerVal['comp']];
        /////////-------------------|If center is taken and it's comp's first turn take one of the corners
        } else if (status[4] === playerVal['human'] && turnCount === 0) {
            let temp = cornerStatus(curGameState);
            curGameState[temp] = playerVal['comp'];
            turnCount++;
            return [temp, playerVal['comp']];
        /////////-------------------|If center is taken and it's comp's second turn or any other turn after that
        } else if (status[4] === playerVal['human'] && turnCount >= 1) {
            console.log('EXECUTES');
            ///=====----------------|Check if a win is possible if so return the winning box number
            if (win(playerVal['comp'], curGameState) !== false) {
                let temp = win(playerVal['comp'], curGameState);
                curGameState[temp] = playerVal['comp'];
                turnCount++;
                return [temp, playerVal['comp']];
            }
            ///=====----------------|Get the value of box opposite to the box human took in previous turn
            let opp = { 0: 8, 1: 7, 2: 6, 5: 3, 8: 0, 7: 1, 6: 2, 3: 5 };
            let temp = opp[lastMove];
            ///=====----------------|Check to make sure human did not take the box right oppposite the box comp picked in it's first turn
            if (curGameState[temp] !== playerVal['comp']) {
                curGameState[temp] = playerVal['comp'];
            ///=====----------------|If yes then pick another random corner
            } else {
                temp = cornerStatus(curGameState);
            ///=====----------------|If a corner is not available pick a random side
                if (!temp) temp = sideStatus(curGameState);
                curGameState[temp] = playerVal['comp'];
            }
            turnCount++;
            return [temp, playerVal['comp']];
        /////////-------------------|If center is not taken and it's comp's second turn
        } else if (status[4] !== playerVal['human'] && turnCount >= 1) {
            //checkMove() returns true for sides and false for corners

            ///=====----------------|Check if a win is possible if so return the winning box number
            if (win(playerVal['comp'], curGameState) !== false) {
                let temp = win(playerVal['comp'], curGameState);
                curGameState[temp] = playerVal['comp'];
                return [temp, playerVal['comp']];
            }
            
            ///=====----------------|Check to block any win possibilities
            if (win(playerVal['human'], curGameState) !== false) {
                let temp = win(playerVal['human'], curGameState);
                curGameState[temp] = playerVal['comp'];
                return [temp, playerVal['comp']];
            }

            let temp;
            if (checkMove()) {
                temp = cornerStatus(curGameState);
            } else {
                temp = sideStatus(curGameState);
            }
            turnCount++;
            curGameState[temp] = playerVal['comp'];
            return [temp, playerVal['comp']];
        }
    }

    ////////////////////////--------|Checks if a win has been had - needs to be called from another function to check both X and O
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

    ////////////////////////--------|Check if X or O has won by calling the above function
    function checkXO () {
        if(checkWin(playerVal['comp'], curGameState) !== false) return checkWin(playerVal['comp'], curGameState);
        if(checkWin(playerVal['human'], curGameState) !== false) return checkWin(playerVal['human'], curGameState);
        return false;
    }

    return {
        /////////-------------------|Initialise the game
        initGame: resetAll,
        /////////-------------------|Update internal after move made
        updateInternal: function (cur) {
            return updInt(cur);
        },
        /////////-------------------|Check if anyone won
        checkWin: checkXO,
        compMove: compMove,
        testing: function () {
            console.log(curGameState);
        }

    }
})();


////////////////////////////////////|UI UPDATE MODULE|////////////////////////////////////
let updateUI = (function () {
    let cells = document.querySelectorAll('.cells');

    ////////////////////////--------|Reset all boards
    function clearUI() {
        for(x of cells) {
            x.innerHTML = '';
            x.style.backgroundColor = 'white';
            x.style.cursor = 'pointer';
        }
    }

    ////////////////////////--------|Update the board
    function updateT(dta) {
        if (dta[0] === undefined) return;
        cells[dta[0]].innerHTML = dta[1];
    }

    ////////////////////////--------|Declare winner
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
    ////////////////////////--------|Save DOM Strings
    let DStrings = uiu.DOMStrings;
    
    ////////////////////////--------|Setup enabling and disabling event listeners
    function addThis (x) {
        turnTaken(x.target.classList[1]);
        x.target.removeEventListener('click', addThis);
        x.target.style.cursor = 'default';
    }
    function eventListeners (val) {
        DStrings.cells.forEach(el => el.addEventListener('click', addThis));
    }
    function removeListenersAll () {
        DStrings.cells.forEach(el => el.removeEventListener('click', addThis));
    }

    ////////////////////////--------|Action on click
    function turnTaken (cur) {
        let convert = {
            'zer': 0,
            'fir': 1,
            'sec': 2,
            'thi': 3,
            'fou': 4,
            'fif': 5,
            'six': 6,
            'sev': 7,
            'eig': 8
        };

        let reConvert = {
            0: 'zer',
            1: 'fir',
            2: 'sec',
            3: 'thi',
            4: 'fou',
            5: 'fif',
            6: 'six',
            7: 'sev',
            8: 'eig'
        };

        cur = convert[cur];
        /////////-------------------|update internal data structure with move made
        let human = evl.updateInternal(cur);
        
        /////////-------------------|update the UI
        if (human) uiu.updateTurn(human);
        /////////-------------------|check if a win is had
        if (human) win = evl.checkWin();
        if (win) uiu.declareWinner(win);
        if (win) removeListenersAll();
        /////////-------------------|if no win computer makes move and event listener removed on the move made
        let compu;
        if (!win) compu = evl.compMove();
        let temp1 =  document.querySelector('.' + reConvert[compu[0]]);
        if (compu && temp1 !== null){
            temp1.removeEventListener('click', addThis);
            temp1.style.cursor = 'default';
        }
        /////////-------------------|update the UI with computer move
        if (compu) uiu.updateTurn(compu);
        /////////-------------------|check if computer won
        if (compu) win = evl.checkWin();
        if (win) uiu.declareWinner(win);
        if (win) removeListenersAll();
    }

    ////////////////////////--------|Initialise the game
    function gameInit () {
        /////////-------------------|refresh all the data held
        evl.initGame();
        /////////-------------------|clear all the cells - UI
        uiu.initUI();
        /////////-------------------|call event listeners
        eventListeners('first');
    }

    return  {
        init: gameInit
    }

})(evaluation, updateUI);

mainController.init();