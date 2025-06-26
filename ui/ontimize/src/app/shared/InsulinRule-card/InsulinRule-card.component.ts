import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './InsulinRule-card.component.html',
  styleUrls: ['./InsulinRule-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.InsulinRule-card]': 'true'
  }
})

export class InsulinRuleCardComponent {


}