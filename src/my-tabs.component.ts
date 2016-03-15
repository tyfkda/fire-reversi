import {Component} from 'angular2/core';

@Component({
  selector: 'my-tabs',
  templateUrl: 'my-tabs.component.html',
})
export class MyTabsComponent {
  constructor() {
    this.panes = []
  }

  addPane(pane : MyPaneComponent) {
    this.panes.push(pane)
  }
}

@Component({
  selector: 'my-pane',
  templateUrl: 'my-pane.component.html',
})
export class MyPaneComponent {
  constructor(tabs : MyTabsComponent) {
    tabs.addPane(this)
  }
}
