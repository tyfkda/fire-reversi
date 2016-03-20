import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'

function isValidPos(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8
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
    Turn: {{turn==0?'Black':'White'}}
  </div>
</div>

Footer.

    `,
})
export class TopPage {
  movesUrl: string
  movesRef: Firebase
  isLoggedIn: boolean;
  authData: any;
  board: Array<Array<Object>>
  turn: number

  constructor() {
    this.movesUrl = 'https://2nqujjklgij2gg6v.firebaseio.com/movess'
    this.movesRef = new Firebase(this.movesUrl)
    this.movesRef.on('child_added', (snapshot) => {
      const cell = snapshot.val()
      this.putColor(cell.x, cell.y, cell.color, true)
      this.turn = 1 - (cell.color - 1)
    })

    this._ = _

    this.board = TopPage.createInitialBoard()
    this.turn = 0
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
    if (flip && flipped >= 0)
      this.board[y][x].color = color
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

  static createInitialBoard() {
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
