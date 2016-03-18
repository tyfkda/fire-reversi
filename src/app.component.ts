import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {TabPage} from './tab.page';
import {TopPage} from './top.page';

@Component({
  selector: 'my-app',
  directives: [ROUTER_DIRECTIVES],
  providers: [ROUTER_PROVIDERS],
  template: `
<nav>
  <a [routerLink]="['TopPage']">Top</a>
  <a [routerLink]="['TabPage']">Tab</a>
</nav>

<h1>My First Angular 2 App</h1>
    <router-outlet></router-outlet>
    `,
})
@RouteConfig([
  {
    path: '/',
    name: 'TopPage',
    component: TopPage,
    useAsDefault: true,
  },
  {
    path: '/tab',
    name: 'TabPage',
    component: TabPage,
  },
])
export class AppComponent {
}
