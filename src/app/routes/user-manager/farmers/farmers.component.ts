import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import { DeviceDataService } from '../../../services/device.data.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';
import { DeviceSelectorComponent } from '../../device-manager/device-selector/device-selector';



@Component({
    selector: 'app-user-farmer',
    templateUrl: './farmers.component.html'
})
export class UserFarmerManagerComponent implements OnInit, OnDestroy {
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
    farmerRole;
    farmers = [];
    validate_farmers = [];
    novalidate_farmers = [];
    currentFarmer;
    editFarmer;

    options = {};
    constructor(public msg: NzMessageService,
        private modal: NzModalService,
        private dataservice: DCDataService,
        private auth: DCAuthService,
        private dds: DeviceDataService
    ) { }

    ngOnInit() {
        this.roles = this.auth.roles;
        this.farmerRole = this.roles.filter(f => {
            return f.name == 'farmer';
        })[0];
        this.getFarmers();
    }

    getFarmers() {
        this.loading = true;
        this.dataservice.getUsersByRole(this.farmerRole.id).then((fs: any) => {
            this.farmers = fs.json();
            this.farmers.forEach(f => {
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
        this.validate_farmers = this.farmers.filter(f => {
            return f.isValidate;
        });
        this.novalidate_farmers = this.farmers.filter(f => {
            return !f.isValidate;
        });
    }

    view(f) {
        this.currentFarmer = f;
        this.modalVisible3 = true;
    }
    showEditModal(f) {
        this.editFarmer = f;
        this.modalEdit = true;
    }

    doEditfarmer() {
        let option = {
            title: "敏感",
            content: "你确认要变更此用户信息吗？",
            onOk: () => {
                this.loading = true;
                this.dataservice.editUser(this.editFarmer).then(e => {
                    this.loading = false;
                    this.msg.success("变更用户信息成功");
                    this.modalEdit = false;
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
            content: "你确认已经为此账户绑定设备并将此用户启用吗？",
            onOk: () => {
                this.loading = true;
                user.isValidate = true;
                this.dataservice.editUser(user).then(e => {
                    this.loading = false;
                    this.msg.success("用户启用成功");
                    this.modalEdit = false;
                    this.getFarmers();
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
                    this.getFarmers();
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
        this.validate_farmers = _.orderBy(this.validate_farmers, [field], [value == 'ascend' ? 'asc' : 'desc']);
        this.novalidate_farmers = _.orderBy(this.novalidate_farmers, [field], [value == 'ascend' ? 'asc' : 'desc']);
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
            this.validate_farmers = this.validate_farmers.filter(vf => {
                return vf.userName.indexOf(this.q.term) != -1 ||
                    vf.nickName.indexOf(this.q.term) != -1 ||
                    vf.phone.indexOf(this.q.term) != -1 ||
                    vf.province.indexOf(this.q.term) != -1 ||
                    vf.city.indexOf(this.q.term) != -1 ||
                    vf.area.indexOf(this.q.term) != -1;
            });
        } else {
            this.novalidate_farmers = this.novalidate_farmers.filter(vf => {
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

    removeBindDevice(farmer) {
        if (!farmer.deviceId) {
            this.msg.error("此用户还没有绑定设备");
            return;
        }
        let option = {
            title: "危险",
            content: "你确认要解除此用户绑定的设备吗？",
            onOk: async () => {
                this.loading = true;
                let dr: any = await this.dds.getDeviceById(farmer.deviceId);
                let device = dr.json();
                if (!device) {
                    this.msg.error("系统没有找到此设备信息");
                    return;
                }
                let utr: any = await this.dds.loginToJZY(device);
                let usertoken = utr.json();
                await this.dds.unBindingToJZY(device, usertoken.token);
                device.username = null;
                device.password = null;
                device.isUse = false;
                await this.dds.editDevice(device);
                farmer.deviceId = null;
                await this.dataservice.editUser(farmer);
                this.loading = false;
                this.msg.success("解除绑定设备成功");
                this.getFarmers();
            },
            onCancel: () => {

            }
        }
        this.modal.confirm(option);
    }

    async bindDevice(farmer) {
        if (farmer.deviceId) {
            this.msg.info("此用户已经绑定了设备，不可重复绑定");
            return;
        }
        let devices: any = await this.dds.getDevicesByIsUse(false);
        this.options = {
            wrapClassName: 'modal-lg',
            content: DeviceSelectorComponent,
            footer: false,
            componentParams: {
                devices: devices.json(),
                farmer: farmer
            }
        };
        this.modal.open(this.options).subscribe(result => {
            console.info(result);
            if (result == 'success') {
                this.getFarmers();
            }
            // this.msg.info(`subscribe status: ${JSON.stringify(result)}`);
        });
    }

    dataChange(e) {

    }

    pageChange(e) {

    }

    ngOnDestroy(): void {
    }
}
