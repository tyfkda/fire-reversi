import {Component} from 'angular2/core'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'

import {TopPage} from './top.page'

@Component({
  selector: 'my-app',
  directives: [ROUTER_DIRECTIVES],
  template: `
<style>
nav a.router-link-active {
  background-color: red;
}
</style>
<nav>
  <a [routerLink]="['TopPage']">Top</a>
</nav>
<hr>
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
])
export class App {
}
