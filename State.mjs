export default class State {
    /** {int} */
    pileCapacity;
    /** {string[]} */
    piles;
    /** {string[]} */
    #_cachedPilesSorted;

    /**
     * @param {int} pileCapacity
     * @param {string[]} piles
     * @private
     */
    constructor(pileCapacity, piles) {
        this.pileCapacity = pileCapacity;
        this.piles = piles;
    }


    /**
     * @returns {{sourcePileIndex: int, targetPileIndex: int, fruitLetter: string}[]}
     */
    getAllMoves() {
        return this.piles.reduce((result, pile, index) => [...result, ...this._findAllMovesFromPile(index)], []);
    }

    /**
     * @param {int} sourcePileIndex
     * @returns {{sourcePileIndex: int, targetPileIndex: int, fruitLetter: string}[]}
     */
    _findAllMovesFromPile(sourcePileIndex) {
        const fruitLetter = this.piles[sourcePileIndex].substr(-1);
        const allPossibleTargetPileIndices = this.piles[sourcePileIndex] ?
            this._getPossibleTargetPileIndices(fruitLetter).filter(index => index !== sourcePileIndex)
            : [];
        return allPossibleTargetPileIndices.map(targetPileIndex => ({sourcePileIndex, targetPileIndex, fruitLetter}));
    }

    /**
     * @param {string} fruitLetter
     */
    _getPossibleTargetPileIndices(fruitLetter) {
        return this.piles.reduce((result, pile, index) =>
            (this._canBePutOnTop(pile, fruitLetter) ? [...result, index] : result), []);
    }

    /**
     * @param {string} pile E.g. "cccpp"
     * @param {string} fruitLetter E.g. "o"
     * @returns {boolean}
     */
    _canBePutOnTop(pile, fruitLetter) {
        return pile === '' || (pile.substr(-1) === fruitLetter && (pile.length < this.pileCapacity));
    }

    /**
     * @returns {boolean}
     */
    isSolved() {
        return !this.piles.some(pile => !this._isPileHomogenousAndFullOrEmpty(pile));
    }

    /**
     * @param {string} pile
     * @return {boolean}
     * @private
     */
    _isPileHomogenousAndFullOrEmpty(pile) {
        return (!pile || pile.length === this.pileCapacity)
            && !pile.split('').find(character => character !== pile.substr(0, 1));
    }

    /**
     * @returns {string[]}
     */
    getSortedPilesWithCache() {
        if (!this.#_cachedPilesSorted) {
            this.#_cachedPilesSorted = [...this.piles].sort();
        }
        return this.#_cachedPilesSorted;
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        return this.piles.join('').length === this.pileCapacity * (this.piles.length - 2)
            ? !Object.values(this._getFruitCounts(this.piles.join(''))).some(fruitCount => fruitCount === this.pileCapacity)
            : false;
    }

    /**
     * @returns {number} A number between 0 and total the fruit count. It's all pile heterogenity points summed up.
     */
    getHeterogenityPoints() {
        return this.piles.reduce((result, pile) => result + this._getPileHeterogenityPoints(pile), 0);
    }

    /**
     * @returns {number} The number of fruits in the game in this state
     */
    getNumberOfFruits() {
        return Object.keys(this._getFruitCounts(this.piles.join(''))).length;
    }

    /**
     * @param {string} pile
     * @returns {number} A number between 0 and `pileCapacity`.
     *          In case of an empty pile, it's `pileCapacity`.
     *          If all fruits in a pile are the same, this point is `pileCapacity - 1`
     *          If all are different and the pile is full, it's 0.
     * @private
     */
    _getPileHeterogenityPoints(pile) {
        return Object.keys(this._getFruitCounts(pile)).length;
    }

    /**
     * @param {string} fruits A bunch of letters. Might be one pile, or several concatenated.
     * @returns {Object<string, int>} The number of each character in the string
     * @private
     */
    _getFruitCounts(fruits) {
        return fruits.split('').reduce((result, character) => {
                result[character] = result[character] ? result[character] + 1 : 0;
                return result;
            }, {});
    }
}