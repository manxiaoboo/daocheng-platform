import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { DCDataService } from '../services/data.service';
import { DCAuthService } from '../services/auth.service';

@Injectable()
export class AuthResolveService implements Resolve<any> {
    constructor(private dataService: DCDataService,private auth:DCAuthService, private router: Router) { }
    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<any> | boolean {
        return Promise.all([
            this.getMe(),
            this.getRoles()
        ]).then(()=>{
            return true;
        });
    }

    getMe(){
        return this.auth.getMe();
    }

    getRoles(){
        return this.auth.getRoles();
    }
} 