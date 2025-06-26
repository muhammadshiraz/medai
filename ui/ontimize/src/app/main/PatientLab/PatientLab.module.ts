import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {PATIENTLAB_MODULE_DECLARATIONS, PatientLabRoutingModule} from  './PatientLab-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    PatientLabRoutingModule
  ],
  declarations: PATIENTLAB_MODULE_DECLARATIONS,
  exports: PATIENTLAB_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientLabModule { }