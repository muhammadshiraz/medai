import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContraindicationHomeComponent } from './home/Contraindication-home.component';
import { ContraindicationNewComponent } from './new/Contraindication-new.component';
import { ContraindicationDetailComponent } from './detail/Contraindication-detail.component';

const routes: Routes = [
  {path: '', component: ContraindicationHomeComponent},
  { path: 'new', component: ContraindicationNewComponent },
  { path: ':id', component: ContraindicationDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Contraindication-detail-permissions'
      }
    }
  }
];

export const CONTRAINDICATION_MODULE_DECLARATIONS = [
    ContraindicationHomeComponent,
    ContraindicationNewComponent,
    ContraindicationDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContraindicationRoutingModule { }