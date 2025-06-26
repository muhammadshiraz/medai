import { Component, Injector, ViewChild } from '@angular/core';
import { NavigationService, OFormComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'DrugUnit-new',
  templateUrl: './DrugUnit-new.component.html',
  styleUrls: ['./DrugUnit-new.component.scss']
})
export class DrugUnitNewComponent {
  @ViewChild("DrugUnitForm") form: OFormComponent;
  onInsertMode() {
    const default_values = {}
    this.form.setFieldValues(default_values);
  }
  constructor(protected injector: Injector) {
    this.injector.get(NavigationService).initialize();
  }
}