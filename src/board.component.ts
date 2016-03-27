import {Component, Input, Output, EventEmitter} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {Board, Stone} from './board'

@Component({
  selector: 'board',
  template: `
<style>
  .cell.canPut {
    cursor: pointer;
  }
</style>
<div *ngFor="#row of board.board, #i=index"
  ><span *ngFor="#cell of row, #j=index"
    ><img class="cell"
          [src]="getCellImage(j, i)"
          [class.canPut]="canPut(j, i)"
          (click)="onClickCell(j, i)"
          (mousedown)="false"
  ></span
></div>
    `,
})
export class BoardComponent {
  @Input() board: Board
  @Output() cellClicked = new EventEmitter()

  getCellImage(x: number, y: number) {
    const cell = this.board.board[y][x]
    switch (cell.stone) {
    case Stone.BLACK:  return 'assets/black.png'
    case Stone.WHITE:  return 'assets/white.png'
    case Stone.EMPTY:
      if (!cell.canPut)
        return 'assets/empty.png'
      return this.board.turn == Stone.BLACK ? 'assets/canput_black.png' :  'assets/canput_white.png'
    default:  return null
    }
  }

  canPut(x: number, y: number) {
    return this.board.board[y][x].canPut
  }

  onClickCell(x: number, y: number) {
    if (this.board.board[y][x].stone != Stone.EMPTY)
      return
    const stone = this.board.turn
    const n = this.board.canPut(x, y, stone)
    if (n <= 0)
      return

    this.cellClicked.emit({x, y, stone})
  }
}
