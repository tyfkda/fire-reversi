import {Component, Injectable} from 'angular2/core'
import {Control} from 'angular2/common'
import {JSONP_PROVIDERS} from 'angular2/http'
import {URLSearchParams, Jsonp} from 'angular2/http';

import Rx from 'rxjs/Rx'
Rx  // これをつけないとエラーが出る？  ORIGINAL EXCEPTION: TypeError: terms.debounceTime is not a function
// 個別にimportしてもよいが、メンドイ
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/distinctUntilChanged';
//import 'rxjs/add/operator/switchMap';

@Injectable()
export class WikipediaService {
  constructor(private jsonp: Jsonp) {}

  search(terms: Observable<string>, debounceDuration = 400) {
    return terms.debounceTime(debounceDuration)
      .distinctUntilChanged()
      .switchMap(term => this.rawSearch(term))
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
    this.items = wikipediaService.search(this.term.valueChanges)
  }
}
