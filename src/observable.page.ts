import {Component, Injectable} from 'angular2/core'
import {Control} from 'angular2/common'
import {JSONP_PROVIDERS} from 'angular2/http'
import {URLSearchParams, Jsonp} from 'angular2/http';

import Rx from 'rxjs/Rx'

@Injectable()
export class WikipediaService {
  constructor(private jsonp: Jsonp) {}

  search(terms: Observable<string>, debounceDuration = 400) {
    return terms.debounceTime(debounceDuration)
      .distinctUntilChanged()
      .switchMap(term => this.rawSearch(term)))
  }

  rawSearch(term: string) {
    var search = new URLSearchParams()
    search.set('action', 'opensearch');
    search.set('search', term);
    search.set('format', 'json');
    return this.jsonp
      .get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search })
      .map((response) => response.json()[1])
  }
}

@Component({
  providers: [JSONP_PROVIDERS, WikipediaService],
  template: `
<h2>Observable page</h2>
<input type="text" [ngFormControl]="term"/>

<ul>
  <li *ngFor="#item of items | async">{{item}}</li>
</ul>
    `,
})
export class ObservablePage {
  term = new Control()
  items: Rx.Observable<Array<string>>

  constructor(private wikipediaService: WikipediaService) {
    console.log(wikipediaService)

    Rx.Observable.of(1, 2, 3)
      .map(x => x + '!!!')
      .subscribe(x => {
        console.log(x)
      })

    this.items = wikipediaService.search(this.term.valueChanges)
  }
}
