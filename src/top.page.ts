import {Component} from 'angular2/core'

@Component({
  template: `
<h2>Top page</h2>
    <div>
      <button [hidden]="isLoggedIn" class="twitter" (click)="authWithTwitter()">Sign in with Twitter</button>
    </div>
    <div class="message-input">
      <input [hidden]="!isLoggedIn" #messagetext (keyup)="doneTyping($event)" placeholder="Enter a message...">
    </div>
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
      console.log(user)
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
}
