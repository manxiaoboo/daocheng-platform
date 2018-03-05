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
    modalAuditUpdate = false;
    audit_goods = [];
    currentAudit;
    reason;
    types = [];
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
            this.dataservice.getAllDistributorTypes().then((dt: any) => {
                this.types = dt.json();
                this.audit_goods = ag.json();
                this.audit_goods.forEach(agf => {
                    if (agf.goods.photos) {
                        agf.goods.photos_arr = agf.goods.photos.split(',');
                    }
                });
                this.loading = false;
                console.info(this.audit_goods);
                console.info(this.types)

            });
        });
    }

    async showAuditModal(a) {
        this.reason = null;
        this.currentAudit = a;
        if (a.type === 'create') {
            this.modalAudit = true;
        } else {
            if (this.currentAudit.data) this.currentAudit.data = JSON.parse(this.currentAudit.data);
            this.types.forEach(t => {
                if (t.id === this.currentAudit.data.type) {
                    this.currentAudit.data.typeName = t.name;
                }
            });
            this.modalAuditUpdate = true;
        }
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

    doEdit() {
        const option = {
            title: '审核',
            content: '您确认将此商品通过审核吗？',
            onOk: () => {
                this.loading = true;
                this.dataservice.auditGoodsEditPass(this.currentAudit.id, this.currentAudit.data).then(() => {
                    this.loading = false;
                    this.msg.success('操作成功');
                    this.getAuditGoods();
                    this.modalAudit = false;
                    this.modalAuditUpdate = false;
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
                    this.modalAuditUpdate = false;
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
