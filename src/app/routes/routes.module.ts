import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { environment } from '../../environments/environment';

import { routes } from './routes';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
//user
import { VerifyUserComponent } from './verify/verify-user/verify-user.component';
import { UserFarmerManagerComponent } from './user-manager/farmers/farmers.component';
import { UserExpertManagerComponent } from './user-manager/experts/experts.component';
// pro
import { ProUserLoginComponent } from './pro/user/login/login.component';
import { ProUserRegisterComponent } from './pro/user/register/register.component';
import { ProUserRegisterResultComponent } from './pro/user/register-result/register-result.component';

//device
import { DeviceManagerComponent } from './device-manager/device-manager.component';
import { DeviceCreateComponent } from './device-manager/device-create/device-create.component';
import { DeviceSelectorComponent } from './device-manager/device-selector/device-selector';

import { AuthResolveService } from './auth.resolve';



@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { useHash: environment.useHash }),
    ],
    declarations: [
        DashboardWorkplaceComponent,
        //user
        VerifyUserComponent,
        UserFarmerManagerComponent,
        UserExpertManagerComponent,
        // pro
        ProUserLoginComponent,
        ProUserRegisterComponent,
        ProUserRegisterResultComponent,

        //device
        DeviceManagerComponent,
        DeviceCreateComponent,
        DeviceSelectorComponent
    ],
    providers:[
        AuthResolveService
    ],
    entryComponents:[
        DeviceSelectorComponent
    ],
    exports: [
        RouterModule
    ]
})

export class RoutesModule {}
