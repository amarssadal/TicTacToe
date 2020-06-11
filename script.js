////////////////////////////////////|GAME EVALUATION MODULE|////////////////////////////////////
let evaluation = (function () {
    let playerVal, curPlayer, curGameStat;
    
    let winStateMatch = [
        [1,2,3], [4,5,6], [7,8,9], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [3,5,7]
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
        if (curGameState[cur] === '') {
            curGameState[cur] = playerVal[0];
            //console.log(['hp', cur, curGameState[cur]]);
            curPlayer = false;
            return [cur, curGameState[cur]];
        } else {
            return false;
        }
    }

    ////////////////////////////////////|Computer makes a move
    function compMove () {
        let empties = [];
        //------------------------------|find empty slots in the game
        console.log('before', curGameState);
        for (emp in curGameState) {
             if (curGameState[emp] === '') empties.push(parseInt(emp));
        }
        console.log(empties);
        // //------------------------------|
        let randomer = Math.floor((Math.random() * empties.length));
        console.log(randomer, empties.length);
        curGameState[empties[randomer]] = 'O';
        return [empties[randomer], 'O']
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
    }

    ////////////////////////////////////|Check if X or O has won by calling the above function
    function checkXO () {
        if(checkWin(playerVal[0], curGameState)) return checkWin(playerVal[0], curGameState);
        if(checkWin(playerVal[1], curGameState)) return checkWin(playerVal[1], curGameState);
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
        //------------------------------|check if a win is had
        if (dta) win = evl.checkWin();
        if(win) uiu.decWin(win);
        if(win) removeListeners();
        //------------------------------|if no win computer makes move
        let cta;
        if (!win) cta = evl.compMove();
        //------------------------------|update the UI with computer move
        if (cta) uiu.updateTurn(cta);
        //------------------------------|check if computer won
        if (cta) win = evl.checkWin();
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