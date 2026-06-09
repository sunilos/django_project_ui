import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService, Faculty } from '../services/faculty.service';
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

  readonly genderOptions = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private facultyService: FacultyService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
    this.form = this.buildForm();
  }

  protected override buildForm(): FormGroup {
    return this.fb.group({
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
    const college = this.preloadData?.colleges?.find((c: any) => c.id === id);
    this.form.patchValue({ collegeName: college?.value ?? '' });
  }

  onCourseChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const course = this.preloadData?.courses?.find((c: any) => c.id === id);
    this.form.patchValue({ courseName: course?.value ?? '' });
  }

  onSubjectChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const subject = this.preloadData?.subjects?.find((s: any) => s.id === id);
    this.form.patchValue({ subjectName: subject?.value ?? '' });
  }

  protected override getBody(): Faculty {
    const v = this.form.value;
    return { id: this.entityId ?? 0, ...v, dob: v.dob || null };
  }
  protected override getService() { return this.facultyService; }
}
