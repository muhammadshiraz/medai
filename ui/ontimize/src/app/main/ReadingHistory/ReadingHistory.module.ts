import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { SharedModule } from '../../shared/shared.module';
import  {READINGHISTORY_MODULE_DECLARATIONS, ReadingHistoryRoutingModule} from  './ReadingHistory-routing.module';

@NgModule({

  imports: [
    SharedModule,
    CommonModule,
    OntimizeWebModule,
    ReadingHistoryRoutingModule
  ],
  declarations: READINGHISTORY_MODULE_DECLARATIONS,
  exports: READINGHISTORY_MODULE_DECLARATIONS,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReadingHistoryModule { }