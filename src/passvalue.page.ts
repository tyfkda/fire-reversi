import {Component, Input} from 'angular2/core'


@Component({
  selector: 'my-element',
  template: `
<div style="border: 1px solid green; margin: 4px; padding: 4px;"
     (click)="onClicked()">
  {{name}}
</div>
    `,
})
export class MyElementComponent {
  @Input() name: string
  @Input() elementClicked: Any

  onClicked() {
    this.elementClicked(this)
  }
}


@Component({
  selector: 'my-list',
  directives: [MyElementComponent],
  template: `
<div style="border: 1px solid blue; padding: 4px;">
    <my-element *ngFor="#elem of list"
                [name]="elem"
                [elementClicked]="elementClicked">
    </my-element>
</div>
    `,
})
export class MyListComponent {
  @Input() list: Array<string>
  @Input() elementClicked: Any
}


@Component({
  directives: [MyListComponent],
  template: `
<h2>PassValue page</h2>

<div>
    <my-list [list]="list" [elementClicked]="onElementClicked"></my-list>
</div>

<ul>
    <li *ngFor="#name of clicked">{{name}} clicked
</ul>
    `,
})
export class PassValuePage {
  list: Array<string> = []
  clicked: Array<string> = []

  ngOnInit() {
    this.list = ['hoge', 'fuga', 'piyo']
    this.onElementClicked = (element) => {
      this.clicked.push(element.name)
    }
  }
}
