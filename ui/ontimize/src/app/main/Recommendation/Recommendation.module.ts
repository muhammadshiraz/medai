import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {RECOMMENDATION_MODULE_DECLARATIONS, RecommendationRoutingModule} from  './Recommendation-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    RecommendationRoutingModule
  ],
  declarations: RECOMMENDATION_MODULE_DECLARATIONS,
  exports: RECOMMENDATION_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecommendationModule { }