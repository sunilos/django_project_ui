import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { BaseListComponent } from '../base/base-list.component';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent extends BaseListComponent implements OnInit {

  constructor(private studentService: StudentService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  editStudent(student: any): void {
    this.router.navigate(['/student', student.id], { state: student });
  }

  ngOnInit(): void {
    this.studentService.get(
      (response: any) => {
        this.formData.listdata = response.data;
        this.formData.error = response.error;
        this.formData.message = response.message;
        this.refresh();
      },
      (err: any) => console.error('Student fetch failed:', err)
    );
  }
}
