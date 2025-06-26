import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'PatientMedication-new',
  templateUrl: './PatientMedication-new.component.html',
  styleUrls: ['./PatientMedication-new.component.scss']
})
export class PatientMedicationNewComponent {
  @ViewChild("PatientMedicationForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}