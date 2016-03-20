import {Component} from 'angular2/core'
import {FirebaseEventPipe} from './firebasepipe'

@Component({
  pipes: [FirebaseEventPipe],
  template: `
<h2>Top page</h2>
    <div>
      <button [hidden]="isLoggedIn" class="twitter" (click)="authWithTwitter()">Sign in with Twitter</button>
    </div>
    <div class="message-input">
      <input #messagetext (keyup)="doneTyping($event)" placeholder="Enter a message...">
    </div>
    <ul class="messages-list">
      <li *ngFor="#message of firebaseUrl | firebaseevent:'child_added'">
        {{message.text}}
      </li>
    </ul>
    `,
})
export class TopPage {
  firebaseUrl: string
  messagesRef: Firebase
  isLoggedIn: boolean;
  authData: any;

  constructor() {
    this.firebaseUrl = 'https://2nqujjklgij2gg6v.firebaseio.com/messages'
    this.messagesRef = new Firebase(this.firebaseUrl)
    this.messagesRef.onAuth((user) => {
      if (user) {
        this.authData = user
        this.isLoggedIn = true
      }
    })
  }

  authWithTwitter() {
    this.messagesRef.authWithOAuthPopup('twitter', (error) => {
      if (error)
	console.error(error)
    })
  }

  doneTyping($event) {
    if ($event.which === 13) {
      if ($event.target.value != '') {
        this.addMessage($event.target.value)
        $event.target.value = ''
      }
    }
  }

  addMessage(message: string) {
    var newString = message
    this.messagesRef.push({
      text: newString
    })
  }
}
