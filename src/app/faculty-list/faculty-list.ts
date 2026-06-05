import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FacultyService } from '../services/faculty.service';
import { BaseListComponent } from '../base/base-list.component';

@Component({
  selector: 'app-faculty-list',
  imports: [CommonModule],
  templateUrl: './faculty-list.html',
  styleUrl: './faculty-list.css'
})
export class FacultyListComponent extends BaseListComponent implements OnInit {

  constructor(private facultyService: FacultyService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  editFaculty(faculty: any): void {
    this.router.navigate(['/faculty', faculty.id], { state: faculty });
  }

  ngOnInit(): void {
    this.facultyService.get(
      (response: any) => {
        this.formData.listdata = response.data;
        this.formData.error = response.error;
        this.formData.message = response.message;
        this.refresh();
      },
      (err: any) => console.error('Faculty fetch failed:', err)
    );
  }
}
