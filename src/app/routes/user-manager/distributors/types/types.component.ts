import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../../services/data.service';
import * as _ from 'lodash';



@Component({
    selector: 'app-user-distributor-type',
    templateUrl: './types.component.html',
    styleUrls: ['./types.component.less']
})
export class DistributorsTypeComponent implements OnInit, OnDestroy {
    q: any = {
        pi: 1,
        ps: 5,
        sorter: '',
        updatedAt: '',
        status: 'validate',
        term: ''
    };
    sortMap: any = {};
    loading = false;
    modalVisible = false;
    modalEdit = false;
    types = [];
    newType;
    editType;
    constructor(public msg: NzMessageService, private modal: NzModalService,
        private dataservice: DCDataService) { }

    ngOnInit() {
        this.getTypes();
    }

    sort(field: string, value: any) {
        this.types = _.orderBy(this.types, [field], [value === 'ascend' ? 'asc' : 'desc']);
    }

    getTypes() {
        this.loading = true;
        this.dataservice.getAllDistributorTypes().then((dr: any) => {
            this.types = dr.json();
            this.loading = false;
        });
    }

    addType() {
        this.newType = {};
        this.modalVisible = true;
    }

    showEditModal(d) {
        this.editType = d;
        this.modalEdit = true;
    }

    async createType() {
        this.loading = true;
        await this.dataservice.createDistributorType(this.newType);
        this.msg.success('创建商品类型成功');
        this.loading = false;
        this.modalVisible = false;
        this.getTypes();
    }

    async doEdit() {
        this.loading = true;
        await this.dataservice.editDistributorType(this.editType);
        this.msg.success('修改商品类型成功');
        this.loading = false;
        this.modalEdit = false;
        this.getTypes();
    }

    async deleteType(d) {
        const option = {
            title: '危险',
            content: '删除一个商品类型是一个危险操作，请确保该类型下没有分配商品，才可进行删除，确认删除吗？',
            onOk: () => {
                this.loading = true;
                this.dataservice.deleteDistributorType(d).then(() => {
                    this.loading = false;
                    this.msg.success('删除商品类型成功');
                    this.getTypes();
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
