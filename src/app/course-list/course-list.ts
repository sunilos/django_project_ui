import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { BaseListComponent } from '../base/base-list.component';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseListComponent extends BaseListComponent implements OnInit {

  constructor(private courseService: CourseService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  editCourse(course: any): void {
    this.router.navigate(['/course', course.id], { state: course });
  }

  ngOnInit(): void {
    this.courseService.get(
      (response: any) => {
        this.formData.listdata = response.data;
        this.formData.error = response.error;
        this.formData.message = response.message;
        this.refresh();
      },
      (err: any) => console.error('Course failed:', err)
    );
  }
}
