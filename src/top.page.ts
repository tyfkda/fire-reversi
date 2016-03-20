import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'

@Component({
  pipes: [FirebaseEventPipe],
  template: `
<h2>Top page</h2>
    <div *ngFor="#row of board"
      ><span *ngFor="#cell of row"
        ><img [src]="getCellImage(cell)"
              (click)="onClickCell(cell)"
      ></span
    ></div>
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
      this.putColor(cell.x, cell.y, cell.color)
      this.turn = 1 - (cell.color - 1)
    })

    this._ = _

    this.board = TopPage.createInitialBoard()
    this.turn = 0
  }

  putColor(x, y, color) {
    this.board[y][x].color = color
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

    cell.color = this.turn + 1
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
