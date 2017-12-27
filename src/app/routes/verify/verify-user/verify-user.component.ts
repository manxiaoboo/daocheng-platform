import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';


@Component({
    selector: 'app-verify-user',
    templateUrl: './verify-user.component.html'
})
export class VerifyUserComponent implements OnInit {
    q: any = {
        pi: 1,
        ps: 5,
        sorter: '',
        userName: '',
        updatedAt: '',
        address: '',
        phone: '',
        status: 'waiting',
        role: ''
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
    modalVisible2 = false;
    roles = [];

    audit_users = [];
    audit_users_done = [];
    currentAuditUser;
    currentAuditUserDone;
    old_audit_users = [];
    old_audit_users_done = [];

    constructor(public msg: NzMessageService, private modal: NzModalService, private dataservice: DCDataService, private auth: DCAuthService, private router: Router) {

    }

    ngOnInit() {
        this.roles = this.auth.roles;
        this.refreshDatas();
    }

    refreshDatas() {
        this.loading = true;
        Promise.all([
            this.getAllAuditUsers(),
            this.getAllAuditUsersDone()
        ]).then(() => {
            this.loading = false;
        });

    }

    initQ() {
        this.q = (<any>Object).assign({
            pi: 1,
            ps: 10,
            sorter: '',
            userName: '',
            updatedAt: '',
            address: '',
            phone: '',
            role: '',
        }, this.q);
    }

    getAllAuditUsers() {
        this.initQ();
        return this.dataservice.getAllAuditUsers().then((ar: any) => {
            let arj = ar.json();
            arj.forEach(a => {
                this.roles.forEach(r => {
                    if (a.roleId == r.id) {
                        a.roleName = r.cName;
                    }
                });
            });
            this.old_audit_users = this.audit_users = arj;
        });
    }

    getAllAuditUsersDone() {
        this.initQ();
        return this.dataservice.getAllAuditUsersDone().then((ar: any) => {
            let arj = ar.json();
            arj.forEach(a => {
                this.roles.forEach(r => {
                    if (a.roleId == r.id) {
                        a.roleName = r.cName;
                    }
                });
            });
            this.old_audit_users_done = this.audit_users_done = arj;
        });
    }

    restoreAuditUsers() {
        this.initQ();
        this.audit_users = this.old_audit_users;
        this.audit_users_done = this.old_audit_users_done;
    }

    filterSearch() {
        if (this.q.userName) {
            this.audit_users = this.old_audit_users.filter((au) => {
                return au.userName.indexOf(this.q.userName) != -1;
            });
            this.audit_users_done = this.old_audit_users_done.filter((au) => {
                return au.userName.indexOf(this.q.userName) != -1;
            });
        }
        if (this.q.address) {
            this.audit_users = this.old_audit_users.filter((au) => {
                return (au.province + au.city + au.area).indexOf(this.q.address) != -1;
            });
            this.audit_users_done = this.old_audit_users_done.filter((au) => {
                return (au.province + au.city + au.area).indexOf(this.q.address) != -1;
            });
        }
        if (this.q.phone) {
            this.audit_users = this.old_audit_users.filter((au) => {
                return au.phone.indexOf(this.q.phone) != -1;
            });
            this.audit_users_done = this.old_audit_users_done.filter((au) => {
                return au.phone.indexOf(this.q.phone) != -1;
            });
        }
        if (this.q.updatedAt) {
            this.audit_users = this.old_audit_users.filter((au) => {
                return isSameDay(new Date(au.updatedAt), new Date(this.q.updatedAt));
            });
            this.audit_users_done = this.old_audit_users_done.filter((au) => {
                return isSameDay(new Date(au.updatedAt), new Date(this.q.updatedAt));
            });
        }
        if (this.q.role) {
            this.audit_users = this.old_audit_users.filter((au) => {
                return au.roleId == this.q.role;
            });
            this.audit_users_done = this.old_audit_users_done.filter((au) => {
                return au.roleId == this.q.role;
            });
        }
        if (!this.q.userName && !this.q.address && !this.q.phone && !this.q.updatedAt && !this.q.role) {
            this.restoreAuditUsers();
        }
    }

    verify(au) {
        this.currentAuditUser = (<any>Object).assign(au, {});
        this.modalVisible = true;
    }

    reject(au){
        let option = {
            title: "危险",
            content: "你确认要拒绝此审核申请吗？",
            onOk: () => {
                this.loading = true;
                this.auth.auditReject(au).then(() => {
                    this.loading = false;
                    setTimeout(() => {
                        this.modal.success({
                            title: `操作成功`,
                            content: `此用户(${au.userName})的申请已被拒绝。`
                        });
                        this.refreshDatas();
                    }, 500);
                }).catch(err => {
                    this.msg.error("拒绝申请失败");
                });
            },
            onCancel: () => {
                this.loading = false;
            }
        }
        this.modal.confirm(option);
    }

    view(au) {
        this.currentAuditUserDone = (<any>Object).assign(au, {});
        this.loading = true;
        this.dataservice.getUser(this.currentAuditUserDone.auditUserId).then((u: any) => {
            this.loading = false;
            this.currentAuditUserDone.auditUser = u.json();
            this.modalVisible2 = true;
        });
    }

    viewOk() {
        this.modalVisible2 = false;
    }

    accept() {
        this.loading = true;
        let option = {
            title: "提示",
            content: "确认接受此审核吗？",
            onOk: () => {
                this.auth.register(this.currentAuditUser, this.auth.user.id).then(() => {
                    this.modalVisible = false;
                    this.loading = false;
                    this.getAllAuditUsers();
                    setTimeout(() => {
                        this.modal.success({
                            title: `操作成功`,
                            content: `此用户(${this.currentAuditUser.userName})已经通过审核，请为此用户分配设备并开通使用权限。`
                        });
                        this.refreshDatas();
                    }, 500);
                }).catch(err => {
                    this.msg.error("审核失败");
                });
            },
            onCancel: () => {
                this.loading = false;
            }
        }
        this.modal.confirm(option);
    }


    sort(field: string, value: any) {
        this.audit_users = _.orderBy(this.audit_users, [field], [value == 'ascend' ? 'asc' : 'desc']);
        this.audit_users_done = _.orderBy(this.audit_users_done, [field], [value == 'ascend' ? 'asc' : 'desc']);
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

    dataChange(e) {

    }

    reset(ls: any[]) {
        for (const item of ls) item.value = false;
    }
}
