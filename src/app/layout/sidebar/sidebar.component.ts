import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { DCAuthService } from '../../services/auth.service';

@Component({
  selector   : 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  user;
    constructor(public settings: SettingsService, public msgSrv: NzMessageService,private auth:DCAuthService) {
      this.user = this.auth.user;
    }
}
