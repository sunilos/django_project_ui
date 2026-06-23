import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent extends BaseComponent {

  protected override listUrl = '/users';
  override get title(): string { return this.isEditMode ? 'Edit User' : 'Add User'; }

  roles: any[] = [];
  private readonly cdr2 = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
    this.form = this.buildForm();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.isEditMode) {
      this.form.get('password')?.setValidators(Validators.required);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  protected override loadDropdowns(): void {
    this.roleService.search({ pageNo: 1, pageSize: 100 },
      (res: any) => { this.roles = res.data ?? []; this.cdr2.markForCheck(); },
      () => {}
    );
  }

  protected override buildForm(): FormGroup {
    return this.fb.group({
      firstName:    ['', Validators.required],
      lastName:     ['', Validators.required],
      login:        ['', [Validators.required, Validators.email]],
      password:     [''],
      dob:          [''],
      role_id:      ['', Validators.required],
      mobileNumber: ['', Validators.required],
      gender:       ['Male'],
      photo:        ['']
    });
  }

  protected override populateForm(u: any): void {
    this.form.patchValue({
      firstName:    u.firstName,
      lastName:     u.lastName,
      login:        u.login,
      dob:          u.dob ?? '',
      role_id:      u.role_id,
      mobileNumber: u.mobileNumber,
      gender:       u.gender ?? 'Male',
      photo:        u.photo ?? ''
    });
  }

  protected override getBody(): User {
    const v = this.form.value;
    const body: User = {
      id:           this.entityId ?? 0,
      firstName:    v.firstName,
      lastName:     v.lastName,
      login:        v.login,
      dob:          v.dob || null,
      role_id:      v.role_id,
      mobileNumber: v.mobileNumber,
      gender:       v.gender || 'Male',
      photo:        v.photo || ''
    };
    if (v.password) body['password'] = v.password;
    return body;
  }

  protected override getService() { return this.userService; }
}
