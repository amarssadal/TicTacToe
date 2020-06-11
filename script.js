////////////////////////////////////|GAME EVALUATION MODULE|////////////////////////////////////
let evaluation = (function () {
    let playerVal, curPlayer, curGameStat;
    
    let winStateMatch = [
        [1,2,3], [4,5,6], [7,8,9], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [1,2,8], [3,5,7]
    ]

    ////////////////////////////////////|Reset All
    function resetAll() {
        playerVal = {
            0: 'X',
            1: 'O'
        }
    
        //True means it's human's turn, false means computer's turn
        curPlayer = true;

        curGameState = {
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: '',
            9: ''
        };
    }

    ////////////////////////////////////|Move Made
    function updInt (cur) {
        if (!curGameState[cur]) {
            curGameState[cur] = playerVal[curPlayer ?0 :1 ];
            return [cur, curGameState[cur]];
        } else {
            return false;
        }
    }

    ////////////////////////////////////|Computer makes a move
    function compMove () {
        for (n in curGameState) {
            if(curGameState[n] === '') {
                curGameState[n] = playerVal[1];
                return [parseInt(n), curGameState[n]];
            }
        }
    }

    ////////////////////////////////////|Checks if a win has been had - needs to be called from another function to check both X and O
    function checkWin(m) {
        for (winArray of winStateMatch) {
            let win = [];
            for (winPos of winArray){
                if (curGameState[winPos] === m) {
                    win.push(winPos);
                }
            }
            if (win.length === 3) return [m, win];
        }
    }

    ////////////////////////////////////|Check if X or O has won by calling the above function
    function checkXO () {
        if(checkWin(playerVal[0])) return checkWin(playerVal[0]);
        if(checkWin(playerVal[1])) return checkWin(playerVal[1]);
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
        compMove: compMove

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
        cells[dta[0] - 1].innerHTML = dta[1];
    }

    ////////////////////////////////////|Declare winner
    function decWin(win) {
        for (cell of win[1]) {
            cells[cell-1].style.backgroundColor = 'green';
        }

    }

    return {
        initUI: clearUI,
        DOMStrings: { cells },
        updateTurn: function (dta) {
            updateT(dta);
        },
        decWin: decWin
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
        cur = cur === 'fir' ?1 :cur === 'sec' ?2 :cur === 'thi' ?3 :cur === 'fou' ?4 :cur === 'fif' ?5 :cur === 'six' ?6 :cur === 'sev' ?7 :cur === 'eig' ?8 :cur === 'nin' ?9 :0;
        //------------------------------|update internal data structure with move made
        let dta = evl.updateInternal(cur);
        //------------------------------|update the UI
        if (dta) uiu.updateTurn(dta);
        //------------------------------|check if a win has been had
        let cta = evl.compMove();
        //------------------------------|update the UI with computer move
        if (cta) uiu.updateTurn(cta);
        //------------------------------|check if a win is had
        let win = evl.checkWin();
        //------------------------------|If win - update UI with winner and disable event listeners
        if(win) uiu.decWin(win);
        if(win) removeListeners();
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