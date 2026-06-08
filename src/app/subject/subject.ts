import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService, Subject } from '../services/subject.service';
import { CourseService, Course } from '../services/course.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-subject',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css'
})
export class SubjectComponent extends BaseComponent {

  protected override listUrl = '/subjects';
  override get title(): string { return this.isEditMode ? 'Edit Subject' : 'Add Subject'; }

  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private courseService: CourseService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
    this.form = this.buildForm();
  }

  protected override buildForm(): FormGroup {
    return this.fb.group({
      subjectName: ['', Validators.required],
      subjectDescription: [''],
      dob: [''],
      course_ID: ['', Validators.required],
      courseName: ['']
    });
  }

  protected override loadDropdowns(): void {
    this.courseService.get((r: any) => { this.courses = r.data ?? []; }, () => {});
  }

  protected override populateForm(s: any): void {
    this.form.patchValue({
      subjectName: s.subjectName, subjectDescription: s.subjectDescription ?? '',
      dob: s.dob ?? '', course_ID: s.course_ID, courseName: s.courseName
    });
  }

  onCourseChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const course = this.courses.find(c => c.id === id);
    this.form.patchValue({ courseName: course?.name ?? '' });
  }

  protected override getBody(): Subject { return { id: this.entityId ?? 0, ...this.form.value }; }
  protected override getService() { return this.subjectService; }
}
