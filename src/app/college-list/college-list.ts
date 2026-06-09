import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollegeService } from '../services/college.service';
import { BaseListComponent } from '../base/base-list.component';
import type { BaseService } from '../services/base.service';

@Component({
  selector: 'app-college-list',
  imports: [CommonModule],
  templateUrl: './college-list.html',
  styleUrl: './college-list.css'
})
export class CollegeListComponent extends BaseListComponent {

  protected override pageUrl = '/college';

  constructor(private collegeService: CollegeService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  protected override getService(): BaseService { return this.collegeService; }
}
