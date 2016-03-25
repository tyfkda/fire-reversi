import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {BoardComponent} from './board.component'
import {Board, Stone} from './board'

/// <reference path="../typings/main/ambient/firebase/index.d.ts" />

@Component({
  directives: [BoardComponent],
  template: `
<h2>Reversi</h2>

<div class="clearfix">
  <div class="pull-left">
    <board [board]="board"
           (cellClicked)="cellClicked($event)"></board>
  </div>
  <div class="pull-left" style="margin-left: 8px;">
    <div [hidden]="board.gameOver">Turn: {{board.turn==1?'Black':'White'}}</div>
    <div [hidden]="!board.gameOver">
      <div [hidden]="board.winPlayer!=1">BLACK win!</div>
      <div [hidden]="board.winPlayer!=2">WHITE win!</div>
      <div [hidden]="board.winPlayer!=0">draw</div>
    </div>
    <br>
    <div>Black:#{{board.stoneCount[1]}}, White:{{board.stoneCount[2]}}</div>
    <br>
  </div>
</div>

Footer.

    `,
})
export class TopPage {
  movesUrl: string
  movesRef: Firebase
  board: Board

  constructor() {
    this.movesUrl = 'https://2nqujjklgij2gg6v.firebaseio.com/movess'
    this.movesRef = new Firebase(this.movesUrl)
    this.movesRef.on('child_added', (snapshot) => {
      const cell = snapshot.val()
      const n = this.board.putStone(cell.x, cell.y, cell.stone)
    })

    this.board = new Board()
  }

  cellClicked(cell) {
    this.movesRef.push(cell)
  }
}
