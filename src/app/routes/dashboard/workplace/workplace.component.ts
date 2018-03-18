import { Component, OnInit, OnDestroy } from '@angular/core';
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
      href: '',
    },
    {
      title: '商品审核',
      href: '',
    },
    {
      title: '农户管理',
      href: '',
    },
    {
      title: '专家管理',
      href: '',
    },
    {
      title: '经销商管理',
      href: '',
    },
    {
      title: '商品列表',
      href: '',
    },
  ];
  members = [
    {
      id: 'members-1',
      title: '科学搬砖组',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      link: '',
    },
    {
      id: 'members-2',
      title: '程序员日常',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      link: '',
    },
    {
      id: 'members-3',
      title: '设计天团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      link: '',
    },
    {
      id: 'members-4',
      title: '中二少女团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      link: '',
    },
    {
      id: 'members-5',
      title: '骗你学计算机',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      link: '',
    },
  ];
  // endregion

  constructor(public msg: NzMessageService, private auth: DCAuthService, private dataservice: DCDataService) {
    this.user = this.auth.user;
    this.dataservice.dashboard().then((data: any) => {
      this.source = data.json();
      console.info(this.source);
      this.source.auditGoods.forEach(g => {
        if (g.goods.photos) {
          g.goods.photos_arr = g.goods.photos.split(',')
        } else {
          g.goods.photos_arr = [];
        }
      });
    })
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
}
