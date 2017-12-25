import { LayoutComponent } from '../layout/layout.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';

//verify
import { VerifyUserComponent } from './verify/verify-user/verify-user.component';

// pro
import { ProUserLayoutComponent } from '../layout/pro/user/user.component';
import { ProUserLoginComponent } from './pro/user/login/login.component';
import { ProUserRegisterComponent } from './pro/user/register/register.component';
import { ProUserRegisterResultComponent } from './pro/user/register-result/register-result.component';
import { AuthResolveService } from './auth.resolve';

export const routes = [
    {
        path: '',
        component: LayoutComponent,
        resolve:[AuthResolveService],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardWorkplaceComponent, data: { translate: '工作台' } },
            { path: 'verify-user', component:VerifyUserComponent, data:{translate: '用户审核'} },
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
