import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveComponent } from './_pages/active/active.component';
import { ArchiveComponent } from './_pages/archive/archive.component';
import { PageNotFoundComponent } from './_pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'l', pathMatch: 'full' },
  { path: 'h', redirectTo: 'l', pathMatch: 'full' },
  { path: 'l', component: ActiveComponent },
  { path: 'zaloge', component: ArchiveComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
