import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OrderDataService } from '../../services/order.data.service';
import * as _ from 'lodash';
import { isSameDay } from 'date-fns';

@Component({
    selector: 'app-order-manager',
    templateUrl: './order-manager.component.html'
})
export class OrderManagerComponent implements OnInit {
    q: any = {
        pi: 1,
        status: 'all',
        term: ''
    };

    orders;
    loading = false;

    constructor(public msg: NzMessageService, private modal: NzModalService, private ods: OrderDataService, private router: Router) {

    }

    ngOnInit() {
        this.refreshData();
    }

    onSearch(): void {
        this.loading = true;
        if (!this.q.term) {
            this.loading = false;
            return;
        }
        this.refreshData();
    }

    async refreshData() {
        this.loading = true;
        const or: any = await this.ods.getAllGoods(this.q.pi, this.q.status, this.q.term);
        this.orders = or.json();
        this.loading = false;
    }

    clear() {
        this.q = {
            pi: 1,
            status: 'all',
            term: ''
        };
        this.refreshData();
    }

    dataChange(e) {

    }

    pageChange(e) {

    }

}
