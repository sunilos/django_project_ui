import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { BaseListComponent } from '../base/base-list.component';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-course-list',
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseListComponent extends BaseListComponent {

  protected override pageUrl = '/course';

  constructor(private courseService: CourseService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  protected override getService(): BaseService { return this.courseService; }
}
