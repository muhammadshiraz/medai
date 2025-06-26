import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './PatientMedication-card.component.html',
  styleUrls: ['./PatientMedication-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.PatientMedication-card]': 'true'
  }
})

export class PatientMedicationCardComponent {


}