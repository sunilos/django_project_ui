import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarksheetService, Marksheet } from '../services/marksheet.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-marksheet',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marksheet.html',
  styleUrl: './marksheet.css'
})
export class MarksheetComponent extends BaseComponent {

  protected override listUrl = '/marksheets';
  override get title(): string { return this.isEditMode ? 'Edit Marksheet' : 'Add Marksheet'; }

  constructor(
    private fb: FormBuilder,
    private marksheetService: MarksheetService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
    this.form = this.buildForm();
  }

  protected override buildForm(): FormGroup {
    return this.fb.group({
      rollNumber: ['', Validators.required],
      physics: ['', [Validators.required, Validators.min(0)]],
      chemistry: ['', [Validators.required, Validators.min(0)]],
      maths: ['', [Validators.required, Validators.min(0)]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      student_id: ['', Validators.required]
    });
  }

  protected override populateForm(m: any): void {
    this.form.patchValue({
      rollNumber: m.rollNumber,
      physics: m.physics,
      chemistry: m.chemistry,
      maths: m.maths,
      year: m.year,
      student_id: m.student_id
    });
  }

  get total(): number {
    const v = this.form.value;
    return (+(v.physics) || 0) + (+(v.chemistry) || 0) + (+(v.maths) || 0);
  }

  get percentage(): string {
    return ((this.total / 300) * 100).toFixed(2);
  }

  protected override getBody(): Marksheet {
    const v = this.form.value;
    return { id: this.entityId ?? 0, ...v };
  }

  protected override getService() { return this.marksheetService; }
}
