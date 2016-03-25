import {Component, Input, Output, EventEmitter} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {Board, Cell} from './board'

@Component({
  selector: 'board',
  template: `
<div *ngFor="#row of board.board"
  ><span *ngFor="#cell of row"
    ><img [src]="getCellImage(cell)"
          (click)="onClickCell(cell)"
  ></span
></div>
    `,
})
export class BoardComponent {
  @Input() board: Board
  @Output() cellClicked = new EventEmitter()

  getCellImage(cell) {
    switch (cell.stone) {
    case 1:  return 'assets/black.png'
    case 2:  return 'assets/white.png'
    default:  return 'assets/empty.png'
    }
  }

  onClickCell(cell) {
    if (cell.stone != 0)
      return
    const myStone = this.board.turn + 1
    const n = this.board.canPut(cell.x, cell.y, myStone)
    if (n <= 0)
      return

    cell.stone = myStone
    this.cellClicked.emit(cell)
  }
}
