// Build:
//   $(npm bin)/tsc -t ES5 server/server.ts
// Run
//   $ node server/server.js

import * as Firebase from 'firebase'
import * as _ from 'lodash'

import Config from './,config'
import {Board, Stone} from './board'

/// <reference path="../typings/main/ambient/firebase/index.d.ts" />

enum Action {
  NONE,
  PUT,
}

class Server {
  private rootRef: Firebase
  private actionRef: Firebase
  private movesRef: Firebase
  private board: Board

  run(gameMasterInfo) {
    this.rootRef = new Firebase('https://2nqujjklgij2gg6v.firebaseio.com/')
    this.rootRef.authWithPassword(
      gameMasterInfo,
      (error, authData) => {
        if (error) {
          console.error('Login failed!', error)
          return
        }
        console.log('Authenticated successfully')

        this.resetGame()
        this.startWatching()
      })
  }

  finishGame() {
    console.log('Finish game')
    this.resetGame()
  }

  resetGame() {
    console.log('Reset game')
    this.board = new Board()
    this.board.startGame(0)

    this.rootRef.child('action').remove()
    this.rootRef.child('moves').remove()
  }

  startWatching() {
    this.movesRef = this.rootRef.child('moves')

    this.actionRef = this.rootRef.child('action')
    this.actionRef.on('value', onlineSnap => {
      const val = onlineSnap.val()
      if (val == null) {
        this.resetGame()
        return
      }
      switch (val.action) {
      case Action.PUT:
        console.log(val)
        const stone: Stone = val.playerId + 1
        if (this.board.turn == stone &&
            this.board.canPut(val.x, val.y, stone)) {
          this.movesRef.push({x: val.x, y: val.y, stone})
          this.board.putStone(val.x, val.y, stone)
          if (this.board.gameOver) {
            this.finishGame()
          }
        }
        break
      }
    })
    console.log('Start watching...')
  }
}

function main() {
  const server = new Server()
  server.run(Config.gameMasterInfo)
}

main()
