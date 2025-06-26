import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DosageHomeComponent } from './home/Dosage-home.component';
import { DosageNewComponent } from './new/Dosage-new.component';
import { DosageDetailComponent } from './detail/Dosage-detail.component';

const routes: Routes = [
  {path: '', component: DosageHomeComponent},
  { path: 'new', component: DosageNewComponent },
  { path: ':id', component: DosageDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Dosage-detail-permissions'
      }
    }
  }
];

export const DOSAGE_MODULE_DECLARATIONS = [
    DosageHomeComponent,
    DosageNewComponent,
    DosageDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DosageRoutingModule { }