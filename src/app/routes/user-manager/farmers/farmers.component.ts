import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService,NzModalService } from 'ng-zorro-antd';
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
        userName: '',
        updatedAt: '',
        address: '',
        phone: '',
        status: 'validate',
        role: ''
    };

    sortMap: any = {};
    loading = false;
    modalVisible3 = false;
    roles;
    farmerRole;
    farmers = [];
    currentFarmer;
    constructor(public msg: NzMessageService,private modal:NzModalService,private dataservice:DCDataService,private auth:DCAuthService) {}

    ngOnInit() {
        this.roles = this.auth.roles;
        this.farmerRole = this.roles.filter(f=>{
            return f.name == 'farmer';
        })[0];
        this.getFarmers(); 
    }

    getFarmers(){
        this.loading = true;
        this.dataservice.getUsersByRole(this.farmerRole.id).then((fs:any)=>{
            this.farmers = fs.json();
            this.farmers.forEach(f => {
                this.roles.forEach(r => {
                    if (f.roleId == r.id) {
                        f.roleName = r.cName;
                    }
                });
            });
            this.loading = false;
            console.info(this.farmers);
        });
    }

    view(f){
        this.currentFarmer = f;
        this.modalVisible3 = true;
    }

    viewOk(){
        this.modalVisible3 = false;
    }

    sort(field: string, value: any) {
        this.farmers = _.orderBy(this.farmers, [field], [value == 'ascend' ? 'asc' : 'desc']);
    }

    dataChange(e){

    }

    pageChange(e){

    }

    ngOnDestroy(): void {
    }
}
