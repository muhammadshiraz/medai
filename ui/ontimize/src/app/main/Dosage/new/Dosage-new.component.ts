import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'Dosage-new',
  templateUrl: './Dosage-new.component.html',
  styleUrls: ['./Dosage-new.component.scss']
})
export class DosageNewComponent {
  @ViewChild("DosageForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {'min_age': '18', 'max_age': '105'}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}