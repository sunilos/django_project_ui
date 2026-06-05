import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { BaseListComponent } from '../base/base-list.component';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css'
})
export class RoleListComponent extends BaseListComponent implements OnInit {

  constructor(private roleService: RoleService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  editRole(role: any): void {
    this.router.navigate(['/role', role.id], { state: role });
  }

  ngOnInit(): void {
    let _self = this;
    this.roleService.get(
      (response: any) => {
        _self.formData.listdata = response.data;
        _self.formData.error = response.error;
        _self.formData.message = response.message;
        console.log('Role response:', response);
        _self.refresh();
      },
      (err: any) => console.error('Role failed:', err)
    );
  }
}
