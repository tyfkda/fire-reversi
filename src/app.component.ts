import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {TopPage} from './top.page';

@Component({
  selector: 'my-app',
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS],
  template: `
<h1>My First Angular 2 App</h1>
    <router-outlet></router-outlet>
    `,
})
@RouteConfig([
  {
    path: '/',
    name: 'Top',
    component: TopPage,
    useAsDefault: true,
  },
])
export class AppComponent {
}
