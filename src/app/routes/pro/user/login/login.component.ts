import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { environment } from '../../../../../environments/environment';
import { DCAuthService } from '../../../../services/auth.service';

@Component({
    selector: 'pro-user-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.less' ],
    providers: [ SocialService ]
})
export class ProUserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    loading = false;

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        private auth:DCAuthService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(5)]],
            password: [null, Validators.required]
        });
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }


    // endregion

    submit() {
        this.error = '';
            this.userName.markAsDirty();
            this.password.markAsDirty();
            if (this.userName.invalid || this.password.invalid) return;
        // mock http
        this.loading = true;
        this.auth.login(this.userName.value,this.password.value).then((ur)=>{
            this.loading = false;
            if(!ur){
                this.error = `账户或密码错误`;
                return;
            }else{
                localStorage.setItem("authToken",ur.json().token);
                this.router.navigate(['/']);
            }
           
        });
            
                // if (this.userName.value !== 'admin' || this.password.value !== '888888') {
                //     this.error = `账户或密码错误`;
                //     return;
                // }

            // this.router.navigate(['/']);
    }

    // endregion

    ngOnDestroy(): void {
    }
}
