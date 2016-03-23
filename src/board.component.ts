import {Component, Input} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {Board, Cell} from './board'

/// <reference path="../typings/main/definition/lodash/index.d.ts" />
/// <reference path="../typings/main/ambient/firebase/index.d.ts" />

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
  @Input() movesRef: Firebase
  @Input() cellClicked: any

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
    const myColor = this.board.turn + 1
    const n = this.board.putColor(cell.x, cell.y, myColor, false)
    if (n <= 0)
      return

    cell.color = myColor
    this.cellClicked(cell)
  }
}
