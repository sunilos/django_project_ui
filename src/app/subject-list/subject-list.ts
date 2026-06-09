import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { BaseListComponent } from '../base/base-list.component';
import type { BaseService } from '../services/base.service';

@Component({
  selector: 'app-subject-list',
  imports: [CommonModule],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.css'
})
export class SubjectListComponent extends BaseListComponent {

  protected override pageUrl = '/subject';

  constructor(private subjectService: SubjectService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  protected override getService(): BaseService { return this.subjectService; }
}
