import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService, Faculty } from '../services/faculty.service';
import { CollegeService, College } from '../services/college.service';
import { CourseService, Course } from '../services/course.service';
import { SubjectService, Subject } from '../services/subject.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-faculty',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './faculty.html',
  styleUrl: './faculty.css'
})
export class FacultyComponent extends BaseComponent {

  protected override listUrl = '/faculty';
  override get title(): string { return this.isEditMode ? 'Edit Faculty' : 'Add Faculty'; }

  form: FormGroup;
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
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
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

  protected override loadDropdowns(): void {
    this.collegeService.get((r: any) => { this.colleges = r.data ?? []; }, () => {});
    this.courseService.get((r: any) => { this.courses = r.data ?? []; }, () => {});
    this.subjectService.get((r: any) => { this.subjects = r.data ?? []; }, () => {});
  }

  protected override populateForm(f: any): void {
    this.form.patchValue({
      firstName: f.firstName, lastName: f.lastName, email: f.email,
      mobileNumber: f.mobileNumber, address: f.address ?? '',
      gender: f.gender ?? '', dob: f.dob ?? '',
      college_ID: f.college_ID, collegeName: f.collegeName,
      course_ID: f.course_ID, courseName: f.courseName,
      subject_ID: f.subject_ID, subjectName: f.subjectName
    });
  }

  onCollegeChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.form.patchValue({ collegeName: this.colleges.find(c => c.id === id)?.name ?? '' });
  }

  onCourseChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.form.patchValue({ courseName: this.courses.find(c => c.id === id)?.name ?? '' });
  }

  onSubjectChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.form.patchValue({ subjectName: this.subjects.find(s => s.id === id)?.subjectName ?? '' });
  }

  protected override getBody(): Faculty { return { id: this.entityId ?? 0, ...this.form.value }; }
  protected override getService() { return this.facultyService; }
}
