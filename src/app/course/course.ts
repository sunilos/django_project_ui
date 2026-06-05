import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService, Course } from '../services/course.service';

@Component({
  selector: 'app-course',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course.html',
  styleUrl: './course.css'
})
export class CourseComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  courseId: number | null = null;
  loading = false;
  saving = false;
  deleting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      duration: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEditMode = true;
    this.courseId = +id;

    const state = isPlatformBrowser(this.platformId) ? history.state as Course | undefined : undefined;
    if (state?.['name']) {
      this.form.patchValue({
        name: state['name'],
        description: state['description'] ?? '',
        duration: state['duration'] ?? ''
      });
    } else {
      this.loading = true;
      this.courseService.getById<Course>(
        this.courseId,
        (course) => {
          this.loading = false;
          this.form.patchValue({
            name: course.name,
            description: course.description ?? '',
            duration: course.duration ?? ''
          });
        },
        (err: any) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Failed to load course.';
        }
      );
    }
  }

  get title(): string {
    return this.isEditMode ? 'Edit Course' : 'Add Course';
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    const body: Course = { id: this.courseId ?? 0, ...this.form.value };
    const onSuccess = () => this.router.navigate(['/courses']);
    const onError = (err: any) => {
      this.saving = false;
      this.errorMessage = err?.error?.message || 'Save failed. Please try again.';
    };

    if (this.isEditMode && this.courseId) {
      this.courseService.update(this.courseId, body, onSuccess, onError);
    } else {
      this.courseService.add(body, onSuccess, onError);
    }
  }

  onDelete(): void {
    if (!this.courseId || this.deleting) return;
    this.deleting = true;
    this.errorMessage = '';

    this.courseService.delete(
      this.courseId,
      () => this.router.navigate(['/courses']),
      (err: any) => {
        this.deleting = false;
        this.errorMessage = err?.error?.message || 'Delete failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
