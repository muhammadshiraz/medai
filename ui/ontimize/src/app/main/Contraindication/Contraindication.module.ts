import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {CONTRAINDICATION_MODULE_DECLARATIONS, ContraindicationRoutingModule} from  './Contraindication-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    ContraindicationRoutingModule
  ],
  declarations: CONTRAINDICATION_MODULE_DECLARATIONS,
  exports: CONTRAINDICATION_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContraindicationModule { }