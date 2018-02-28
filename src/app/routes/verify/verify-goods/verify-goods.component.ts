import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../services/data.service';
import * as _ from 'lodash';



@Component({
    selector: 'app-verify-goods',
    templateUrl: './verify-goods.component.html',
    styleUrls: ['./verify-goods.component.less']
})
export class VerifyGoodsComponent implements OnInit, OnDestroy {
    q: any = {
        pi: 1,
        ps: 5,
        sorter: '',
        updatedAt: ''
    };
    sortMap: any = {};
    loading = false;
    modalAudit = false;
    audit_goods = [];
    currentAudit;
    reason;
    constructor(public msg: NzMessageService, private modal: NzModalService,
        private dataservice: DCDataService) { }

    ngOnInit() {
        this.getAuditGoods();
    }

    sort(field: string, value: any) {
        this.audit_goods = _.orderBy(this.audit_goods, [field], [value === 'ascend' ? 'asc' : 'desc']);
    }

    getAuditGoods() {
        this.loading = true;
        this.dataservice.getAllAuditGoods().then((ag: any) => {
            this.audit_goods = ag.json();
            this.audit_goods.forEach(agf => {
                if (agf.goods.photos) {
                    agf.goods.photos_arr = agf.goods.photos.split(',');
                }
            });
            this.loading = false;
            console.info(this.audit_goods);
        });
    }

    async showAuditModal(a) {
        // const option = {
        //     title: '危险',
        //     content: '删除一个商品类型是一个危险操作，请确保该类型下没有分配商品，才可进行删除，确认删除吗？',
        //     onOk: () => {
        //         this.loading = true;
        //         this.dataservice.deleteDistributorType(d).then(() => {
        //             this.loading = false;
        //             this.msg.success('删除商品类型成功');
        //         });
        //     },
        //     onCancel: () => {
        //         this.loading = false;
        //     }
        // };

        // this.modal.confirm(option);
        this.reason = null;
        this.currentAudit = a;
        this.modalAudit = true;
    }

    doAudit() {
        const option = {
            title: '审核',
            content: '您确认将此商品通过审核吗？',
            onOk: () => {
                this.loading = true;
                this.dataservice.auditGoodsPass(this.currentAudit.id, this.currentAudit.distributorGoodsId).then(() => {
                    this.loading = false;
                    this.msg.success('操作成功');
                    this.getAuditGoods();
                    this.modalAudit = false;
                    this.reason = null;
                });
            },
            onCancel: () => {
                this.loading = false;
            }
        };
        this.modal.confirm(option);
    }

    reject() {
        if (!this.reason) {
            alert('请填写拒绝原因与修改建议');
            return;
        }
        const option = {
            title: '拒绝',
            content: '您确认拒绝此商品审核吗？',
            onOk: () => {
                this.loading = true;
                this.dataservice.auditGoodsReject(this.currentAudit.id, this.currentAudit.distributorGoodsId, this.reason).then(() => {
                    this.loading = false;
                    this.msg.success('操作成功');
                    this.getAuditGoods();
                    this.modalAudit = false;
                    this.reason = null;
                });
            },
            onCancel: () => {
                this.loading = false;
            }
        };
        this.modal.confirm(option);
    }

    dataChange(e) {

    }

    pageChange(e) {

    }

    ngOnDestroy(): void {
    }
}