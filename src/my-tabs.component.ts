import {Component, Input} from 'angular2/core';

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
  constructor() {
    this.panes = []
  }

  addPane(pane : MyPaneComponent) {
    this.panes.push(pane)
    pane.selected = this.panes.length == 1
  }

  onPaneClicked(pane : MyPaneComponent) {
    console.log(pane)
    this.panes.forEach(p => p.selected = p == pane)
  }
}

@Component({
  selector: 'my-pane',
  template: `
<div [style.display]="selected ? 'inherit' : 'none'">
  <ng-content></ng-content>
</div>
    `,
})
export class MyPaneComponent {
  @Input() title: string

  constructor(tabs : MyTabsComponent) {
    tabs.addPane(this)
  }
}
