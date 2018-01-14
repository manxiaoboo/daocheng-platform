import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class DeviceDataService {

    constructor(private http: Http, private router: Router) { }

    /**
     * 获取所有设备
     */
    getAllDevice() {
        let url = environment.host + 'devices';
        return this._httpGet(url);
    }

    /**
     * 根据id获取device
     * @param deviceId 
     */
    getDeviceById(deviceId) {
        let url = environment.host + 'devices/getDeviceById?deviceId=' + deviceId;
        return this._httpGet(url);
    }

    /**
     * 获取指定状态的Devices
     * @param isUse 
     */
    getDevicesByIsUse(isUse) {
        let url = environment.host + 'devices/getDevicesByIsUse';
        let query = { isUse: isUse }
        return this._httpPost(url, query);
    }

    /**
     * 创建device
     * @param device 
     */
    createDevice(device) {
        let url = environment.host + 'devices/create';
        return this._httpPost(url, device);
    }

    /**
     * 修改device信息
     * @param device 
     */
    editDevice(device) {
        let url = environment.host + 'devices/edit';
        return this._httpPost(url, device);
    }

    /**
     * 将用户注册到机智云
     */
    registToJZY(device) {
        let url = "http://api.gizwits.com/app/users";
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("X-Gizwits-Application-Id", device.appid);
        let username = device.username;
        let password = device.password;
        return this._httpPost(url,{username:username,password:password},headers);
    }

    /**
     * 登录机智云
     * @param device 
     */
    loginToJZY(device){
        let url = "http://api.gizwits.com/app/login";
        let headers = new Headers();
        headers.append("X-Gizwits-Application-Id", device.appid);
        let username = device.username;
        let password = device.password;
        return this._httpPost(url,{username:username,password:password},headers);
    }

    /**
     * 将设备绑定在机智云上
     */
    bindingsToJZY(device,usertoken){
        let url = "http://api.gizwits.com/app/bindings";
        let headers = new Headers();
        headers.append("X-Gizwits-Application-Id", device.appid);
        headers.append("X-Gizwits-User-token", usertoken);
        let data = {
            "devices": [{
                "did": device.did,
                "passcode": device.passcode,
                "remark": "",      
                "dev_alias": ""
            }]
        }
        return this._httpPost(url,data,headers);
    }

    /**
     * 将设备解除绑定在机智云上
     * @param device 
     * @param usertoken 
     */
    unBindingToJZY(device,usertoken){
        let url = "http://api.gizwits.com/app/bindings";
        let headers = new Headers();
        headers.append("X-Gizwits-Application-Id", device.appid);
        headers.append("X-Gizwits-User-token", usertoken);
        let data = {
            "devices": [{
                "did": device.did
            }]
        }
        return this._httpDelete(url,data,headers);
    }

    /**
     * 删除device
     * @param device 
     */
    deleteDevice(device) {
        let url = environment.host + 'devices/delete';
        return this._httpPost(url, device);
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

    private _httpPost(url, data, header?) {
        return this.http.post(url, data, {
            headers: header ? header : this._getHeader()
        }).toPromise().catch(e => this.handleErr(e));
    }

    private _httpDelete(url, data, header?){
        return this.http.delete(url, {
            headers: header ? header : this._getHeader(),
            body:data
        }).toPromise().catch(e => this.handleErr(e));
    }

    private _httpGet(url,header?) {
        return this.http.get(url, {
            headers: header?header:this._getHeader()
        }).toPromise().catch(e => this.handleErr(e));
    }

    private handleErr(e) {
        if (e.status == 401) {
            this.router.navigate(['/pro/user/login']);
        }
    }
}
