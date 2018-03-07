import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GoodsDataService } from '../../services/goods.data.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';

@Component({
    selector: 'app-goods-manager',
    templateUrl: './goods-manager.component.html'
})
export class GoodsManagerComponent implements OnInit {
    q: any = {
        pi: 1,
        ps: 20,
        updatedAt: '',
        term: ''
    };

    goods = [];
    old_goods = [];
    currentGoods;
    loading = false;
    modalGoods = false;

    constructor(public msg: NzMessageService, private modal: NzModalService, private gds: GoodsDataService, private router: Router) {

    }

    ngOnInit() {
        this.refreshData();
    }

    sort(field: string, value: any) {
        this.goods = _.orderBy(this.goods, [field], [value === 'ascend' ? 'asc' : 'desc']);
    }

    onSearch() {
        this.loading = true;
        this.goods = this.old_goods;
        if (!this.q.term) {
            this.loading = false;
            return;
        }
        this.goods = this.goods.filter(vf => {
            return vf.name.indexOf(this.q.term) !== -1 ||
                vf.distributor.name.indexOf(this.q.term) !== -1;
        });

        this.loading = false;
    }

    async refreshData() {
        this.loading = true;
        const gr: any = await this.gds.getAllAuditedGoods();
        this.goods = gr.json();
        this.old_goods = this.goods;
        this.loading = false;
        console.info(this.goods);
    }

    async showGoodsModal(g) {
        this.currentGoods = g;
        if (this.currentGoods.photos) {
            this.currentGoods.photos_arr = this.currentGoods.photos.split(',');
        }
        this.modalGoods = true;
    }

    setToAD(g) {
        const option = {
            title: '操作确认',
            content: '确认将此商品设置为广告吗？',
            onOk: () => {
                this.loading = true;
                g.isAd = true;
                this.gds.updateGoods(g).then(() => {
                    this.msg.success('设置广告成功');
                    this.loading = false;
                    this.modalGoods = false;
                    this.currentGoods = null;
                    this.refreshData();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    closeGoods(g) {
        const option = {
            title: '危险操作确认',
            content: '确认将此商品强制下架吗（特殊情况使用，如经销商失联、商品信息违规等）？',
            onOk: () => {
                this.loading = true;
                this.gds.closeGoods(g.id).then(() => {
                    this.msg.success('商品下架成功');
                    this.loading = false;
                    this.modalGoods = false;
                    this.currentGoods = null;
                    this.refreshData();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    nothing() {
        this.modalGoods = false;
    }

    dataChange(e) {

    }

    pageChange(e) {

    }

}
