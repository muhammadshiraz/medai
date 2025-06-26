import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Dosage-card.component.html',
  styleUrls: ['./Dosage-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Dosage-card]': 'true'
  }
})

export class DosageCardComponent {


}