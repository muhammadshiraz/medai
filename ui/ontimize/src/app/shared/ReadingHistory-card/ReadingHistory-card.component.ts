import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './ReadingHistory-card.component.html',
  styleUrls: ['./ReadingHistory-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ReadingHistory-card]': 'true'
  }
})

export class ReadingHistoryCardComponent {


}