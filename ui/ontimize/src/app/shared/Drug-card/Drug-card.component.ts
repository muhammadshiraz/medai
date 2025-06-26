import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Drug-card.component.html',
  styleUrls: ['./Drug-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Drug-card]': 'true'
  }
})

export class DrugCardComponent {


}