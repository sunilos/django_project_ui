import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { CollegeService, College } from '../services/college.service';

@Component({
  selector: 'app-student',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  studentId: number | null = null;
  loading = false;
  saving = false;
  deleting = false;
  errorMessage = '';
  colleges: College[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private collegeService: CollegeService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [''],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      college_ID: ['', Validators.required],
      collegeName: ['']
    });
  }

  ngOnInit(): void {
    this.loadColleges();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.studentId = +id;

    const state = isPlatformBrowser(this.platformId) ? history.state as Student | undefined : undefined;
    if (state?.['firstName']) {
      this.patchForm(state);
    } else {
      this.loading = true;
      this.studentService.getById<Student>(
        this.studentId,
        (student) => {
          this.loading = false;
          this.patchForm(student);
        },
        (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Failed to load student.';
        }
      );
    }
  }

  private loadColleges(): void {
    this.collegeService.get(
      (response: any) => { this.colleges = response.data ?? []; },
      () => {}
    );
  }

  private patchForm(s: Student | any): void {
    this.form.patchValue({
      firstName: s.firstName,
      lastName: s.lastName,
      dob: s.dob ?? '',
      mobileNumber: s.mobileNumber,
      email: s.email,
      college_ID: s.college_ID,
      collegeName: s.collegeName
    });
  }

  onCollegeChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const college = this.colleges.find(c => c.id === id);
    this.form.patchValue({ collegeName: college?.name ?? '' });
  }

  get title(): string {
    return this.isEditMode ? 'Edit Student' : 'Add Student';
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    const body: Student = { id: this.studentId ?? 0, ...this.form.value };
    const onSuccess = () => this.router.navigate(['/students']);
    const onError = (err: any) => {
      this.saving = false;
      this.errorMessage = err?.error?.message || 'Save failed. Please try again.';
    };

    if (this.isEditMode && this.studentId) {
      this.studentService.update(this.studentId, body, onSuccess, onError);
    } else {
      this.studentService.add(body, onSuccess, onError);
    }
  }

  onDelete(): void {
    if (!this.studentId || this.deleting) return;
    this.deleting = true;
    this.errorMessage = '';

    this.studentService.delete(
      this.studentId,
      () => this.router.navigate(['/students']),
      (err: any) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Delete failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
