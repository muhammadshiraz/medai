import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'Contraindication-new',
  templateUrl: './Contraindication-new.component.html',
  styleUrls: ['./Contraindication-new.component.scss']
})
export class ContraindicationNewComponent {
  @ViewChild("ContraindicationForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}