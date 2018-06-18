import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DCDataService } from '../../../../services/data.service';
import { DCAuthService } from '../../../../services/auth.service';
import { DeviceDataService } from '../../../../services/device.data.service';


@Component({
    selector: 'app-distributors-detail',
    templateUrl: './detail.component.html'
})
export class DistributorsDetailComponent implements OnInit {
    q = {
        ps: 10
    }
    distributorId: string;
    user;
    distributor;
    goods;
    currentGoods;
    modalView = false;
    loading = false;

    constructor(public msg: NzMessageService,
        private modal: NzModalService,
        private dataservice: DCDataService,
        private auth: DCAuthService,
        private dds: DeviceDataService,
        public route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.distributorId = this.route.snapshot.params['id'];
        this.loadData();
    }

    viewGoods(goods) {
        this.currentGoods = goods;
        this.currentGoods.photos_arr = this.currentGoods.photos.split(',');
        this.modalView = true;
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
                    this.loadData();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error("抱歉，启用失败");
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
                    this.loadData();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error("抱歉，停用失败");
                });
            },
            onCancel: () => {

            }
        }
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
                    this.loadData();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，开通分享失败');
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
                    this.loadData();
                }).catch(err => {
                    this.loading = false;
                    this.msg.error('抱歉，关闭分享失败');
                });
            },
            onCancel: () => {

            }
        };
        this.modal.confirm(option);
    }

    loadData() {
        this.dataservice.getUser(this.distributorId).then((res: any) => {
            console.info(res.json());
            this.user = res.json();
            this.dataservice.getDistributorById(this.user.id).then((res_dis: any) => {
                this.distributor = res_dis.json();
                console.info(this.distributor)
                this.dataservice.getDistributorGoods(this.distributor.id).then((res_goods: any) => {
                    console.info(res_goods.json())
                    this.goods = res_goods.json();
                })
            })
        })
    }

}
