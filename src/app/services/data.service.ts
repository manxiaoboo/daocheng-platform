import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class DCDataService {

    constructor(private http: Http, private router: Router) { }

    /**
     * 正式注册用户
     * @param audit_user
     * @param userId 操作人Id
     */
    register(audit_user, userId) {
        let url = environment.host + 'users/register?userId=' + userId;
        return this._httpPost(url, audit_user).catch(err => this.handleErr(err));
    }

    /**
     * 获取所有身份
     */
    getRoles() {
        let url = environment.host + 'users/roles';
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 根据身份获取用户
     * @param roleId 
     */
    getUsersByRole(roleId) {
        let url = environment.host + 'users/all-user?roleId=' + roleId;
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 获取所有待审核用户
     */
    getAllAuditUsers() {
        let url = environment.host + 'users/all-audit-user';
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 获取所有已审核用户
     */
    getAllAuditUsersDone() {
        let url = environment.host + 'users/all-audit-user-done';
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 获取所有专业列表
     */
    getAllDomains(){
        let url = environment.host + 'users/all-domain';
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 创建一个domain
     * @param domain 
     */
    createDomain(domain){
        let url = environment.host + 'users/create-domain';
        return this._httpPost(url,domain);
    }

    /**
     * 修改一个domain
     * @param domain 
     */
    editDomain(domain){
        let url = environment.host + 'users/edit-domain';
        return this._httpPost(url,domain);
    }

    /**
     * 删除一个domain
     * @param domain 
     */
    deleteDomain(domain){
        let url = environment.host + 'users/delete-domain';
        return this._httpPost(url,domain);
    }

    /**
     * 拒绝审核申请
     * @param audit_user 
     */
    auditUserReject(audit_user){
        let url = environment.host + 'users/audit-user-reject';
        return this._httpPost(url,audit_user);
    }

    /**
     * 根据id获取用户信息
     * @param userId 
     */
    getUser(userId) {
        let url = environment.host + 'users/getUser?userId=' + userId;
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 修改用户信息
     * @param user 
     */
    editUser(user){
        let url = environment.host + 'users/user-edit';
        return this._httpPost(url,user).catch(err => this.handleErr(err));
    }

    /**
     * 修改专家信息
     * @param expert 
     */
    editExpert(expert){
        let url = environment.host + 'users/expert-edit';
        return this._httpPost(url,expert).catch(err => this.handleErr(err));
        
    }

    /**
     * 根据userId获取专家信息
     * @param userId 
     */
    getExpertById(userId){
        let url = environment.host + 'users/expertByUserId?userId='+userId;
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 根据userId获取经销商信息
     * @param userId 
     */
    getDistributorById(userId){
        let url = environment.host + 'users/distributorByUserId?userId='+userId;
        return this._httpGet(url).catch(err => this.handleErr(err));
    }

    /**
     * 修改经销商信息
     * @param expert 
     */
    editDistributor(distributor){
        let url = environment.host + 'users/distributor-edit';
        return this._httpPost(url,distributor).catch(err => this.handleErr(err));
        
    }

    /**
     * 获取当前登陆用户信息
     */
    me() {
        let url = environment.host + 'users/me?roleId=2cf27ea0-e6c4-11e7-b42e-060400ef5315';
        return this._httpGet(url);
    }

    /**
     * 登录
     * @param userName 
     * @param password 
     */
    login(userName, password) {
        let url = environment.host + 'auth/local';
        return this._httpPost(url, { userName: userName, password: password }).catch(err => this.handleErr(err));
    }

    private _getHeader() {
        let authToken = localStorage.getItem("authToken");
        if (!authToken) {
            this.router.navigate(['/pro/user/login']);
            return;
        }
        let headers = new Headers();
        // headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + authToken);

        return headers;
    }

    private _httpPost(url, data) {
        return this.http.post(url, data, {
            headers: this._getHeader()
        }).toPromise().catch(e => this.handleErr(e));
    }

    private _httpGet(url) {
        return this.http.get(url, {
            headers: this._getHeader()
        }).toPromise().catch(e => this.handleErr(e));
    }

    private handleErr(e) {
        if (e.status == 401) {
            this.router.navigate(['/pro/user/login']);
        }
    }
}
