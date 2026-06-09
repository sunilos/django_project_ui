import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { BaseListComponent } from '../base/base-list.component';
import type { BaseService } from '../services/base.service';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css'
})
export class RoleListComponent extends BaseListComponent {

  protected override pageUrl = '/role';

  constructor(private roleService: RoleService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  protected override getService(): BaseService { return this.roleService; }
}
