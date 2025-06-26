import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'ReadingHistory-new',
  templateUrl: './ReadingHistory-new.component.html',
  styleUrls: ['./ReadingHistory-new.component.scss']
})
export class ReadingHistoryNewComponent {
  @ViewChild("ReadingHistoryForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {'breakfast': '0.0', 'lunch': '0.0', 'dinner': '0.0', 'bedtime': '0.0'}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}