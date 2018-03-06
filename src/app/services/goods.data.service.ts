import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class GoodsDataService {

    constructor(private http: Http, private router: Router) { }

    /**
     * 获取所有通过审核并且上架的商品
     */
    getAllAuditedGoods() {
        const url = environment.host + 'distributor/allAuditedGoods';
        return this._httpGet(url);
    }

    /**
     * 获取所有通过审核并且上架并且广告的商品
     */
    getAllAdGoods() {
        const url = environment.host + 'distributor/allAdGoods';
        return this._httpGet(url);
    }

    /**
     * 修改商品信息
     * @param goods
     */
    updateGoods(goods) {
        const url = environment.host + 'distributor/update';
        return this._httpPost(url, goods);
    }

    /**
     * 修改商品信息
     * @param goods
     */
    closeGoods(id) {
        const url = environment.host + 'distributor/close?id=' + id;
        return this._httpGet(url);
    }

    private _getHeader() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            this.router.navigate(['/pro/user/login']);
            return;
        }
        const headers = new Headers();
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
