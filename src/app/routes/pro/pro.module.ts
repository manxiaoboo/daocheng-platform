import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { ProRoutingModule } from './pro-routing.module';

import { ProProfileBaseComponent } from './profile/basic/basic.component';
import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';



@NgModule({
    imports: [
        SharedModule, ProRoutingModule
    ],
    declarations: [
        ProProfileBaseComponent,
        ProProfileAdvancedComponent,
    ]
})
export class ProModule { }
