import {Component, Input, Output, EventEmitter} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {Board, Stone} from './board'

@Component({
  selector: 'board',
  template: `
<div *ngFor="#row of board.board, #i=index"
  ><span *ngFor="#cell of row, #j=index"
    ><img [src]="getCellImage(j, i)"
          (click)="onClickCell(j, i)"
  ></span
></div>
    `,
})
export class BoardComponent {
  @Input() board: Board
  @Output() cellClicked = new EventEmitter()

  getCellImage(x: number, y: number) {
    const stone = this.board.board[y][x]
    switch (stone) {
    case Stone.BLACK:  return 'assets/black.png'
    case Stone.WHITE:  return 'assets/white.png'
    case Stone.EMPTY:  return 'assets/empty.png'
    default:  return null
    }
  }

  onClickCell(x: number, y: number) {
    const stone = this.board.board[y][x]
    if (stone != Stone.EMPTY)
      return
    const stone = this.board.turn
    const n = this.board.canPut(x, y, stone)
    if (n <= 0)
      return

    this.cellClicked.emit({x, y, stone})
  }
}
