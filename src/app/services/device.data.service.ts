import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Md5 } from 'ts-md5/dist/md5';


@Injectable()
export class DeviceDataService {

    constructor(private http: Http, private router: Router) { }

    /**
     * 获取所有设备
     */
    getAllDevice() {
        const url = environment.host + 'devices';
        return this._httpGet(url);
    }

    /**
     * 根据id获取device
     * @param deviceId
     */
    getDeviceById(deviceId) {
        const url = environment.host + 'devices/getDeviceById?deviceId=' + deviceId;
        return this._httpGet(url);
    }

    /**
     * 获取指定状态的Devices
     * @param isUse
     */
    getDevicesByIsUse(isUse) {
        const url = environment.host + 'devices/getDevicesByIsUse';
        const query = { isUse: isUse };
        return this._httpPost(url, query);
    }

    /**
     * 创建device
     * @param device
     */
    createDevice(device) {
        const url = environment.host + 'devices/create';
        return this._httpPost(url, device);
    }

    /**
     * 修改device信息
     * @param device
     */
    editDevice(device) {
        const url = environment.host + 'devices/edit';
        return this._httpPost(url, device);
    }

    /**
     * 将用户注册到机智云
     */
    registToJZY(device) {
        const url = 'http://api.gizwits.com/app/users';
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Gizwits-Application-Id', device.appid);
        const username = device.username;
        const password = device.password;
        return this._httpPost(url, { username: username, password: password }, headers);
    }

    /**
     * 登录机智云
     * @param device
     */
    loginToJZY(device) {
        const url = 'http://api.gizwits.com/app/login';
        const headers = new Headers();
        headers.append('X-Gizwits-Application-Id', device.appid);
        const username = device.username;
        const password = device.password;
        return this._httpPost(url, { username: username, password: password }, headers);
    }

    /**
     * 将设备绑定在机智云上
     */
    bindingsToJZY(device, usertoken) {
        const url = 'http://api.gizwits.com/app/bind_mac';
        const headers = new Headers();
        const timestemp = Math.round(new Date().getTime() / 1000);
        const signature = Md5.hashStr(device.productSecret + timestemp);
        headers.append('X-Gizwits-Application-Id', device.appid);
        headers.append('X-Gizwits-User-token', usertoken);
        headers.append('X-Gizwits-Timestamp', timestemp.toString());
        headers.append('X-Gizwits-Signature', signature.toString());
        const data = {
                'product_key': device.productKey,
                'mac': device.mac,
                'remark': '',
                'dev_alias': '',
                'set_owner': 0
            };
        return this._httpPost(url, data, headers);
    }

    /**
     * 将设备解除绑定在机智云上
     * @param device
     * @param usertoken
     */
    unBindingToJZY(device, usertoken) {
        const url = 'http://api.gizwits.com/app/bindings';
        const headers = new Headers();
        headers.append('X-Gizwits-Application-Id', device.appid);
        headers.append('X-Gizwits-User-token', usertoken);
        const data = {
            'devices': [{
                'did': device.did
            }]
        };
        return this._httpDelete(url, data, headers);
    }

    /**
     * 删除device
     * @param device
     */
    deleteDevice(device) {
        const url = environment.host + 'devices/delete';
        return this._httpPost(url, device);
    }

    private _getHeader() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            this.router.navigate(['/pro/user/login']);
            return;
        }
        const headers = new Headers();
        // headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + authToken);

        return headers;
    }

    private _httpPost(url, data, header?) {
        return this.http.post(url, data, {
            headers: header ? header : this._getHeader()
        }).toPromise().catch(e => this.handleErr(e));
    }

    private _httpDelete(url, data, header?) {
        return this.http.delete(url, {
            headers: header ? header : this._getHeader(),
            body: data
        }).toPromise().catch(e => this.handleErr(e));
    }

    private _httpGet(url, header?) {
        return this.http.get(url, {
            headers: header ? header : this._getHeader()
        }).toPromise().catch(e => this.handleErr(e));
    }

    private handleErr(e) {
        if (e.status === 401) {
            this.router.navigate(['/pro/user/login']);
        }
    }
}
