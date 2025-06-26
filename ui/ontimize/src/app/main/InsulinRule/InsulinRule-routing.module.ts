import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsulinRuleHomeComponent } from './home/InsulinRule-home.component';
import { InsulinRuleNewComponent } from './new/InsulinRule-new.component';
import { InsulinRuleDetailComponent } from './detail/InsulinRule-detail.component';

const routes: Routes = [
  {path: '', component: InsulinRuleHomeComponent},
  { path: 'new', component: InsulinRuleNewComponent },
  { path: ':id', component: InsulinRuleDetailComponent,
    data: {
      oPermission: {
        permissionId: 'InsulinRule-detail-permissions'
      }
    }
  }
];

export const INSULINRULE_MODULE_DECLARATIONS = [
    InsulinRuleHomeComponent,
    InsulinRuleNewComponent,
    InsulinRuleDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsulinRuleRoutingModule { }