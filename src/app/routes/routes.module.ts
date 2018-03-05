import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { environment } from '../../environments/environment';

import { routes } from './routes';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
//user
import { VerifyUserComponent } from './verify/verify-user/verify-user.component';
import { VerifyGoodsComponent } from './verify/verify-goods/verify-goods.component';
import { UserFarmerManagerComponent } from './user-manager/farmers/farmers.component';
import { UserExpertManagerComponent } from './user-manager/experts/experts.component';
import { UserDomainComponent } from './user-manager/domain/domain.component';
import { UserDistributorsManagerComponent } from './user-manager/distributors/distributors.component';
import { DistributorsTypeComponent } from './user-manager/distributors/types/types.component';

// pro
import { ProUserLoginComponent } from './pro/user/login/login.component';
import { ProUserRegisterComponent } from './pro/user/register/register.component';
import { ProUserRegisterResultComponent } from './pro/user/register-result/register-result.component';

//device
import { DeviceManagerComponent } from './device-manager/device-manager.component';
import { DeviceCreateComponent } from './device-manager/device-create/device-create.component';
import { DeviceSelectorComponent } from './device-manager/device-selector/device-selector';

//goods
import { GoodsManagerComponent } from './goods-manager/goods-manager.component';

import { AuthResolveService } from './auth.resolve';



@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { useHash: environment.useHash }),
    ],
    declarations: [
        DashboardWorkplaceComponent,
        // user
        VerifyUserComponent,
        VerifyGoodsComponent,
        UserFarmerManagerComponent,
        UserExpertManagerComponent,
        UserDomainComponent,
        UserDistributorsManagerComponent,
        DistributorsTypeComponent,

        // pro
        ProUserLoginComponent,
        ProUserRegisterComponent,
        ProUserRegisterResultComponent,

        // device
        DeviceManagerComponent,
        DeviceCreateComponent,
        DeviceSelectorComponent,

        // goods
        GoodsManagerComponent
    ],
    providers: [
        AuthResolveService
    ],
    entryComponents: [
        DeviceSelectorComponent
    ],
    exports: [
        RouterModule
    ]
})

export class RoutesModule { }
