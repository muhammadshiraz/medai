import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientMedicationHomeComponent } from './home/PatientMedication-home.component';
import { PatientMedicationNewComponent } from './new/PatientMedication-new.component';
import { PatientMedicationDetailComponent } from './detail/PatientMedication-detail.component';

const routes: Routes = [
  {path: '', component: PatientMedicationHomeComponent},
  { path: 'new', component: PatientMedicationNewComponent },
  { path: ':id', component: PatientMedicationDetailComponent,
    data: {
      oPermission: {
        permissionId: 'PatientMedication-detail-permissions'
      }
    }
  }
];

export const PATIENTMEDICATION_MODULE_DECLARATIONS = [
    PatientMedicationHomeComponent,
    PatientMedicationNewComponent,
    PatientMedicationDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientMedicationRoutingModule { }