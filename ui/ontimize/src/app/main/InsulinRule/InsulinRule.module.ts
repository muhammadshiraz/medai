import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {INSULINRULE_MODULE_DECLARATIONS, InsulinRuleRoutingModule} from  './InsulinRule-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    InsulinRuleRoutingModule
  ],
  declarations: INSULINRULE_MODULE_DECLARATIONS,
  exports: INSULINRULE_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InsulinRuleModule { }