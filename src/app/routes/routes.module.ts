import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { environment } from '../../environments/environment';

import { routes } from './routes';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
import { VerifyUserComponent } from './verify/verify-user/verify-user.component';
import { UserFarmerManagerComponent } from './user-manager/farmers/farmers.component';
// pro
import { ProUserLoginComponent } from './pro/user/login/login.component';
import { ProUserRegisterComponent } from './pro/user/register/register.component';
import { ProUserRegisterResultComponent } from './pro/user/register-result/register-result.component';

//device
import { DeviceManagerComponent } from './device-manager/device-manager.component';
import { DeviceCreateComponent } from './device-manager/device-create/device-create.component';

import { AuthResolveService } from './auth.resolve';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { useHash: environment.useHash }),
    ],
    declarations: [
        DashboardWorkplaceComponent,
        VerifyUserComponent,
        UserFarmerManagerComponent,
        // pro
        ProUserLoginComponent,
        ProUserRegisterComponent,
        ProUserRegisterResultComponent,

        //device
        DeviceManagerComponent,
        DeviceCreateComponent
    ],
    providers:[
        AuthResolveService
    ],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {}
