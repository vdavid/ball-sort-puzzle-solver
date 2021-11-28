# Introduction

This is a solver for the Ball Sort Puzzle game ([Android](https://play.google.com/store/apps/details?id=com.GMA.Ball.Sort.Puzzle&hl=en&gl=US) | [iOS](https://apps.apple.com/us/app/ball-sort-puzzle/id1494648714)).

Around level 300, I got bored of trying to solve the levels but I also couldn't quit, so I made a solver for the game to reach mental closure.

# How to use

It's a bit manual, but you can use the following commands to solve any puzzle you want:

1. Clone the repo
2. Make sure you have Node.js installed. The script works on any Node.js version between 14 and 16, but should also work on higher versions.
3. Run `npm install`.
4. Edit index.mjs: add a new item to the `startingStates` array, in the same format as the ones above them.
   - For the pileCapacity (first argument), set a number, e.g. 4 or 5, depending on the capacity of the containers in the puzzle you want to solve.
   - For the containers, you can use any letter, number, or other single UTF-8 character to represent the elements, just be consistent. Leave as many empty strings at the end as the number of containers you have in the puzzle.
5. Run `npm start`
6. In less than a second, you'll get a bunch of output.
   - At the end there will be a line like this: "Total moves in solution: {N}"
   - Right befor this line, there will be {N} lines of this kind:
   `{sourcePileIndex: {x}, targetPileIndex: {y}, fruitLetter: '{l}' }`
   These lines describe the moves you'll need to make to solve your puzzle.
   - If you get "No solution." as the output, it's either that your puzzle has no solution (not likely if it's in the game) or you've mistyped something. Check your input again.

Happy solving!