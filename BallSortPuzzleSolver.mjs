import State from './State.mjs';

/**
 * @typedef {Object} Solution
 * @property {{sourcePileIndex: int, targetPileIndex: int, fruitLetter: string}[]} moves
 * @property {State[]} states
 * @property {{pileCapacity: int, statesChecked: int, outOfMovesCount: int, alreadyTriedCount: int, solutionLengthInMilliseconds: int}} statistics
 */

export default class BallSortPuzzleSolver {
    constructor(initialState) {
        this.initialState = initialState;
        this.statistics = {
            pileCapacity: initialState.pileCapacity,
            statesChecked: 0,
            outOfMovesCount: 0,
            alreadyTriedCount: 0,
            solutionLengthInMilliseconds: null,
            initialHeterogenity: initialState.getHeterogenityPoints(),
            targetHeterogenity: initialState.getNumberOfFruits(),
            lowestHeterogenity: 1000000000,
        };
        this.knownStates = [];
    }

    /**
     * Arguments are for recursion only, don't give them when calling this method externally!
     *
     * @param {State} [state]
     * @param {{sourcePileIndex: int, targetPileIndex: int, fruitLetter: string}[]} [pastMoves]
     * @param {State[]} [pastStates]
     * @param {Date} [startDateTime]
     * @returns {Solution|null}
     */
    solve(state = this.initialState, pastMoves = [], pastStates = [], startDateTime = new Date()) {
        this._addKnownState(state);
        if (state.isSolved()) { /* Solved! */
            this.statistics.solutionLengthInMilliseconds = (new Date().getTime() - startDateTime.getTime());
            return {moves: pastMoves, states: [...pastStates, state], statistics: this.statistics};
        } else {
            const possibleMoves = state.getAllMoves();
            const possibleMovesAndStates = possibleMoves.map(move => ({move, state: this.doMove(state, move.sourcePileIndex, move.targetPileIndex)}));
            const prioritizedMovesAndStates = this._prioritizeMovesAndStates(possibleMovesAndStates);
            for (const newStateAndMove of prioritizedMovesAndStates) {
                if (!this._isKnownState(newStateAndMove.state)) {
                    this.statistics.statesChecked++;
                    if (newStateAndMove.state.getHeterogenityPoints() < this.statistics.lowestHeterogenity) {
                        this.statistics.lowestHeterogenity = newStateAndMove.state.getHeterogenityPoints();
                        console.log(new Date(), `New best found after ${this.statistics.statesChecked} states: ${this.statistics.lowestHeterogenity}`);
                    }
                    /* Try new state */
                    const result = this.solve(newStateAndMove.state, [...pastMoves, newStateAndMove.move], [...pastStates, state], startDateTime);
                    if (result) {
                        return result;
                    }
                } else {
                    this.statistics.alreadyTriedCount++;
                }
            }
        }

        this.statistics.outOfMovesCount++;
        return null; /* Out of moves */
    }

    /**
     * @param {{move: {sourcePileIndex: int, targetPileIndex: int, fruitLetter: string}, state: State}[]} movesAndStates
     * @returns {{move: {sourcePileIndex: int, targetPileIndex: int, fruitLetter: string}, state: State}[]}
     * @private
     */
    _prioritizeMovesAndStates(movesAndStates) {
        return [...movesAndStates].sort((moveAndState1, moveAndState2) => moveAndState1.state.getHeterogenityPoints() - moveAndState2.state.getHeterogenityPoints());
        // Unsorted:      268 states, 0.021 seconds, 98 moves
        // badly sorted:  425 states, 0.053 seconds, 158 moves
        // well sorted:    70 states, 0.015 seconds, 49 moves
        // global history: 66 states, 0.037 seconds, 48 moves
    }

    /**
     * @param {State} state
     * @param {int} sourcePileIndex
     * @param {int} destinationPileIndex
     * @return {State} The new state
     */
    doMove(state, sourcePileIndex, destinationPileIndex) {
        if (!state.piles[sourcePileIndex]) {
            console.error('Error!', state.piles, sourcePileIndex, destinationPileIndex);
        }
        const fruitLetter = state.piles[sourcePileIndex].substr(-1);
        const firstPileIndex = Math.min(sourcePileIndex, destinationPileIndex);
        const secondPileIndex = Math.max(sourcePileIndex, destinationPileIndex);
        const newSourcePile = state.piles[sourcePileIndex].substr(0, state.piles[sourcePileIndex].length - 1);
        const newDestinationPile = state.piles[destinationPileIndex] + fruitLetter;
        return new State(state.pileCapacity, [
            ...state.piles.slice(0, firstPileIndex),
            firstPileIndex === sourcePileIndex ? newSourcePile : newDestinationPile,
            ...state.piles.slice(firstPileIndex + 1, secondPileIndex),
            firstPileIndex !== sourcePileIndex ? newSourcePile : newDestinationPile,
            ...state.piles.slice(secondPileIndex + 1),
        ]);
    }

    /**
     * @param {State} state
     * @returns {boolean}
     * @private
     */
    _isKnownState(state) {
        // noinspection JSIncompatibleTypesComparison
        const binarySearchResult = this._binarySearch(this.knownStates, this._serializePiles(state.getSortedPilesWithCache()),
            (a, b) => a < b ? -1 : (a === b ? 0 : 1));
        return binarySearchResult >= 0;
    }

    /**
     * @param {State} state
     * @private
     */
    _addKnownState(state) {
        const serializedState = this._serializePiles(state.getSortedPilesWithCache());
        // noinspection JSIncompatibleTypesComparison
        const binarySearchResult = this._binarySearch(this.knownStates, serializedState,
            (a, b) => a < b ? -1 : (a === b ? 0 : 1));
        if (binarySearchResult < 0) {
            const position = -1 * binarySearchResult - 1;
            this.knownStates = [...this.knownStates.slice(0, position), serializedState, ...this.knownStates.slice(position)];
        }
    }

    /**
     * @param {string[]} piles
     * @returns {string}
     * @private
     */
    _serializePiles(piles) {
        return piles.join('|');
    }

    /**
     * @template T
     * @param {T[]} array
     * @param {T} item
     * @param {function(a: T,b: T): int} compareFunction
     * @returns {number} A positive number if found, a negative number (`positionToInsert * (-1) - 1`) if not found.
     */
    _binarySearch(array, item, compareFunction) {
        let lowerBound = 0;
        let upperBound = array.length - 1;
        while (lowerBound <= upperBound) {
            const currentKey = (upperBound + lowerBound) >> 1;
            const comparisonResult = compareFunction(item, array[currentKey]);
            if (comparisonResult > 0) {
                lowerBound = currentKey + 1;
            } else if(comparisonResult < 0) {
                upperBound = currentKey - 1;
            } else {
                return currentKey;
            }
        }
        return -lowerBound - 1;
    }
}