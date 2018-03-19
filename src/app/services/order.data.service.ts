import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';


@Injectable()
export class OrderDataService {

    constructor(private http: Http, private router: Router) { }

    /**
     * 获取所有订单
     */
    getAllGoods(page, status, term) {
        let url;
        if (term) {
            url = environment.host + 'order/getAllOrders?page=' + page + '&status=' + status + '&term=' + term;
        } else {
            url = environment.host + 'order/getAllOrders?page=' + page + '&status=' + status;
        }

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
