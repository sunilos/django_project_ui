import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { BaseListComponent } from '../base/base-list.component';

@Component({
  selector: 'app-subject-list',
  imports: [CommonModule],
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.css'
})
export class SubjectListComponent extends BaseListComponent implements OnInit {

  constructor(private subjectService: SubjectService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  editSubject(subject: any): void {
    this.router.navigate(['/subject', subject.id], { state: subject });
  }

  ngOnInit(): void {
    this.subjectService.get(
      (response: any) => {
        this.formData.listdata = response.data;
        this.formData.error = response.error;
        this.formData.message = response.message;
        this.refresh();
      },
      (err: any) => console.error('Subject fetch failed:', err)
    );
  }
}
