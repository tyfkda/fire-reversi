import {Component} from 'angular2/core'
import Rx from 'rxjs/Rx'

@Component({
  template: `
<h2>Rxjs page</h2>
    `,
})
export class RxjsPage {
  constructor() {
    Rx.Observable.of(1, 2, 3)
      .map(x => x + '!!!')
      .subscribe(x => {
        console.log(x)
      })
  }
}
