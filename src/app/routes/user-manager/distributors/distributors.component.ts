import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import { DeviceDataService } from '../../../services/device.data.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';



@Component({
    selector: 'app-user-distributors',
    templateUrl: './distributors.component.html'
})
export class UserDistributorsManagerComponent implements OnInit, OnDestroy {
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
    modalVisible3 = false;
    modalEdit = false;
    roles;
    distributorRole;
    distributors = [];
    validate_distributors = [];
    novalidate_distributors = [];
    currentDistributor;
    currentDistributorUser;
    editDistributors;

    options = {};
    constructor(public msg: NzMessageService,
        private modal: NzModalService,
        private dataservice: DCDataService,
        private auth: DCAuthService,
        private dds: DeviceDataService
    ) { }

    ngOnInit() {
        this.roles = this.auth.roles;
        this.distributorRole = this.roles.filter(f => {
            return f.name == 'distributor';
        })[0];
        this.getDistributors();
    }

    getDistributors() {
        this.loading = true;
        this.dataservice.getUsersByRole(this.distributorRole.id).then((fs: any) => {
            this.distributors = fs.json();
            this.distributors.forEach(f => {
                this.roles.forEach(r => {
                    if (f.roleId == r.id) {
                        f.roleName = r.cName;
                    }
                });
            });
            this.handleValidateDatas();
            this.loading = false;
        });
    }


    handleValidateDatas() {
        this.validate_distributors = this.distributors.filter(f => {
            return f.isValidate;
        });
        this.novalidate_distributors = this.distributors.filter(f => {
            return !f.isValidate;
        });
    }

    async view(f) {
        this.loading = true;
        this.currentDistributor = f;
        let distributor: any = await this.dataservice.getDistributorById(f.id);
        this.currentDistributorUser = distributor.json();
        this.loading = false;
        this.modalVisible3 = true;
    }
    async showEditModal(f) {
        this.editDistributors = f;
        this.loading = true;
        let distributor: any = await this.dataservice.getDistributorById(f.id);
        this.currentDistributorUser = distributor.json();
        this.loading = false;
        this.modalEdit = true;
    }

    doEditDistributor() {
        let option = {
            title: "敏感",
            content: "你确认要变更此用户信息吗？",
            onOk: () => {
                this.loading = true;
                this.dataservice.editUser(this.editDistributors).then(e => {
                    this.dataservice.editDistributor(this.currentDistributorUser).then(() => {
                        this.loading = false;
                        this.msg.success("变更用户信息成功");
                        this.modalEdit = false;
                    }).catch(err => {
                        this.loading = false;
                        this.msg.error("抱歉，变更失败");
                        this.modalEdit = false;
                        this.handleValidateDatas();
                    });
                }).catch(err => {
                    this.loading = false;
                    this.msg.error("抱歉，变更失败");
                    this.modalEdit = false;
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        }
        this.modal.confirm(option);
    }

    startUser(user) {
        let option = {
            title: "敏感",
            content: "你确认启用此用户吗？",
            onOk: () => {
                this.loading = true;
                user.isValidate = true;
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success("用户启用成功");
                    this.modalEdit = false;
                    this.getDistributors();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error("抱歉，启用失败");
                    this.modalEdit = false;
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        }
        this.modal.confirm(option);
    }

    stopUser(user) {
        let option = {
            title: "危险",
            content: "你确认要停用此账户吗（不会删除）？",
            onOk: () => {
                this.loading = true;
                user.isValidate = false;
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success("用户停用成功");
                    this.modalEdit = false;
                    this.getDistributors();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error("抱歉，停用失败");
                    this.modalEdit = false;
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        }
        this.modal.confirm(option);
    }

    viewOk() {
        this.modalVisible3 = false;
    }

    sort(field: string, value: any) {
        this.validate_distributors = _.orderBy(this.validate_distributors, [field], [value == 'ascend' ? 'asc' : 'desc']);
        this.novalidate_distributors = _.orderBy(this.novalidate_distributors, [field], [value == 'ascend' ? 'asc' : 'desc']);
    }

    onSearch() {
        this.loading = true;
        this.handleValidateDatas();
        if (!this.q.term) {
            this.handleValidateDatas();
            this.loading = false;
            return;
        }
        if (this.q.status == 'validate') {
            this.validate_distributors = this.validate_distributors.filter(vf => {
                return vf.userName.indexOf(this.q.term) != -1 ||
                    vf.nickName.indexOf(this.q.term) != -1 ||
                    vf.phone.indexOf(this.q.term) != -1 ||
                    vf.province.indexOf(this.q.term) != -1 ||
                    vf.city.indexOf(this.q.term) != -1 ||
                    vf.area.indexOf(this.q.term) != -1;
            });
        } else {
            this.novalidate_distributors = this.novalidate_distributors.filter(vf => {
                return vf.userName.indexOf(this.q.term) != -1 ||
                    vf.nickName.indexOf(this.q.term) != -1 ||
                    vf.phone.indexOf(this.q.term) != -1 ||
                    vf.province.indexOf(this.q.term) != -1 ||
                    vf.city.indexOf(this.q.term) != -1 ||
                    vf.area.indexOf(this.q.term) != -1;
            });
        }
        this.loading = false;
    }

    dataChange(e) {

    }

    pageChange(e) {

    }

    ngOnDestroy(): void {
    }
}
