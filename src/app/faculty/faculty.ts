import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService, Faculty } from '../services/faculty.service';
import { CollegeService, College } from '../services/college.service';
import { CourseService, Course } from '../services/course.service';
import { SubjectService, Subject } from '../services/subject.service';

@Component({
  selector: 'app-faculty',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './faculty.html',
  styleUrl: './faculty.css'
})
export class FacultyComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  facultyId: number | null = null;
  loading = false;
  saving = false;
  deleting = false;
  errorMessage = '';

  colleges: College[] = [];
  courses: Course[] = [];
  subjects: Subject[] = [];

  readonly genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private facultyService: FacultyService,
    private collegeService: CollegeService,
    private courseService: CourseService,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      address: [''],
      gender: [''],
      dob: [''],
      college_ID: ['', Validators.required],
      collegeName: [''],
      course_ID: ['', Validators.required],
      courseName: [''],
      subject_ID: ['', Validators.required],
      subjectName: ['']
    });
  }

  ngOnInit(): void {
    this.loadDropdowns();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.facultyId = +id;

    const state = isPlatformBrowser(this.platformId) ? history.state as Faculty | undefined : undefined;
    if (state?.['firstName']) {
      this.patchForm(state);
    } else {
      this.loading = true;
      this.facultyService.getById<Faculty>(
        this.facultyId,
        (faculty) => { this.loading = false; this.patchForm(faculty); },
        (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Failed to load faculty.';
        }
      );
    }
  }

  private loadDropdowns(): void {
    this.collegeService.get(
      (r: any) => { this.colleges = r.data ?? []; }, () => {}
    );
    this.courseService.get(
      (r: any) => { this.courses = r.data ?? []; }, () => {}
    );
    this.subjectService.get(
      (r: any) => { this.subjects = r.data ?? []; }, () => {}
    );
  }

  private patchForm(f: Faculty | any): void {
    this.form.patchValue({
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      mobileNumber: f.mobileNumber,
      address: f.address ?? '',
      gender: f.gender ?? '',
      dob: f.dob ?? '',
      college_ID: f.college_ID,
      collegeName: f.collegeName,
      course_ID: f.course_ID,
      courseName: f.courseName,
      subject_ID: f.subject_ID,
      subjectName: f.subjectName
    });
  }

  onCollegeChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const college = this.colleges.find(c => c.id === id);
    this.form.patchValue({ collegeName: college?.name ?? '' });
  }

  onCourseChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const course = this.courses.find(c => c.id === id);
    this.form.patchValue({ courseName: course?.name ?? '' });
  }

  onSubjectChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const subject = this.subjects.find(s => s.id === id);
    this.form.patchValue({ subjectName: subject?.subjectName ?? '' });
  }

  get title(): string {
    return this.isEditMode ? 'Edit Faculty' : 'Add Faculty';
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    const body: Faculty = { id: this.facultyId ?? 0, ...this.form.value };
    const onSuccess = () => this.router.navigate(['/faculty']);
    const onError = (err: any) => {
      this.saving = false;
      this.errorMessage = err?.error?.message || 'Save failed. Please try again.';
    };

    if (this.isEditMode && this.facultyId) {
      this.facultyService.update(this.facultyId, body, onSuccess, onError);
    } else {
      this.facultyService.add(body, onSuccess, onError);
    }
  }

  onDelete(): void {
    if (!this.facultyId || this.deleting) return;
    this.deleting = true;
    this.errorMessage = '';

    this.facultyService.delete(
      this.facultyId,
      () => this.router.navigate(['/faculty']),
      (err: any) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Delete failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/faculty']);
  }
}
