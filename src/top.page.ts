import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {BoardComponent} from './board.component'
import {Board, Stone} from './board'

/// <reference path="../typings/main/ambient/firebase/index.d.ts" />

enum PlayerState {
  WATCHING,
  JOINING,
  PLAYING,
}

export class GameController {
  public playerId: number
  public playerState: PlayerState
  public board: Board

  private onlinePlayersRef: Firebase
  private onlinePlayers: number

  constructor(private reversiRef: Firebase) {
    this.playerId = -1
    this.playerState = PlayerState.WATCHING
    this.onlinePlayers = -1
    this.board = new Board()

    this.watchOnlinePlayers()
  }

  isEnableLogin() {
    return (this.onlinePlayers >= 0 && this.onlinePlayers < 3) &&
      this.playerState == PlayerState.WATCHING
  }

  login() {
    if (!this.isEnableLogin())
      return

    this.playerState = PlayerState.JOINING
    const f = (i) => {
      this.tryToJoin(i)
        .then(() => {
          this.startPlaying(i)
        })
        .catch(() => {
          if (++i < 2)
            return f(i)
          console.error('Login failed')
          this.playerState = PlayerState.WATCHING
        })
    }
    f(0)
  }

  watchOnlinePlayers() {
    this.onlinePlayersRef = this.reversiRef.child('onlinePlayers')
    this.onlinePlayersRef.on('value', onlineSnap => {
      let val = onlineSnap.val() || 0
      console.log(`onlinePlayers=${val}, playerState=${this.playerState}`)
      this.onlinePlayers = val
    })
  }

  /**
   * Try to join the game as the specified playerNum.
   */
  tryToJoin(playerNum) {
    return new Promise((resolve, reject) => {
console.log(`tryToJoin: as ${playerNum}`)
      this.reversiRef.child('onlinePlayers').transaction(onlineVal => {
        const val = onlineVal || 0
        const bit = 1 << playerNum
        if ((val & (1 << playerNum)) == 0) {
          return (val | bit)  // Try to set online to true.
        } else {
          return  // Somebody must have beat us. Abort the transaction.
        }
      }, (error, committed) => {
console.log(`tryToJoin, result: error=${error}, committed=${committed}`)
        if (committed) {  // We got in!
          resolve()
        } else {
          reject()
        }
      })
    })
  }

  /**
   * Once we've joined, enable controlling our player.
   */
  startPlaying(playerId) {
    console.log(`startPlaying ${playerId}`)
    this.playerId = playerId
    this.playerState = PlayerState.PLAYING
    this.board.startGame()
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
    <div>PlayerId: {{gameController.playerId}}</div>
    <div>OnlinePlayers: {{gameController.onlinePlayers}}
      <input [hidden]="!isEnableLogin()" type="button"
             (click)="login()"
             value="Login">
    </div>

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
  }

  get board() {
    return this.gameController.board
  }

  isEnableLogin() {
    return this.gameController.isEnableLogin()
  }

  login() {
    console.log('login clicked')
    this.gameController.login()
  }

  cellClicked(cell) {
    //this.movesRef.push(cell)
  }

  reset() {
    //this.board.reset()
    //this.movesRef.remove()
  }
}
