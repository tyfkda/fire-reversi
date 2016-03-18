import {Component, Input} from 'angular2/core'


@Component({
  selector: 'my-element',
  template: `
<div style="border: 1px solid green; margin: 4px; padding: 4px;"
     (click)="onElementClicked()">
  {{name}}
</div>
    `,
})
export class MyElementComponent {
  @Input() name: string
  @Input() elementClicked: Any

  onElementClicked() {
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

  constructor() {
  }

  ngOnInit() {
    console.log(this.list)
  }
}


@Component({
  directives: [MyListComponent],
  template: `
<h2>PassValue page</h2>

<div>
    <my-list [list]="list" [elementClicked]="onElementClicked"></my-list>
</div>
    `,
})
export class PassValuePage {
  list: Array<string>

  constructor() {
    this.list = ['hoge', 'fuga', 'piyo']
  }

  onElementClicked(element) {
    console.log(element)
  }
}
