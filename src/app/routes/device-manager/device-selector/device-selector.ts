import { Component, Input } from '@angular/core';
import { NzModalSubject, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ModalHelper } from '@delon/theme';
import { DCDataService } from '../../../services/data.service';
import { DeviceDataService } from '../../../services/device.data.service';

@Component({
    selector: 'app-model-custom',
    templateUrl: './device-selector.html'
})
export class DeviceSelectorComponent {

    @Input() devices: any;
    @Input() farmer: any;

    loading = false;

    constructor(
        private modalHelper: ModalHelper,
        private model: NzModalService,
        private msg: NzMessageService,
        private subject: NzModalSubject,
        private dataservice:DCDataService,
        private dds:DeviceDataService
    ) {
    }

    async bindDevice(device){
        this.loading = true;
        this.farmer.deviceId = device.id;
        device.isUse = true;
        device.username = this.farmer.userName;
        device.password = this.farmer.password;
        await this.dataservice.editUser(this.farmer);
        await this.dds.editDevice(device);
        this.loading = false;
        this.msg.success("绑定设备成功");
        this.subject.next('success');
        this.cancel();
    }

    ok() {
        this.subject.next(`new time: ${+new Date}`);
        this.cancel();
    }

    cancel() {
        this.subject.destroy();
    }
}
