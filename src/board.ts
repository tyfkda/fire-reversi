/// <reference path="../typings/main/definition/lodash/index.d.ts" />

function isValidPos(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}

export class Cell {
  constructor(public x: number, public y: number, public color: number) {
  }
}

export class Board {
  public board: Array<Array<Cell>>
  public turn: number
  public gameOver: boolean
  public winPlayer: number
  colorCount: Array<number>

  constructor() {
    this.board = Board.createInitialBoard()
    this.turn = 0
    this.gameOver = false
    this.winPlayer = -1
    this.colorCount = [2, 2]
  }

  putColor(x, y, color, flip) {
    let flipped = 0
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (j == 0 && i == 0)
          continue
        flipped += this.checkReverse(x, y, j, i, color, flip)
      }
    }
    if (flip && flipped >= 0) {
      this.board[y][x].color = color
      this.colorCount[color - 1] += flipped + 1
      this.colorCount[2 - color] -= flipped
      this.checkGameOver()

      this.turn = 1 - (color - 1)
    }
    return flipped
  }

  checkReverse(x, y, dx, dy, color, flip) {
    const opponent = 3 - color
    let n = 0
    let xx = x, yy = y
    for (;;) {
      xx += dx
      yy += dy
      if (!isValidPos(xx, yy))
        return 0
      const c = this.board[yy][xx].color
      if (c != opponent) {
        if (n > 0 && c == color)
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
      const c = this.board[yy][xx].color
      if (c != opponent)
        break
      this.board[yy][xx].color = color
    }
    return n
  }

  checkGameOver() {
    if ((this.colorCount[0] + this.colorCount[1] >= 64) ||  // Full.
        (this.colorCount[0] == 0) ||
        (this.colorCount[1] == 0)) {
      this.gameOver = true
      if (this.colorCount[0] > this.colorCount[1])
        this.winPlayer = 1
      else if (this.colorCount[0] < this.colorCount[1])
        this.winPlayer = 2
      else
        this.winPlayer = 0  // draw
    }
  }

  static createInitialBoard(): Array<Array<Cell>> {
    return _.range(8).map(y => {
      return _.range(8).map(x => {
        let color = 0
        if ((x == 3 && y == 3) || (x == 4 && y == 4))
          color = 1
        if ((x == 3 && y == 4) || (x == 4 && y == 3))
          color = 2
        return {
          x,
          y,
          color,
        }
      })
    })
  }
}
