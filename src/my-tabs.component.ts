import {Component, Input} from 'angular2/core';

@Component({
  selector: 'my-tabs',
  templateUrl: 'my-tabs.component.html',
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
  templateUrl: 'my-pane.component.html',
})
export class MyPaneComponent {
  @Input() title: string

  constructor(tabs : MyTabsComponent) {
    tabs.addPane(this)
  }
}
