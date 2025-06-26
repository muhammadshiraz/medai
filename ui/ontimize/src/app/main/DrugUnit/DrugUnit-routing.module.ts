import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrugUnitHomeComponent } from './home/DrugUnit-home.component';
import { DrugUnitNewComponent } from './new/DrugUnit-new.component';
import { DrugUnitDetailComponent } from './detail/DrugUnit-detail.component';

const routes: Routes = [
  {path: '', component: DrugUnitHomeComponent},
  { path: 'new', component: DrugUnitNewComponent },
  { path: ':unit_name', component: DrugUnitDetailComponent,
    data: {
      oPermission: {
        permissionId: 'DrugUnit-detail-permissions'
      }
    }
  },{
    path: ':dosage_unit/Dosage', loadChildren: () => import('../Dosage/Dosage.module').then(m => m.DosageModule),
    data: {
        oPermission: {
            permissionId: 'Dosage-detail-permissions'
        }
    }
},{
    path: ':dosage_unit/Drug', loadChildren: () => import('../Drug/Drug.module').then(m => m.DrugModule),
    data: {
        oPermission: {
            permissionId: 'Drug-detail-permissions'
        }
    }
},{
    path: ':dosage_unit/PatientMedication', loadChildren: () => import('../PatientMedication/PatientMedication.module').then(m => m.PatientMedicationModule),
    data: {
        oPermission: {
            permissionId: 'PatientMedication-detail-permissions'
        }
    }
},{
    path: ':dosage_unit/Recommendation', loadChildren: () => import('../Recommendation/Recommendation.module').then(m => m.RecommendationModule),
    data: {
        oPermission: {
            permissionId: 'Recommendation-detail-permissions'
        }
    }
}
];

export const DRUGUNIT_MODULE_DECLARATIONS = [
    DrugUnitHomeComponent,
    DrugUnitNewComponent,
    DrugUnitDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrugUnitRoutingModule { }