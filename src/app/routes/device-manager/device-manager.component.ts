import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DCDataService } from '../../services/data.service';
import { DeviceDataService } from '../../services/device.data.service';
import * as _ from "lodash";
import { isSameDay } from 'date-fns';
import { Device } from '../../models';


@Component({
    selector: 'app-device-manager',
    templateUrl: './device-manager.component.html'
})
export class DeviceManagerComponent implements OnInit {
    q: any = {
        pi: 1,
        ps: 5,
        updatedAt: '',
        status: 'used',
        term:''
    };

    devices: Array<Device> = [];
    used_devices: Array<Device> = [];
    unused_devices: Array<Device> = [];
    loading = false;
    modalVisible1 = false;
    modalVisible2 = false;
    currentDevice:Device;
    editDevice:Device;

    constructor(public msg: NzMessageService, private modal: NzModalService, private dataservice: DCDataService, private dds: DeviceDataService, private router: Router) {
        
    }

    ngOnInit() {
        this.refreshData();
    }

    async refreshData() {
        this.loading = true;
        let dr = await this.getAllDevices();
        this.devices = dr.json();
        this.handleValidateDatas();
        this.loading = false;
    }

    handleValidateDatas() {
        this.used_devices = this.devices.filter(f => {
            return f.isUse;
        });
        this.unused_devices = this.devices.filter(f => {
            return !f.isUse;
        });
    }

    sort(field: string, value: any) {
        this.used_devices = _.orderBy(this.used_devices, [field], [value == 'ascend' ? 'asc' : 'desc']);
        this.unused_devices = _.orderBy(this.unused_devices, [field], [value == 'ascend' ? 'asc' : 'desc']);
    }

    onSearch() {
        this.loading = true;
        this.handleValidateDatas();
        if(!this.q.term){
            this.handleValidateDatas();
            this.loading = false;
            return;
        }
        if (this.q.status == 'used') {
            this.used_devices = this.used_devices.filter(vf => {
                return  vf.productName.indexOf(this.q.term) != -1 ||
                        vf.productType.indexOf(this.q.term) != -1;
            });
        } else {
            this.unused_devices = this.unused_devices.filter(vf => {
                return  vf.productName.indexOf(this.q.term) != -1 ||
                vf.productType.indexOf(this.q.term) != -1;
            });
        }
        this.loading = false;
    }

    changeToUnused(){
        let option = {
            title: "提示",
            content: "请前往农户管理页面，找到对应农户并解绑此设备"
        }
        this.modal.info(option);
    }

    view(device){
        this.currentDevice = device;
        this.modalVisible1 = true;
    }

    showEditModal(device){
        this.editDevice = device;
        this.modalVisible2 = true;
    }

    getAllDevices(): any {
        return this.dds.getAllDevice();
    }

    doEditDevice(){
        let option = {
            title: "确认",
            content: "你确认审核数据并修改此设备信息吗？",
            onOk: () => {
                this.loading = true;
                this.dds.editDevice(this.editDevice).then(()=>{
                    this.msg.success('修改设备成功');
                    this.loading = false;
                    this.modalVisible2 = false;
                    this.refreshData();
                }).catch(err=>{
                    this.msg.error('修改设备失败');
                    this.loading = false;
                });
            },
            onCancel: () => {
                
            }
        }
        this.modal.confirm(option);
    }

    deleteDevice(device){
        let option = {
            title: "危险",
            content: "你确认要永久删除此设备吗？",
            onOk: () => {
                this.loading = true;
                this.dds.deleteDevice(device).then(()=>{
                    this.msg.success('删除设备成功');
                    this.loading = false;
                    this.refreshData();
                }).catch(err=>{
                    this.msg.error('删除设备失败');
                    this.loading = false;
                });
            },
            onCancel: () => {
                
            }
        }
        this.modal.confirm(option);
    }

    dataChange(e) {

    }

    pageChange(e) {

    }

}
