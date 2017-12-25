import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class DCDataService {

    constructor(private http: Http,private router:Router) { }

    /**
     * 正式注册用户
     * @param audit_user 
     */
    register(audit_user){
        let url = environment.host + 'users/register';
        return this._httpPost(url,audit_user);
    }

    getAllAuditUsers(){
        let url = environment.host + 'users/all-audit-user';
        return this._httpGet(url);
    }

    me() {
        let url = environment.host + 'users/me';
        return this._httpGet(url);
    }

    login(userName,password){
        let url = environment.host + 'auth/local';
        return this._httpPost(url,{userName:userName,password:password});
    }

    private _getHeader(){
        let authToken = localStorage.getItem("authToken");
        if(!authToken){
            this.router.navigate(['/pro/user/login']);
            return;
        }
        let headers = new Headers();
        // headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + authToken);

        return headers;
    }

    private _httpPost(url, data) {
        return this.http.post(url, data,{
            headers: this._getHeader()
          }).toPromise().catch(e => this.handleErr(e));
    }

    private _httpGet(url) {
        return this.http.get(url,{
            headers: this._getHeader()
          }).toPromise().catch(e => this.handleErr(e));
    }

    private handleErr(e) {
        if(e.status == 401){
            this.router.navigate(['/pro/user/login']);
        }
    }
}
