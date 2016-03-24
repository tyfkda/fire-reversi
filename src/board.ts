/// <reference path="../typings/main/definition/lodash/index.d.ts" />

function isValidPos(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}

export class Cell {
  constructor(public x: number, public y: number, public stone: number) {
  }
}

export class Board {
  public board: Array<Array<Cell>>
  public turn: number
  public gameOver: boolean
  public winPlayer: number
  stoneCount: Array<number>

  constructor() {
    this.board = Board.createInitialBoard()
    this.turn = 0
    this.gameOver = false
    this.winPlayer = -1
    this.stoneCount = [2, 2]
  }

  // Returns whether the stone can put the location, and flip-able count
  canPut(x, y, stone) {
    return this.doPutStone(x, y, stone, false)
  }

  putStone(x, y, stone) {
    return this.doPutStone(x, y, stone, true)
  }

  private doPutStone(x, y, stone, flip) {
    let flipped = 0
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (j == 0 && i == 0)
          continue
        flipped += this.checkReverse(x, y, j, i, stone, flip)
      }
    }
    if (flip && flipped >= 0) {
      this.board[y][x].stone = stone
      this.stoneCount[stone - 1] += flipped + 1
      this.stoneCount[2 - stone] -= flipped
      this.checkGameOver()

      this.turn = 1 - (stone - 1)
    }
    return flipped
  }

  checkReverse(x, y, dx, dy, stone, flip) {
    const opponent = 3 - stone
    let n = 0
    let xx = x, yy = y
    for (;;) {
      xx += dx
      yy += dy
      if (!isValidPos(xx, yy))
        return 0
      const c = this.board[yy][xx].stone
      if (c != opponent) {
        if (n > 0 && c == stone)
          break
        return 0
      }
      ++n
    }

    // Can flip!

    if (!flip)
      return n

    xx = x
    yy = y
    for (;;) {
      xx += dx
      yy += dy
      const c = this.board[yy][xx].stone
      if (c != opponent)
        break
      this.board[yy][xx].stone = stone
    }
    return n
  }

  checkGameOver() {
    if ((this.stoneCount[0] + this.stoneCount[1] >= 64) ||  // Full.
        (this.stoneCount[0] == 0) ||
        (this.stoneCount[1] == 0)) {
      this.gameOver = true
      if (this.stoneCount[0] > this.stoneCount[1])
        this.winPlayer = 1
      else if (this.stoneCount[0] < this.stoneCount[1])
        this.winPlayer = 2
      else
        this.winPlayer = 0  // draw
    }
  }

  static createInitialBoard(): Array<Array<Cell>> {
    return _.range(8).map(y => {
      return _.range(8).map(x => {
        let stone = 0
        if ((x == 3 && y == 3) || (x == 4 && y == 4))
          stone = 1
        if ((x == 3 && y == 4) || (x == 4 && y == 3))
          stone = 2
        return {
          x,
          y,
          stone,
        }
      })
    })
  }
}
