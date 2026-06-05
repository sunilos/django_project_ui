import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService, Subject } from '../services/subject.service';
import { CourseService, Course } from '../services/course.service';

@Component({
  selector: 'app-subject',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css'
})
export class SubjectComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  subjectId: number | null = null;
  loading = false;
  saving = false;
  deleting = false;
  errorMessage = '';
  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.form = this.fb.group({
      subjectName: ['', Validators.required],
      subjectDescription: [''],
      dob: [''],
      course_ID: ['', Validators.required],
      courseName: ['']
    });
  }

  ngOnInit(): void {
    this.loadCourses();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.subjectId = +id;

    const state = isPlatformBrowser(this.platformId) ? history.state as Subject | undefined : undefined;
    if (state?.['subjectName']) {
      this.patchForm(state);
    } else {
      this.loading = true;
      this.subjectService.getById<Subject>(
        this.subjectId,
        (subject) => {
          this.loading = false;
          this.patchForm(subject);
        },
        (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Failed to load subject.';
        }
      );
    }
  }

  private loadCourses(): void {
    this.courseService.get(
      (response: any) => { this.courses = response.data ?? []; },
      () => {}
    );
  }

  private patchForm(s: Subject | any): void {
    this.form.patchValue({
      subjectName: s.subjectName,
      subjectDescription: s.subjectDescription ?? '',
      dob: s.dob ?? '',
      course_ID: s.course_ID,
      courseName: s.courseName
    });
  }

  onCourseChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const course = this.courses.find(c => c.id === id);
    this.form.patchValue({ courseName: course?.name ?? '' });
  }

  get title(): string {
    return this.isEditMode ? 'Edit Subject' : 'Add Subject';
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    const body: Subject = { id: this.subjectId ?? 0, ...this.form.value };
    const onSuccess = () => this.router.navigate(['/subjects']);
    const onError = (err: any) => {
      this.saving = false;
      this.errorMessage = err?.error?.message || 'Save failed. Please try again.';
    };

    if (this.isEditMode && this.subjectId) {
      this.subjectService.update(this.subjectId, body, onSuccess, onError);
    } else {
      this.subjectService.add(body, onSuccess, onError);
    }
  }

  onDelete(): void {
    if (!this.subjectId || this.deleting) return;
    this.deleting = true;
    this.errorMessage = '';

    this.subjectService.delete(
      this.subjectId,
      () => this.router.navigate(['/subjects']),
      (err: any) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Delete failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/subjects']);
  }
}
