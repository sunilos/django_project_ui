import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollegeService } from '../services/college.service';
import { BaseListComponent } from '../base/base-list.component';

@Component({
  selector: 'app-college-list',
  imports: [CommonModule],
  templateUrl: './college-list.html',
  styleUrl: './college-list.css'
})
export class CollegeListComponent extends BaseListComponent implements OnInit {

  constructor(private collegeService: CollegeService, router: Router, cdr: ChangeDetectorRef) {
    super(router, cdr);
  }

  editCollege(college: any): void {
    this.router.navigate(['/college', college.id], { state: college });
  }

  ngOnInit(): void {
    let _self = this;
    this.collegeService.get(
      (response: any) => {
        _self.formData.listdata = response.data;
        _self.formData.error = response.error;
        _self.formData.message = response.message;
        console.log('College response:', response);
        _self.refresh();
      },
      (err: any) => console.error('College failed:', err)
    );
  }
}
