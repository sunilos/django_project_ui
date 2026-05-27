import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

export abstract class BaseListComponent {
  formData: any = {
    error: false,
    message: '',
    listdata: [],
    data: {}
  };
  loading = true;

  constructor(protected router: Router, protected cdr: ChangeDetectorRef) {}

  protected refresh(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['/welcome']);
  }

  forward(url: string): void {
    this.router.navigate([url]);
  }
}
