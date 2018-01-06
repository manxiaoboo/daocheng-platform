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
    getAllDevice(){
        let url = environment.host + 'devices';
        return this._httpGet(url);
    }

    /**
     * 根据id获取device
     * @param deviceId 
     */
    getDeviceById(deviceId){
        let url = environment.host + 'devices/getDeviceById?deviceId='+deviceId;
        return this._httpGet(url);
    }

    /**
     * 获取指定状态的Devices
     * @param isUse 
     */
    getDevicesByIsUse(isUse){
        let url = environment.host + 'devices/getDevicesByIsUse';
        let query = {isUse:isUse}
        return this._httpPost(url,query);
    }

    /**
     * 创建device
     * @param device 
     */
    createDevice(device){
        let url = environment.host + 'devices/create';
        return this._httpPost(url,device);
    }

    /**
     * 修改device信息
     * @param device 
     */
    editDevice(device){
        let url = environment.host + 'devices/edit';
        return this._httpPost(url,device);
    }

    /**
     * 删除device
     * @param device 
     */
    deleteDevice(device){
        let url = environment.host + 'devices/delete';
        return this._httpPost(url,device);
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
