import { LayoutComponent } from '../layout/layout.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// verify
import { VerifyUserComponent } from './verify/verify-user/verify-user.component';
import { VerifyGoodsComponent } from './verify/verify-goods/verify-goods.component';
// usermanager
import { UserFarmerManagerComponent } from './user-manager/farmers/farmers.component';
import { UserExpertManagerComponent } from './user-manager/experts/experts.component';
import { UserDomainComponent } from './user-manager/domain/domain.component';
import { UserDistributorsManagerComponent } from './user-manager/distributors/distributors.component';
import { DistributorsTypeComponent } from './user-manager/distributors/types/types.component';
import { UserManufacturersManagerComponent } from './user-manager/manufacturers/manufacturers.component';


// pro
import { ProUserLayoutComponent } from '../layout/pro/user/user.component';
import { ProUserLoginComponent } from './pro/user/login/login.component';
import { ProUserRegisterComponent } from './pro/user/register/register.component';
import { ProUserRegisterResultComponent } from './pro/user/register-result/register-result.component';
// device
import { DeviceManagerComponent } from './device-manager/device-manager.component';
import { DeviceCreateComponent } from './device-manager/device-create/device-create.component';

// goods
import { GoodsManagerComponent } from './goods-manager/goods-manager.component';
import { GoodsAdComponent } from './goods-manager/goods-ad/goods-ad.component';

// order
import { OrderManagerComponent } from './order-manager/order-manager.component';

// resolve
import { AuthResolveService } from './auth.resolve';


export const routes = [
    {
        path: '',
        component: LayoutComponent,
        resolve: [AuthResolveService],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardWorkplaceComponent, data: { translate: '工作台' } },
            { path: 'verify-user', component: VerifyUserComponent, data: { translate: '用户审核' } },
            { path: 'verify-goods', component: VerifyGoodsComponent, data: { translate: '商品审核' } },
            { path: 'user-manager-farmer', component: UserFarmerManagerComponent, data: { translate: '农户管理' } },
            { path: 'user-manager-expert', component: UserExpertManagerComponent, data: { translate: '专家管理' } },
            { path: 'user-manager-domain', component: UserDomainComponent, data: { translate: '领域维护' } },
            { path: 'distributor-types', component: DistributorsTypeComponent, data: { translate: '商品类型维护' } },
            { path: 'user-manager-distributor', component: UserDistributorsManagerComponent, data: { translate: '经销商管理' } },
            { path: 'user-manager-manufacturer', component: UserManufacturersManagerComponent, data: { translate: '厂商管理' } },
            { path: 'device-manager', component: DeviceManagerComponent, data: { translate: '设备列表' } },
            { path: 'device-create', component: DeviceCreateComponent, data: { translate: '创建设备' } },
            { path: 'goods-manager', component: GoodsManagerComponent, data: { translate: '商品管理'} },
            { path: 'goods-ad', component: GoodsAdComponent, data: { translate: '广告管理'} },
            { path: 'order-manager', component: OrderManagerComponent, data: { translate: '订单管理'} },
            { path: 'pro', loadChildren: './pro/pro.module#ProModule' }
        ]
    },
    // 全屏布局
    {
        path: 'data-v',
        component: LayoutFullScreenComponent,
        children: [
            { path: '', loadChildren: './data-v/data-v.module#DataVModule' }
        ]
    },
    // pro 单页，存在此原因是体验更好，这样不必在首次Angular运行后还需要下载模块文件才会渲染成功
    {
        path: 'pro/user',
        component: ProUserLayoutComponent,
        children: [
            { path: 'login', component: ProUserLoginComponent },
            { path: 'register', component: ProUserRegisterComponent },
            { path: 'register-result', component: ProUserRegisterResultComponent }
        ]
    },

    { path: '**', redirectTo: 'dashboard' }
];
