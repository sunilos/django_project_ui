import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService, Student } from '../services/student.service';
import { College } from '../services/college.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-student',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.html',
  styleUrl: './student.css'
})
export class StudentComponent extends BaseComponent {

  protected override listUrl = '/students';
  override get title(): string { return this.isEditMode ? 'Edit Student' : 'Add Student'; }

  colleges: College[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
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
      dob: [''],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      college_ID: ['', Validators.required],
      collegeName: ['']
    });
  }

  protected override populateForm(s: any): void {
    this.form.patchValue({
      firstName: s.firstName, lastName: s.lastName, dob: s.dob ?? '',
      mobileNumber: s.mobileNumber, email: s.email,
      college_ID: s.college_ID, collegeName: s.collegeName
    });
  }

  onCollegeChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const college = this.colleges.find(c => c.id === id);
    this.form.patchValue({ collegeName: college?.name ?? '' });
  }

  protected override getBody(): Student { return { id: this.entityId ?? 0, ...this.form.value }; }
  protected override getService() { return this.studentService; }
}
