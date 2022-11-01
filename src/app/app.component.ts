import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('flyInOut', [
    transition(':enter', [
      style({transform: 'translateY(-100%)'}),
      animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
      animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
      ])
  ]
})
export class AppComponent {
  title = 'Drink Aladdin Distributors';
}
