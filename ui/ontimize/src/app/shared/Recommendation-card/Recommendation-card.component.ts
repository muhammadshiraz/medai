import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'transactions-card',
  templateUrl: './Recommendation-card.component.html',
  styleUrls: ['./Recommendation-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.Recommendation-card]': 'true'
  }
})

export class RecommendationCardComponent {


}