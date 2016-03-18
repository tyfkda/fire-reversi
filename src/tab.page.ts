import {Component} from 'angular2/core';
import {ContentChildren, QueryList} from 'angular2/core';

@Component({
  selector: 'my-pane',
  inputs: ['title'],
  template: `
<div [hidden]="!selected">
  <ng-content></ng-content>
</div>
    `,
})
export class MyPaneComponent {
  selected = false
}

@Component({
  selector: 'my-tabs',
  template: `
<div>
  <ul>
    <li *ngFor="#pane of panes"
        [class.active]="pane.selected"
        (click)="selectPane(pane)">
      {{pane.title}}
    </li>
  </ul>
  <ng-content></ng-content>
</div>
    `,
  styles:[`
          .active {
            background-color: red;
          }
          `],
})
export class MyTabsComponent {
  @ContentChildren(MyPaneComponent) panes: QueryList<MyPaneComponent>

  ngAfterContentInit() {
    if (this.panes.length > 0)
      this.selectPane(this.panes.first)
  }

  selectPane(pane: MyPaneComponent) {
    this.panes.toArray().forEach(p => p.selected = p == pane)
  }
}

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
