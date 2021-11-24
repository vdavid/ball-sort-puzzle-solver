import State from './State.mjs';
function testGetPileHeterogenityPoints() {
    /* Arrange */
    const stateEmpty = new State(2, ['', '', '', '']);
    const stateHomogenous = new State(2, ['aa', 'bb', '', '']);
    const stateHeterogenous = new State(2, ['ab', 'ab', '', '']);

    /* Act */
    const pointsEmpty = stateEmpty.getHeterogenityPoints();
    const pointsHomogenous = stateHomogenous.getHeterogenityPoints();
    const pointsHeterogenous = stateHeterogenous.getHeterogenityPoints();

    /* Assert */
    if (pointsEmpty !== 0) {
        throw new Error(`Should be 0 but it’s ${pointsEmpty}.`)
    }
    if (pointsHomogenous !== 2) {
        throw new Error(`Should be 2 but it’s ${pointsHomogenous}.`)
    }
    if (pointsHeterogenous !== 4) {
        throw new Error(`Should be 4 but it’s ${pointsHomogenous}.`)
    }
}

testGetPileHeterogenityPoints();
