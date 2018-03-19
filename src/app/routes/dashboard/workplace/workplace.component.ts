import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { getTimeDistance, yuan, fixedZero } from '@delon/abc';
import { getNotice, getActivities } from '../../../../../_mock/api.service';
import { getFakeChartData } from '../../../../../_mock/chart.service';
import { DCAuthService } from '../../../services/auth.service';
import { DCDataService } from '../../../services/data.service';


@Component({
  selector: 'app-dashboard-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less']
})
export class DashboardWorkplaceComponent implements OnInit, OnDestroy {
  notice: any[] = [];
  activities: any[] = [];
  radarData: any[] = [];
  loading = true;
  user;
  source;

  // region: mock data
  links = [
    {
      title: '用户审核',
      href: '/verify-user',
    },
    {
      title: '商品审核',
      href: '/verify-goods',
    },
    {
      title: '农户管理',
      href: '/user-manager-farmer',
    },
    {
      title: '专家管理',
      href: '/user-manager-expert',
    },
    {
      title: '经销商管理',
      href: '/user-manager-distributor',
    },
    {
      title: '商品列表',
      href: '/goods-manager',
    },
  ];

  // endregion

  constructor(public msg: NzMessageService, private auth: DCAuthService, private dataservice: DCDataService, private router: Router) {
    this.user = this.auth.user;
    this.dataservice.dashboard().then((data: any) => {
      this.source = data.json();
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.notice = getNotice();
      this.activities = getActivities().map((item: any) => {
        item.template = item.template.split(/@\{([^{}]*)\}/gi).map((key: string) => {
          if (item[key]) return `<a>${item[key].name}</a>`;
          return key;
        });
        return item;
      });
      this.radarData = getFakeChartData.radarData;
      this.loading = false;
    }, 500);
  }

  ngOnDestroy(): void {
  }

  goOtherPage(url) {
    this.router.navigate([url]);
  }

  goAuditUser() {
    this.router.navigate(['/verify-user']);
  }

  goAuditGoods() {
    this.router.navigate(['/verify-goods']);
  }

  goDistributor() {
    this.router.navigate(['/user-manager-distributor']);
  }
}
