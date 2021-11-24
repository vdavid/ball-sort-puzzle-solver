import State from './State.mjs';
import BallSortPuzzleSolver from './BallSortPuzzleSolver.mjs';

const pileCapacity = 5;
const initialState = new State(pileCapacity, ['vobcc', 'avrsp', 'amblo', 'oorkd', 'aslkm', 'dpkbv', 'rkrac', 'bpaks', 'slldd', 'pbrmv', 'clmom', 'pdcvs', '', '']);
//const initialState = new State(4, ['mcsc', 'pbpm', 'vblv', 'cvos', 'obvk', 'klkp', 'omlc', 'sblk', 'pmso', '', '']);
// const initialState = new State(4, ['abcd', 'abcd', 'abcd', 'abcd', 'defg', 'defg', 'defg', 'defg', 'hhhh', '', '']);
//const initialState = new State(4, ['abcd', 'abcd', 'abcd', 'abcd', '', '']);
// const initialState = new State(2, ['ab', 'ab', '', '']);

function main() {
    console.log('Started at: ' + new Date());
    if (initialState.isValid()) {
        let ballSortPuzzleSolver = new BallSortPuzzleSolver(initialState);
        const solution = ballSortPuzzleSolver.solve();
        if (solution) {
            solution.states.forEach(state => console.log(state.piles));
            solution.moves.forEach(move => console.log(move));
            console.log('Total moves in solution: ' + solution.states.length);
            console.log('Pile capacity: ' + solution.statistics.pileCapacity);
            console.log('States checked: ' + solution.statistics.statesChecked);
            console.log('Dead ends encountered: ' + solution.statistics.outOfMovesCount);
            console.log('Already tried: ' + solution.statistics.alreadyTriedCount);
            console.log('Duration: ' + solution.statistics.solutionLengthInMilliseconds / 1000 + ' seconds');
        } else {
            console.log('No solution.');
        }
    } else {
        console.log('Invalid state', initialState);
    }
    console.log('Finished at: ' + new Date());
}

// const secondState = doMove(initialState, 0, 1);
// console.log(findAllMoves(initialState));
// console.log(areStatesEqual(secondState, initialState));
// console.log(isAlreadyTried(initialState, [initialState]));
// console.log(isPileHomogenous(''));
//console.log(isSolved(['aa', '', 'bb', '']));
//console.log(solve(initialState, []));

main();