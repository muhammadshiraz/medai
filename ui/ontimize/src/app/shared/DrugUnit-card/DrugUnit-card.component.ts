import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './DrugUnit-card.component.html',
  styleUrls: ['./DrugUnit-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.DrugUnit-card]': 'true'
  }
})

export class DrugUnitCardComponent {


}