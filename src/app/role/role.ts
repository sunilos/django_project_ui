import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService, Role } from '../services/role.service';

@Component({
  selector: 'app-role',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role.html',
  styleUrl: './role.css'
})
export class RoleComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  roleId: number | null = null;
  saving = false;
  deleting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.roleId = +id;

    const state = isPlatformBrowser(this.platformId) ? history.state as Role | undefined : undefined;
    if (state?.['name']) {
      this.form.patchValue({ name: state['name'], description: state['description'] ?? '' });
    } else {
      this.loading = true;
      this.roleService.getById<Role>(
        this.roleId,
        (role) => {
          this.loading = false;
          this.form.patchValue({ name: role.name, description: role.description ?? '' });
        },
        (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Failed to load role.';
        }
      );
    }
  }

  get title(): string {
    return this.isEditMode ? 'Edit Role' : 'Add Role';
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    const body: Role = { id: this.roleId ?? 0, ...this.form.value };
    const onSuccess = () => this.router.navigate(['/roles']);
    const onError = (err: any) => {
      this.saving = false;
      this.errorMessage = err?.error?.message || 'Save failed. Please try again.';
    };

    if (this.isEditMode && this.roleId) {
      this.roleService.update(this.roleId, body, onSuccess, onError);
    } else {
      this.roleService.add(body, onSuccess, onError);
    }
  }

  onDelete(): void {
    if (!this.roleId || this.deleting) return;
    this.deleting = true;
    this.errorMessage = '';

    this.roleService.delete(
      this.roleId,
      () => this.router.navigate(['/roles']),
      (err: any) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Delete failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }
}
