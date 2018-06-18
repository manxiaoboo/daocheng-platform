import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import { DeviceDataService } from '../../../services/device.data.service';
import * as _ from 'lodash';
import { isSameDay } from 'date-fns';



@Component({
    selector: 'app-user-manufacturers',
    templateUrl: './manufacturers.component.html'
})
export class UserManufacturersManagerComponent implements OnInit, OnDestroy {
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
    manufacturerRole;
    manufacturers = [];
    validate_manufacturers = [];
    novalidate_manufacturers = [];
    currentManufacturer;
    currentManufacturerUser;
    editManufacturers;

    options = {};
    constructor(public msg: NzMessageService,
        private modal: NzModalService,
        private dataservice: DCDataService,
        private auth: DCAuthService,
        private dds: DeviceDataService
    ) { }

    ngOnInit() {
        this.roles = this.auth.roles;
        this.manufacturerRole = this.roles.filter(f => {
            return f.name === 'manufacturer';
        })[0];
        this.getManufacturers();
    }

    getManufacturers() {
        this.loading = true;
        this.dataservice.getUsersByRole(this.manufacturerRole.id).then((fs: any) => {
            this.manufacturers = fs.json();
            console.info(this.manufacturers)
            this.manufacturers.forEach(f => {
                this.roles.forEach(r => {
                    if (f.roleId === r.id) {
                        f.roleName = r.cName;
                    }
                });
            });
            this.handleValidateDatas();
            this.loading = false;
        });
    }


    handleValidateDatas() {
        this.validate_manufacturers = this.manufacturers.filter(f => {
            return f.isValidate;
        });
        this.novalidate_manufacturers = this.manufacturers.filter(f => {
            return !f.isValidate;
        });
    }

    async view(f) {
        this.loading = true;
        this.currentManufacturer = f;
        const manufacturer: any = await this.dataservice.getManufacturerById(f.id);
        this.currentManufacturerUser = manufacturer.json();
        this.loading = false;
        this.modalVisible3 = true;
    }
    async showEditModal(f) {
        this.editManufacturers = f;
        this.loading = true;
        const manufacturer: any = await this.dataservice.getManufacturerById(f.id);
        this.currentManufacturerUser = manufacturer.json();
        this.loading = false;
        this.modalEdit = true;
    }

    doEditManufacturer() {
        const option = {
            title: '敏感',
            content: '你确认要变更此用户信息吗？',
            onOk: () => {
                this.loading = true;
                this.dataservice.editUser(this.editManufacturers).then(e => {
                    this.dataservice.editManufacturer(this.currentManufacturerUser).then(() => {
                        this.loading = false;
                        this.msg.success('变更用户信息成功');
                        this.modalEdit = false;
                    }).catch(err => {
                        this.loading = false;
                        this.msg.error('抱歉，变更失败');
                        this.modalEdit = false;
                        this.handleValidateDatas();
                    });
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，变更失败');
                    this.modalEdit = false;
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    startUser(user) {
        const option = {
            title: '敏感',
            content: '你确认启用此用户吗？',
            onOk: () => {
                this.loading = true;
                user.isValidate = true;
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success('用户启用成功');
                    this.modalEdit = false;
                    this.getManufacturers();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，启用失败');
                    this.modalEdit = false;
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    stopUser(user) {
        const option = {
            title: '危险',
            content: '你确认要停用此账户吗（不会删除）？',
            onOk: () => {
                this.loading = true;
                user.isValidate = false;
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success('用户停用成功');
                    this.modalEdit = false;
                    this.getManufacturers();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，停用失败');
                    this.modalEdit = false;
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    openShare(user) {
        const option = {
            title: '危险',
            content: '你确认要为此账户开通分享吗？',
            onOk: () => {
                this.loading = true;
                user.canShare = true;
                user.shareDate = new Date();
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success('开通分享成功');
                    this.getManufacturers();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，开通分享失败');
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    closeShare(user) {
        const option = {
            title: '危险',
            content: '你确认要关闭此账户的分享功能吗？',
            onOk: () => {
                this.loading = true;
                user.canShare = false;
                user.shareDate = null;
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success('关闭分享成功');
                    this.getManufacturers();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，关闭分享失败');
                    this.handleValidateDatas();
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    viewOk() {
        this.modalVisible3 = false;
    }

    sort(field: string, value: any) {
        this.validate_manufacturers = _.orderBy(this.validate_manufacturers, [field], [value === 'ascend' ? 'asc' : 'desc']);
        this.novalidate_manufacturers = _.orderBy(this.novalidate_manufacturers, [field], [value === 'ascend' ? 'asc' : 'desc']);
    }

    onSearch() {
        this.loading = true;
        this.handleValidateDatas();
        if (!this.q.term) {
            this.handleValidateDatas();
            this.loading = false;
            return;
        }
        if (this.q.status === 'validate') {
            this.validate_manufacturers = this.validate_manufacturers.filter(vf => {
                return vf.userName.indexOf(this.q.term) !== -1 ||
                    vf.nickName.indexOf(this.q.term) !== -1 ||
                    vf.phone.indexOf(this.q.term) !== -1 ||
                    vf.province.indexOf(this.q.term) !== -1 ||
                    vf.city.indexOf(this.q.term) !== -1 ||
                    vf.area.indexOf(this.q.term) !== -1;
            });
        } else {
            this.novalidate_manufacturers = this.novalidate_manufacturers.filter(vf => {
                return vf.userName.indexOf(this.q.term) !== -1 ||
                    vf.nickName.indexOf(this.q.term) !== -1 ||
                    vf.phone.indexOf(this.q.term) !== -1 ||
                    vf.province.indexOf(this.q.term) !== -1 ||
                    vf.city.indexOf(this.q.term) !== -1 ||
                    vf.area.indexOf(this.q.term) !== -1;
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
