import {Component} from 'angular2/core'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'

import {LifeCyclePage} from './lifecycle.page'
import {PassValuePage} from './passvalue.page'
import {TabPage} from './tab.page'
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
  <a [routerLink]="['TabPage']">Tab</a>
  <a [routerLink]="['LifeCyclePage']">LifeCycle</a>
  <a [routerLink]="['PassValuePage']">PassValue</a>
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
  {
    path: '/tab',
    name: 'TabPage',
    component: TabPage,
  },
  {
    path: '/lifecycle',
    name: 'LifeCyclePage',
    component: LifeCyclePage,
  },
  {
    path: '/passvalue',
    name: 'PassValuePage',
    component: PassValuePage,
  },
  {
    path: '/**',
    redirectTo: ['TopPage'],
  }
])
export class AppComponent {
}
