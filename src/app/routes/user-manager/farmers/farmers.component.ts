import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';

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
    constructor(public msg: NzMessageService, private modal: NzModalService, private dataservice: DCDataService, private auth: DCAuthService) { }

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

    handleValidateDatas(){
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
    showEditModal(f){
        this.editFarmer = f;
        this.modalEdit = true;
    }

    doEditfarmer(){
        let option = {
            title: "敏感",
            content: "你确认要变更此用户信息吗？",
            onOk: () => {
                this.loading = true;
                this.dataservice.editUser(this.editFarmer).then(e=>{
                    this.loading = false;
                    this.msg.success("变更用户信息成功");
                    this.modalEdit = false;
                }).catch(err=>{
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

    startUser(user){
        let option = {
            title: "敏感",
            content: "你确认已经为此账户绑定设备并将此用户启用吗？",
            onOk: () => {
                this.loading = true;
                user.isValidate = true;
                this.dataservice.editUser(user).then(e=>{
                    this.loading = false;
                    this.msg.success("用户启用成功");
                    this.modalEdit = false;
                    this.getFarmers();
                }).catch(err=>{
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

    stopUser(user){
        let option = {
            title: "危险",
            content: "你确认要停用此账户吗（不会删除）？",
            onOk: () => {
                this.loading = true;
                user.isValidate = false;
                this.dataservice.editUser(user).then(e=>{
                    this.loading = false;
                    this.msg.success("用户停用成功");
                    this.modalEdit = false;
                    this.getFarmers();
                }).catch(err=>{
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
        if(!this.q.term){
            this.handleValidateDatas();
            this.loading = false;
            return;
        }
        if (this.q.status == 'validate') {
            this.validate_farmers = this.validate_farmers.filter(vf => {
                return  vf.userName.indexOf(this.q.term) != -1 ||
                        vf.nickName.indexOf(this.q.term) != -1 ||
                        vf.phone.indexOf(this.q.term) != -1 ||
                        vf.province.indexOf(this.q.term) != -1 ||
                        vf.city.indexOf(this.q.term) != -1 ||
                        vf.area.indexOf(this.q.term) != -1;
            });
        } else {
            this.novalidate_farmers = this.novalidate_farmers.filter(vf => {
                return  vf.userName.indexOf(this.q.term) != -1 ||
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
