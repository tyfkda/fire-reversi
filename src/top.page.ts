import {Component} from 'angular2/core'
import {ChangeDetectorRef, Inject} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'
import _ from 'lodash'

import {BoardComponent} from './board.component'
import {Board, Stone} from './board'

/// <reference path="../typings/main/ambient/firebase/index.d.ts" />

enum PlayerState {
  WATCHING,
  JOINING,
  WAITING_OTHERS,
  PLAYING,
}

enum Action {
  NONE,
  PUT,
}

export class GameController {
  public playerId: number
  public playerState: PlayerState
  public board: Board

  private onlinePlayersRef: Firebase
  private onlinePlayers: number

  private actionRef: Firebase
  private actionRefHandler: any
  private movesRef: Firebase
  private movesRefHandler: any

  constructor(private rootRef: Firebase, private cdRef: ChangeDetectorRef) {
    this.playerId = -1
    this.playerState = PlayerState.WATCHING
    this.onlinePlayers = -1
    this.board = new Board()

    this.watchOnlinePlayers()
  }

  get isPlaying() {
    return this.playerState == PlayerState.PLAYING
  }

  get isWaiting() {
    return this.playerState == PlayerState.WAITING_OTHERS
  }

  get isMyTurn() {
    return this.board.turn - 1 == this.playerId
  }

  reset() {
    this.board.clear()
    this.finishGame()
  }

  finishGame() {
    if (this.actionRef && this.actionRefHandler) {
      this.actionRef.off('value', this.actionRefHandler)
      this.actionRef = null
      this.actionRefHandler = null
    }
    if (this.movesRef && this.movesRefHandler) {
      this.movesRef.off('child_added', this.movesRefHandler)
      this.movesRef = null
      this.movesRefHandler = null
    }
    this.onlinePlayersRef.remove()
    this.playerState = PlayerState.WATCHING
  }

  isEnableLogin() {
    return (this.onlinePlayers >= 0 && this.onlinePlayers < 3) &&
      this.playerState == PlayerState.WATCHING
  }

  login() {
    if (!this.isEnableLogin())
      return

    this.playerId = -1
    this.playerState = PlayerState.JOINING
    this.board.clear()
    const f = (i) => {
      this.tryToJoin(i)
        .then(() => {
          this.playerId = i
          this.playerState = PlayerState.WAITING_OTHERS
          this.tryStartGame()
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
    this.onlinePlayersRef = this.rootRef.child('onlinePlayers')
    this.onlinePlayersRef.on('value', onlineSnap => {
      let val = onlineSnap.val() || 0
console.log(`onlinePlayers=${val}, playerState=${this.playerState}, playerId=${this.playerId}`)
      this.onlinePlayers = val

      this.tryStartGame()
      this.cdRef.detectChanges()
    })
  }

  /**
   * Try to join the game as the specified playerNum.
   */
  tryToJoin(playerNum) {
    return new Promise((resolve, reject) => {
//console.log(`tryToJoin: as ${playerNum}`)
      this.rootRef.child('onlinePlayers').transaction(onlineVal => {
        const val = onlineVal || 0
        const bit = 1 << playerNum
        if ((val & (1 << playerNum)) == 0) {
          return (val | bit)  // Try to set online to true.
        } else {
          return  // Somebody must have beat us. Abort the transaction.
        }
      }, (error, committed) => {
//console.log(`tryToJoin, result: error=${error}, committed=${committed}`)
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
  tryStartGame() {
    if (this.onlinePlayers != 3 || this.playerId < 0)
      return
    this.startGame()
  }
  startGame() {
    this.playerState = PlayerState.PLAYING
    this.board.startGame(this.playerId)

    this.watchAction()
    this.watchMoves()
  }

  watchAction() {
    this.actionRef = this.rootRef.child('action')
  }

  watchMoves() {
    this.movesRef = this.rootRef.child('moves')
    this.movesRefHandler = this.movesRef.on('child_added', (snapshot) => {
      const cell = snapshot.val()
console.log(cell)
      this.board.putStone(cell.x, cell.y, cell.stone)
      if (this.board.gameOver) {
        this.finishGame()
      }
      this.cdRef.detectChanges()
    })
  }

  cellClicked(x: number, y: number) {
    if (!this.board.isTurn)
      return
    this.actionRef.set({action: Action.PUT, playerId: this.playerId, x, y})
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
    <div>
      <input *ngIf="isEnableLogin()"
             type="button"
             (click)="login()"
             value="Login">
    </div>
    <div *ngIf="gameController.isWaiting">Waiting other player...</div>

    <div *ngIf="board.isPlaying||board.gameOver">
      <div [ngSwitch]="gameController.playerId">
        <template [ngSwitchWhen]="0">You: BLACK</template>
        <template [ngSwitchWhen]="1">You: WHITE</template>
      </div>
      <div>Black:#{{board.stoneCount[1]}}, White:{{board.stoneCount[2]}}</div>
    </div>
    <div *ngIf="board.isPlaying">
      <div [ngSwitch]="gameController.isMyTurn">
        <template [ngSwitchWhen]="true">Your turn</template>
        <template [ngSwitchWhen]="false">Opponent thinking...</template>
      </div>
    </div>
    <div *ngIf="board.gameOver">
      <div [ngSwitch]="board.winPlayer">
        <template [ngSwitchWhen]="0">draw</template>
        <template [ngSwitchWhen]="gameController.playerId+1">You win!</template>
        <template ngSwitchDefault>You lose...</template>
      </div>
    </div>
  </div>
</div>

<input type="button"
       (click)="reset()"
       value="Reset">
    `,
})
export class TopPage {
  reversiUrl: string
  rootRef: Firebase
  gameController: GameController

  constructor(@Inject(ChangeDetectorRef) cdRef: ChangeDetectorRef) {
    this.reversiUrl = 'https://2nqujjklgij2gg6v.firebaseio.com/'
    this.rootRef = new Firebase(this.reversiUrl)

    this.gameController = new GameController(this.rootRef, cdRef)
  }

  get board() {
    return this.gameController.board
  }

  isEnableLogin() {
    return this.gameController.isEnableLogin()
  }

  login() {
    this.gameController.login()
  }

  cellClicked(cell) {
    this.gameController.cellClicked(cell.x, cell.y)
  }

  reset() {
    this.gameController.reset()
  }
}
