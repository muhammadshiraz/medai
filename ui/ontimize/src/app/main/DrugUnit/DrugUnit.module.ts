import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {DRUGUNIT_MODULE_DECLARATIONS, DrugUnitRoutingModule} from  './DrugUnit-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    DrugUnitRoutingModule
  ],
  declarations: DRUGUNIT_MODULE_DECLARATIONS,
  exports: DRUGUNIT_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DrugUnitModule { }