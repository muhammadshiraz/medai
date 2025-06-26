import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './PatientLab-card.component.html',
  styleUrls: ['./PatientLab-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.PatientLab-card]': 'true'
  }
})

export class PatientLabCardComponent {


}