import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { BaseListComponent } from '../base/base-list.component';
import type { BaseService } from '../services/base.service';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent extends BaseListComponent {

  protected override pageUrl = '/student';

  constructor(private studentService: StudentService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  protected override getService(): BaseService { return this.studentService; }
}
