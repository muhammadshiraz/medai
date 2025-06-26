import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Contraindication-card.component.html',
  styleUrls: ['./Contraindication-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Contraindication-card]': 'true'
  }
})

export class ContraindicationCardComponent {


}