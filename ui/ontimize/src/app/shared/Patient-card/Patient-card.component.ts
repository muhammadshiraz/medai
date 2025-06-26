import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Patient-card.component.html',
  styleUrls: ['./Patient-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Patient-card]': 'true'
  }
})

export class PatientCardComponent {


}