import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProProfileBaseComponent } from './profile/basic/basic.component';
import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';


const routes: Routes = [
    {
        path: 'profile',
        children: [
            { path: 'basic', component: ProProfileBaseComponent },
            { path: 'advanced', component: ProProfileAdvancedComponent }
        ]
    }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProRoutingModule { }
