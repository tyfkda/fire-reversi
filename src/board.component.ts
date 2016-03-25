import {Component, Input, Output, EventEmitter} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {Board, Cell, Stone} from './board'

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

  getCellImage(cell: Cell) {
    switch (cell.stone) {
    case Stone.BLACK:  return 'assets/black.png'
    case Stone.WHITE:  return 'assets/white.png'
    case Stone.EMPTY:  return 'assets/empty.png'
    default:  return null
    }
  }

  onClickCell(cell: Cell) {
    if (cell.stone != Stone.EMPTY)
      return
    const stone = this.board.turn
    const n = this.board.canPut(cell.x, cell.y, stone)
    if (n <= 0)
      return

    cell.stone = stone
    this.cellClicked.emit(cell)
  }
}
