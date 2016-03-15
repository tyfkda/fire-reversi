import {Component} from 'angular2/core';
import {MyTabsComponent, MyPaneComponent} from './my-tabs.component';

@Component({
  selector: 'my-app',
  directives: [MyTabsComponent, MyPaneComponent],
  templateUrl: 'app.component.html',
})

export class AppComponent { }
