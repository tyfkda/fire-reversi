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
      this.board[cell.y][cell.x].color = cell.color
      this.turn = 1 - (cell.color - 1)
    })

    this._ = _

    this.board = _.range(8).map(y => {
      return _.range(8).map(x => {
        return {
          x,
          y,
          color: 0,
        }
      })
    })
    this.turn = 0
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
}
