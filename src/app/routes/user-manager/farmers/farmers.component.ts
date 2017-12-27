import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { DCDataService } from '../../../services/data.service';
import { DCAuthService } from '../../../services/auth.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';

@Component({
    selector: 'app-user-farmer',
    templateUrl: './farmers.component.html',
    styleUrls: ['./farmers.component.less']
})
export class UserFarmerManagerComponent implements OnInit, OnDestroy {
    roles;
    farmerRole;
    farmers;
    constructor(public msg: NzMessageService,private dataservice:DCDataService,private auth:DCAuthService) {}

    ngOnInit() {
        this.roles = this.auth.roles;
        this.farmerRole = this.roles.filter(f=>{
            return f.name == 'farmer';
        })[0];
        this.getFarmers(); 
    }

    getFarmers(){
        this.dataservice.getUsersByRole(this.farmerRole.id).then((fs:any)=>{
            this.farmers = fs.json();
            console.info(this.farmers);
        });
    }

    ngOnDestroy(): void {
    }
}
