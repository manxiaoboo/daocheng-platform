import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { DCDataService } from '../services/data.service';



@Injectable()
export class DCAuthService {
    user;

    constructor( private dataservice:DCDataService,private router:Router) { }

    getMe(){
        return this.dataservice.me().then((me:any)=>{
            this.user = me.json();
        });
    }

    register(audit_user){
        return this.dataservice.register(audit_user);
    }

    login(userName,password){
        return this.dataservice.login(userName,password);
    }

    logout(){
        localStorage.removeItem("authToken");
        this.router.navigate(['/pro/users/login']);
    }

}
