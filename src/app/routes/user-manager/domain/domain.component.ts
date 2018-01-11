import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { getNotice, getActivities } from '../../../../../_mock/api.service';
import { getFakeChartData } from '../../../../../_mock/chart.service';
import { DCDataService } from '../../../services/data.service';

@Component({
    selector: 'app-user-domain',
    templateUrl: './domain.component.html',
    styleUrls: ['./domain.component.less']
})
export class UserDomainComponent implements OnInit, OnDestroy {
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
    domains = [];
    newDomain;
    editDomain;
    constructor(public msg: NzMessageService, private modal: NzModalService,
        private dataservice: DCDataService) {}

    ngOnInit() {
        this.getDomains();
    }

    getDomains(){
        this.loading = true;
        this.dataservice.getAllDomains().then((dr:any)=>{
            this.domains = dr.json();
            this.loading = false;
        });
    }

    addDomain(){
        this.newDomain = {};
        this.modalVisible = true;
    }

    showEditModal(d){
        this.editDomain = d;
        this.modalEdit = true;
    }

    async createDomain(){
        this.loading = true;
        await this.dataservice.createDomain(this.newDomain);
        this.msg.success("创建专业领域成功");
        this.loading = false;
        this.modalVisible = false;
        this.getDomains();
    }

    async doEdit(){
        this.loading = true;
        await this.dataservice.editDomain(this.editDomain);
        this.msg.success("修改专业领域成功");
        this.loading = false;
        this.modalEdit = false;
        this.getDomains();
    }

    async deleteDomain(d){
        let option = {
            title: "危险",
            content: "删除一个专业领域是一个危险操作，请确保该领域下没有分配专家，才可进行删除，确认删除吗？",
            onOk: () => {
                this.loading = true;
                this.dataservice.deleteDomain(d).then(()=>{
                    this.loading = false;
                    this.msg.success("删除专业领域成功");
                    this.getDomains();
                });
            },
            onCancel: () => {
                this.loading = false;
            }
        }
        this.modal.confirm(option);
    }

    dataChange(e){

    }

    pageChange(e){

    }

    ngOnDestroy(): void {
    }
}
