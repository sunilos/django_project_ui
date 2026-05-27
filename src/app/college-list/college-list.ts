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

  ngOnInit(): void {
    let _self = this;
    this.collegeService.getColleges(_self.formData, (response) => {

      console.log('College 123 response:', _self.formData);
      _self.refresh();
    });
  }
}
