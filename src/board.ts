import _ from 'lodash'

export enum Stone {
  EMPTY,
  BLACK,
  WHITE,
}

export module Stone {
  export function opposite(stone: Stone) {
    switch (stone) {
    case Stone.BLACK: return Stone.WHITE
    case Stone.WHITE: return Stone.BLACK
    default: return Stone.EMPTY
    }
  }
}

export class Board {
  public board: Array<Array<Stone>>
  public turn: Stone
  public gameOver: boolean
  public winPlayer: Stone
  stoneCount: Array<number>

  constructor() {
    this.board = Board.createInitialBoard()
    this.turn = Stone.BLACK
    this.gameOver = false
    this.winPlayer = -1
    this.stoneCount = []
    this.stoneCount[Stone.BLACK] = this.stoneCount[Stone.WHITE] = 2
  }

  // Returns whether the stone can put the location, and flip-able count
  canPut(x: number, y: number, stone: Stone) {
    return this.doPutStone(x, y, stone, false)
  }

  putStone(x: number, y: number, stone: Stone) {
    return this.doPutStone(x, y, stone, true)
  }

  private doPutStone(x: number, y: number, stone: Stone, flip: boolean) {
    let flipped = 0
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (j == 0 && i == 0)
          continue
        flipped += this.checkReverse(x, y, j, i, stone, flip)
      }
    }
    if (flip && flipped >= 0) {
      this.board[y][x] = stone
      this.stoneCount[stone] += flipped + 1
      this.stoneCount[Stone.opposite(stone)] -= flipped
      this.checkGameOver()

      this.turn = Stone.opposite(stone)
    }
    return flipped
  }

  checkReverse(x: number, y: number, dx: number, dy: number, stone: Stone, flip: boolean) {
    const opponent = Stone.opposite(stone)
    let n = 0
    let xx = x, yy = y
    for (;;) {
      xx += dx
      yy += dy
      if (!Board.isValidPos(xx, yy))
        return 0
      const s = this.board[yy][xx]
      if (s != opponent) {
        if (n > 0 && s == stone)
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
      const s = this.board[yy][xx]
      if (s != opponent)
        break
      this.board[yy][xx] = stone
    }
    return n
  }

  checkGameOver() {
    if ((this.stoneCount[Stone.BLACK] + this.stoneCount[Stone.WHITE] >= 64) ||  // Full.
        (this.stoneCount[Stone.BLACK] == 0) ||
        (this.stoneCount[Stone.WHITE] == 0)) {
      this.gameOver = true
      if (this.stoneCount[Stone.BLACK] > this.stoneCount[Stone.WHITE])
        this.winPlayer = Stone.BLACK
      else if (this.stoneCount[Stone.BLACK] < this.stoneCount[Stone.WHITE])
        this.winPlayer = Stone.WHITE
      else
        this.winPlayer = Stone.EMPTY  // draw
    }
  }

  static createInitialBoard(): Array<Array<Stone>> {
    return _.range(8).map(y => {
      return _.range(8).map(x => {
        let stone = Stone.EMPTY
        if ((x == 3 && y == 3) || (x == 4 && y == 4))
          stone = Stone.BLACK
        if ((x == 3 && y == 4) || (x == 4 && y == 3))
          stone = Stone.WHITE
        return stone
      })
    })
  }

  static isValidPos(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8
  }
}
