import {Component} from 'angular2/core';

import {ParentComponent} from './parent.component';

@Component({
  directives: [ParentComponent],
  template: `
<h2>LifeCycle page</h2>

<parent-component></parent-component>
    `,
})
export class LifeCyclePage {
}
