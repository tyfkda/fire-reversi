import {Component} from 'angular2/core'
import {Control} from 'angular2/common'

import Rx from 'rxjs/Rx'

@Component({
  template: `
<h2>Observable page</h2>
<input type="text" [ngFormControl]="term"/>
    `,
})
export class ObservablePage {
  term = new Control()

  constructor() {
    Rx.Observable.of(1, 2, 3)
      .map(x => x + '!!!')
      .subscribe(x => {
        console.log(x)
      })

    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        console.log(value)
      })
  }
}
