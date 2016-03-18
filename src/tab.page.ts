import {Component} from 'angular2/core';

import {MyTabsComponent, MyPaneComponent} from './my-tabs.component';

@Component({
  directives: [MyTabsComponent, MyPaneComponent],
  template: `
<h2>Tab page</h2>

<my-tabs>
  <my-pane title="Hello">
    <h4>Hello</h4>
    <p>Lorem ipsum dolor sit amet</p>
  </my-pane>
  <my-pane title="World">
    <h4>World</h4>
    <em>Mauris elementum elementum enim at suscipit.</em>
    <p><span (click)="count = count + 1">counter: {{count}}</span></p>
  </my-pane>
</my-tabs>
    `,
})
export class TabPage {
  count = 0
}
