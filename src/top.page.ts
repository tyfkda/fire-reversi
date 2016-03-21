import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

declare var Firebase: any

function isValidPos(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
}

class Cell {
  constructor(public x: number, public y: number, public color: number) {
  }
}

@Component({
  pipes: [FirebaseEventPipe],
  template: `
<h2>Reversi</h2>

<div class="clearfix">
  <div class="pull-left">
    <div *ngFor="#row of board"
      ><span *ngFor="#cell of row"
        ><img [src]="getCellImage(cell)"
              (click)="onClickCell(cell)"
      ></span
    ></div>
  </div>
  <div class="pull-left" style="margin-left: 8px;">
    <div>Turn: {{turn==0?'Black':'White'}}</div>
    <br>
    <div>Black:#{{colorCount[0]}}, White:{{colorCount[1]}}</div>
    <br>
    <div [hidden]="!gameOver">
      <div [hidden]="winPlayer!=1">BLACK win!</div>
      <div [hidden]="winPlayer!=2">WHITE win!</div>
      <div [hidden]="winPlayer!=0">draw</div>
    </div>
  </div>
</div>

Footer.

    `,
})
export class TopPage {
  _: any
  movesUrl: string
  movesRef: Firebase
  isLoggedIn: boolean
  authData: any
  board: Array<Array<Cell>>
  turn: number
  colorCount: Array<number>
  gameOver: boolean
  winPlayer: number

  constructor() {
    this.movesUrl = 'https://2nqujjklgij2gg6v.firebaseio.com/movess'
    this.movesRef = new Firebase(this.movesUrl)
    this.movesRef.on('child_added', (snapshot) => {
      const cell = snapshot.val()
      const n = this.putColor(cell.x, cell.y, cell.color, true)
      this.turn = 1 - (cell.color - 1)
    })

    this._ = _

    this.board = TopPage.createInitialBoard()
    this.colorCount = [2, 2]
    this.turn = 0
    this.gameOver = false
    this.winPlayer = -1
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
    }
    return flipped
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

  getCellImage(cell) {
    switch (cell.color) {
    case 1:  return 'assets/black.png'
    case 2:  return 'assets/white.png'
    default:  return 'assets/empty.png'
    }
  }

  onClickCell(cell) {
    if (cell.color != 0)
      return
    const myColor = this.turn + 1
    const n = this.putColor(cell.x, cell.y, myColor, false)
    if (n <= 0)
      return

    cell.color = myColor
    this.movesRef.push(cell)
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
