import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrugHomeComponent } from './home/Drug-home.component';
import { DrugNewComponent } from './new/Drug-new.component';
import { DrugDetailComponent } from './detail/Drug-detail.component';

const routes: Routes = [
  {path: '', component: DrugHomeComponent},
  { path: 'new', component: DrugNewComponent },
  { path: ':id', component: DrugDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Drug-detail-permissions'
      }
    }
  },{
    path: ':drug_id_1/Contraindication', loadChildren: () => import('../Contraindication/Contraindication.module').then(m => m.ContraindicationModule),
    data: {
        oPermission: {
            permissionId: 'Contraindication-detail-permissions'
        }
    }
},{
    path: ':drug_id_2/Contraindication', loadChildren: () => import('../Contraindication/Contraindication.module').then(m => m.ContraindicationModule),
    data: {
        oPermission: {
            permissionId: 'Contraindication-detail-permissions'
        }
    }
},{
    path: ':drug_id/Dosage', loadChildren: () => import('../Dosage/Dosage.module').then(m => m.DosageModule),
    data: {
        oPermission: {
            permissionId: 'Dosage-detail-permissions'
        }
    }
},{
    path: ':drug_id/PatientMedication', loadChildren: () => import('../PatientMedication/PatientMedication.module').then(m => m.PatientMedicationModule),
    data: {
        oPermission: {
            permissionId: 'PatientMedication-detail-permissions'
        }
    }
},{
    path: ':drug_id/Recommendation', loadChildren: () => import('../Recommendation/Recommendation.module').then(m => m.RecommendationModule),
    data: {
        oPermission: {
            permissionId: 'Recommendation-detail-permissions'
        }
    }
}
];

export const DRUG_MODULE_DECLARATIONS = [
    DrugHomeComponent,
    DrugNewComponent,
    DrugDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrugRoutingModule { }