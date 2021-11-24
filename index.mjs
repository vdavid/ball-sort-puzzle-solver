import State from './State.mjs';
import BallSortPuzzleSolver from './BallSortPuzzleSolver.mjs';

const startingStates = [
    new State(2, ['ab', 'ab', '', '']),
    new State(4, ['abcd', 'abcd', 'abcd', 'abcd', '', '']),
    new State(4, ['abcd', 'abcd', 'abcd', 'abcd', 'defg', 'defg', 'defg', 'defg', 'hhhh', '', '']),
    new State(4, ['mcsc', 'pbpm', 'vblv', 'cvos', 'obvk', 'klkp', 'omlc', 'sblk', 'pmso', '', '']),
    new State(5, ['vobcc', 'avrsp', 'amblo', 'oorkd', 'aslkm', 'dpkbv', 'rkrac', 'bpaks', 'slldd', 'pbrmv', 'clmom', 'pdcvs', '', '']),
];

/* Solve the last item of the list */
main(startingStates[startingStates.length - 1]);

/* Execution ends here */

/**
 * @param {State} initialState
 */
function main(initialState) {
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
