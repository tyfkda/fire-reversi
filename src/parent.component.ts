import {Component, Input, OnInit} from 'angular2/core';

@Component({
  selector: 'child-component',
  template: `
<div style="margin: 4px; border: solid 1px green;">
    <div>Child: {{name}}</div>
</div>
    `,
})
export class ChildComponent implements OnInit {
  @Input() name: string

  ngOnInit() {
    console.log(`Child[${this.name}]#ngOnInit`)
  }

  ngOnDestroy() {
    console.log(`Child[${this.name}]#ngOnDestroy`)
  }
}

@Component({
  selector: 'parent-component',
  directives: [ChildComponent],
  template: `
<div style="margin: 4px; border: solid 1px blue;">
  <div>Parent</div>

  <child-component name="child1"></child-component>
  <child-component name="child2"></child-component>
</div>
    `,
})
export class ParentComponent implements OnInit {
  ngOnInit() {
    console.log('Parent#ngOnInit')
  }

  ngOnDestroy() {
    console.log('Parent#ngOnDestroy')
  }
}
