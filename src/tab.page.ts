import {Component} from 'angular2/core';

@Component({
  selector: 'my-tabs',
  template: `
<div>
  <ul>
    <li *ngFor="#pane of panes"
        [class.active]="pane.selected"
        (click)="onPaneClicked(pane)">
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
  panes: Array<MyPaneComponent> = []

  addPane(pane : MyPaneComponent) {
    this.panes.push(pane)
    pane.selected = this.panes.length == 1
  }

  onPaneClicked(pane : MyPaneComponent) {
    this.panes.forEach(p => p.selected = p == pane)
  }
}

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

  constructor(tabs : MyTabsComponent) {
    tabs.addPane(this)
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
