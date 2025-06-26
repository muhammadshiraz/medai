import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientLabHomeComponent } from './home/PatientLab-home.component';
import { PatientLabNewComponent } from './new/PatientLab-new.component';
import { PatientLabDetailComponent } from './detail/PatientLab-detail.component';

const routes: Routes = [
  {path: '', component: PatientLabHomeComponent},
  { path: 'new', component: PatientLabNewComponent },
  { path: ':id', component: PatientLabDetailComponent,
    data: {
      oPermission: {
        permissionId: 'PatientLab-detail-permissions'
      }
    }
  }
];

export const PATIENTLAB_MODULE_DECLARATIONS = [
    PatientLabHomeComponent,
    PatientLabNewComponent,
    PatientLabDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientLabRoutingModule { }