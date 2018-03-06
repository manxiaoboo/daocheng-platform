import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { GoodsDataService } from '../../../services/goods.data.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';

@Component({
    selector: 'app-goods-ad',
    templateUrl: './goods-ad.component.html'
})
export class GoodsAdComponent implements OnInit {
    q: any = {
        pi: 1,
        ps: 20,
        updatedAt: '',
        term: ''
    };

    goods = [];
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

    async refreshData() {
        this.loading = true;
        const gr: any = await this.gds.getAllAdGoods();
        this.goods = gr.json();
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

    closeAd(g) {
        const option = {
            title: '操作确认',
            content: '确认将此商品的广告取消吗？',
            onOk: () => {
                this.loading = true;
                g.isAd = false;
                this.gds.updateGoods(g).then(() => {
                    this.msg.success('取消广告成功');
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
