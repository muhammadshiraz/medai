import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Reading-card.component.html',
  styleUrls: ['./Reading-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Reading-card]': 'true'
  }
})

export class ReadingCardComponent {


}