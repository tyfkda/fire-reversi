import {Component, OnInit} from 'angular2/core';

@Component({
  selector: 'child-component',
  template: `
<div style="margin: 4px; border: solid 1px green;">
  <div>Child</div>
</div>
    `,
})
export class ChildComponent implements OnInit {
  ngOnInit() {
    console.log('Child#ngOnInit')
  }

  ngOnDestroy() {
    console.log('Child#ngOnDestroy')
  }
}

@Component({
  selector: 'parent-component',
  directives: [ChildComponent],
  template: `
<div style="margin: 4px; border: solid 1px blue;">
  <div>Parent</div>

  <child-component></child-component>
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
