import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeService, College } from '../services/college.service';

@Component({
  selector: 'app-college',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './college.html',
  styleUrl: './college.css'
})
export class CollegeComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  collegeId: number | null = null;
  loading = false;
  saving = false;
  deleting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private collegeService: CollegeService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.collegeId = +id;

    const state = isPlatformBrowser(this.platformId) ? history.state as College | undefined : undefined;
    if (state?.['name']) {
      this.form.patchValue({
        name: state['name'],
        address: state['address'] ?? '',
        city: state['city'] ?? '',
        state: state['state'] ?? '',
        phoneNumber: state['phoneNumber'] ?? ''
      });
    } else {
      this.loading = true;
      this.collegeService.getById<College>(
        this.collegeId,
        (college) => {
          this.loading = false;
          this.form.patchValue({
            name: college.name,
            address: college.address ?? '',
            city: college.city ?? '',
            state: college.state ?? '',
            phoneNumber: college.phoneNumber ?? ''
          });
        },
        (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Failed to load college.';
        }
      );
    }
  }

  get title(): string {
    return this.isEditMode ? 'Edit College' : 'Add College';
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    const body: College = { id: this.collegeId ?? 0, ...this.form.value };
    const onSuccess = () => this.router.navigate(['/colleges']);
    const onError = (err: any) => {
      this.saving = false;
      this.errorMessage = err?.error?.message || 'Save failed. Please try again.';
    };

    if (this.isEditMode && this.collegeId) {
      this.collegeService.update(this.collegeId, body, onSuccess, onError);
    } else {
      this.collegeService.add(body, onSuccess, onError);
    }
  }

  onDelete(): void {
    if (!this.collegeId || this.deleting) return;
    this.deleting = true;
    this.errorMessage = '';

    this.collegeService.delete(
      this.collegeId,
      () => this.router.navigate(['/colleges']),
      (err: any) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Delete failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/colleges']);
  }
}
