import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {BoardComponent} from './board.component'
import {Board, Stone} from './board'

/// <reference path="../typings/main/ambient/firebase/index.d.ts" />

enum PlayingState {
  WATCHING,
  JOINING,
  PLAYING,
}

export class Player {
  online = false

  constructor(private playerRef: Firebase) {
  }

  setOnline(val) {
    this.online = !!val
  }
}

export class GameController {
  players: Array<Player>
  playingState: PlayingState

  constructor(private reversiRef: Firebase) {
    this.players = _.range(2).map(i => new Player(
      this.reversiRef.child(`player${i}`)))
    this.playingState = PlayingState.WATCHING
    this.waitToJoin()
  }

  waitToJoin() {
    for (let i = 0; i < 2; ++i) {
      this.reversiRef.child(`player${i}/online`).on('value', onlineSnap => {
        const val = onlineSnap.val()
        console.log(`player${i}/online = ${val}`)
        this.players[i].setOnline(val)
        if (val === null && this.playingState == PlayingState.WATCHING) {
          this.tryToJoin(i)
        }
      })
    }
  }

  /**
   * Try to join the game as the specified playerNum.
   */
  tryToJoin(playerNum) {
    console.log(`tryToJoin: as ${playerNum}`)
    this.playingState = PlayingState.JOINING
    this.reversiRef.child(`player${playerNum}/online`).transaction(onlineVal => {
      if (onlineVal === null) {
        return true  // Try to set online to true.
      } else {
        return  // Somebody must have beat us. Abort the transaction.
      }
    }, (error, committed) => {
console.log(`tryToJoin, result: error=${error}, committed=${committed}`)
      if (committed) {  // We got in!
        this.playingState = PlayingState.PLAYING
        this.startPlaying(playerNum)
      } else {
        this.playingState = PlayingState.WATCHING
      }
    })
  }

  /**
   * Once we've joined, enable controlling our player.
   */
  startPlaying(playerNum) {
    console.log(`startPlaying ${playerNum}`)
  }
}

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

<input type="button"
       (click)="reset()"
       value="Reset">
    `,
})
export class TopPage {
  reversiUrl: string
  reversiRef: Firebase
  board: Board
  gameController: GameController

  constructor() {
    this.reversiUrl = 'https://2nqujjklgij2gg6v.firebaseio.com/'
    this.reversiRef = new Firebase(this.reversiUrl)
    /*
    this.movesRef.on('child_added', (snapshot) => {
      const cell = snapshot.val()
      const n = this.board.putStone(cell.x, cell.y, cell.stone)
    })
    */

    this.gameController = new GameController(this.reversiRef)

    this.board = new Board()
  }

  cellClicked(cell) {
    //this.movesRef.push(cell)
  }

  reset() {
    //this.board.reset()
    //this.movesRef.remove()
  }
}
