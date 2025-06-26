import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadingHomeComponent } from './home/Reading-home.component';
import { ReadingNewComponent } from './new/Reading-new.component';
import { ReadingDetailComponent } from './detail/Reading-detail.component';

const routes: Routes = [
  {path: '', component: ReadingHomeComponent},
  { path: 'new', component: ReadingNewComponent },
  { path: ':id', component: ReadingDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Reading-detail-permissions'
      }
    }
  }
];

export const READING_MODULE_DECLARATIONS = [
    ReadingHomeComponent,
    ReadingNewComponent,
    ReadingDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingRoutingModule { }