import { Component, OnInit } from '@angular/core';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import * as _ from "lodash";


@Component({
    selector: 'app-verify-user',
    templateUrl: './verify-user.component.html'
})
export class VerifyUserComponent implements OnInit {
    q: any = {
        pi: 1,
        ps: 5,
        sorter: '',
        status: -1,
        statusList: []
    };
    data: any[] = [];
    loading = false;
    selectedRows: any[] = [];
    curRows: any[] = [];
    totalCallNo = 0;
    allChecked = false;
    indeterminate = false;
    status = [
        { text: '关闭', value: false, type: 'default' },
        { text: '运行中', value: false, type: 'processing' },
        { text: '已上线', value: false, type: 'success' },
        { text: '异常', value: false, type: 'error' }
    ];
    sortMap: any = {};
    expandForm = false;
    modalVisible = false;

    audit_users = [];
    currentAuditUser;

    constructor(public msg: NzMessageService,private modal:NzModalService,private dataservice:DCDataService,private auth:DCAuthService) {
        
    }

    ngOnInit() {
        this.getAllAuditUsers();
    }

    getAllAuditUsers(){
        this.dataservice.getAllAuditUsers().then((ar:any)=>{
            this.audit_users = ar.json();
            console.info(this.audit_users);
        });
    }

    verify(au) {
        this.currentAuditUser = (<any>Object).assign(au,{});
        this.modalVisible = true;
    }

    accept() {
        this.loading = true;
        let option = {
            title:"提示",
            content:"确认接受此审核吗？",
            onOk:()=>{
                this.auth.register(this.currentAuditUser).then(()=>{
                this.modalVisible = false;
                this.loading = false;
                this.getAllAuditUsers();
                }).catch(err=>{
                    this.msg.error("审核失败");
                });
            },
            onCancel:()=>{
                this.loading = false;
            }
        }
        this.modal.confirm(option);
    }

    clear() {
        this.selectedRows = [];
        this.totalCallNo = 0;
        this.data.forEach(i => i.checked = false);
        this.refreshStatus();
    }

    checkAll(value: boolean) {
        this.curRows.forEach(i => {
            if (!i.disabled) i.checked = value;
        });
        this.refreshStatus();
    }

    refreshStatus() {
        const allChecked = this.curRows.every(value => value.disabled || value.checked);
        const allUnChecked = this.curRows.every(value => value.disabled || !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.selectedRows = this.data.filter(value => value.checked);
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
    }

    sort(field: string, value: any) {
        this.audit_users = _.orderBy(this.audit_users, [field], [value=='ascend'?'asc':'desc']);
    }

    dataChange(res: any) {
        this.curRows = res;
        this.refreshStatus();
    }

    pageChange(pi: number): Promise<any> {
        this.q.pi = pi;
        this.loading = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                this.loading = false;
                resolve();
            }, 500);
        });
    }

    reset(ls: any[]) {
        for (const item of ls) item.value = false;
    }
}
