import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendationHomeComponent } from './home/Recommendation-home.component';
import { RecommendationNewComponent } from './new/Recommendation-new.component';
import { RecommendationDetailComponent } from './detail/Recommendation-detail.component';

const routes: Routes = [
  {path: '', component: RecommendationHomeComponent},
  { path: 'new', component: RecommendationNewComponent },
  { path: ':id', component: RecommendationDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Recommendation-detail-permissions'
      }
    }
  }
];

export const RECOMMENDATION_MODULE_DECLARATIONS = [
    RecommendationHomeComponent,
    RecommendationNewComponent,
    RecommendationDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecommendationRoutingModule { }