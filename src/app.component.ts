import {Component} from 'angular2/core';
import {MyTabsComponent, MyPaneComponent} from './my-tabs.component';

@Component({
  selector: 'my-app',
  directives: [MyTabsComponent, MyPaneComponent],
  template: `
<h1>My First Angular 2 App</h1>

<my-tabs>
  <my-pane title="Hello">
    <h4>Hello</h4>
    <p>Lorem ipsum dolor sit amet</p>
  </my-pane>
  <my-pane title="World">
    <h4>World</h4>
    <em>Mauris elementum elementum enim at suscipit.</em>
    <p><a href ng-click="i = i + 1">counter: {{i || 0}}</a></p>
  </my-pane>
</my-tabs>
    `,
})

export class AppComponent { }
