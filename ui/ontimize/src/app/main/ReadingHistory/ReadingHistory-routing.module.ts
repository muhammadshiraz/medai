import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadingHistoryHomeComponent } from './home/ReadingHistory-home.component';
import { ReadingHistoryNewComponent } from './new/ReadingHistory-new.component';
import { ReadingHistoryDetailComponent } from './detail/ReadingHistory-detail.component';

const routes: Routes = [
  {path: '', component: ReadingHistoryHomeComponent},
  { path: 'new', component: ReadingHistoryNewComponent },
  { path: ':id', component: ReadingHistoryDetailComponent,
    data: {
      oPermission: {
        permissionId: 'ReadingHistory-detail-permissions'
      }
    }
  }
];

export const READINGHISTORY_MODULE_DECLARATIONS = [
    ReadingHistoryHomeComponent,
    ReadingHistoryNewComponent,
    ReadingHistoryDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingHistoryRoutingModule { }