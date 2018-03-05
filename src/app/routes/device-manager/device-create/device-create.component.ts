import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import { map, delay, debounceTime } from 'rxjs/operators';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { DCDataService } from '../../../services/data.service';
import { DeviceDataService } from '../../../services/device.data.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';
import { Device } from '../../../models';

@Component({
    selector: 'app-device-create',
    templateUrl: './device-create.component.html'
})
export class DeviceCreateComponent implements OnInit {
    form: FormGroup;
    loading = false;
    device: Device = new Device();

    constructor(public msg: NzMessageService, private modal: NzModalService, private dds: DeviceDataService, private dataservice: DCDataService, private router: Router, private fb: FormBuilder) {

    }

    _submitForm() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
        }
        console.log('log', this.form.value);
        if (this.form.valid) {
            this.device = this.form.value;
            const option = {
                title: '确认',
                content: '你确认审核数据并创建此设备吗？',
                onOk: () => {
                    this.loading = true;
                    this.dds.createDevice(this.device).then(() => {
                        this.msg.success('创建设备成功!');
                        this.loading = false;
                        this.router.navigate(['/device-manager']);
                    });
                },
                onCancel: () => {

                }
            };
            this.modal.confirm(option);
        } else {
            this.msg.error('失败!');
        }
    }

    getFormControl(name: string) {
        return this.form.controls[name];
    }

    ngOnInit() {
        this.form = this.fb.group({
            productName: [null, [Validators.required]],
            productType: [null, [Validators.required]],
            productKey: [null, [Validators.required]],
            productSecret: [null, [Validators.required]],
            appid: [null, [Validators.required]],
            did: [null, [Validators.required]],
            mac: [null, [Validators.required]],
            note: [null]
        }, );
    }

    resetForm($event: MouseEvent) {
        $event.preventDefault();
        this.form.reset();
        for (const key in this.form.controls) {
            this.form.controls[key].markAsPristine();
        }
    }

    //#region get form fields
    get productName() { return this.form.controls.productName; }
    get productType() { return this.form.controls.productType; }
    get productKey() { return this.form.controls.productKey; }
    get productSecret() { return this.form.controls.productSecret; }
    get appid() { return this.form.controls.appid; }
    get did() { return this.form.controls.did; }
    get mac() { return this.form.controls.mac; }
    get note() { return this.form.controls.note; }
}
