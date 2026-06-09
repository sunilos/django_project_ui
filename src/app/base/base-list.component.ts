import { ChangeDetectorRef, Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../services/base.service';

@Directive()
export abstract class BaseListComponent implements OnInit {
  formData: any = {
    error: false,
    message: '',
    listdata: [],
    data: {}
  };
  loading = true;
  pageNo = 1;
  pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.formData.listdata.length / this.pageSize);
  }

  get pagedData(): any[] {
    const start = (this.pageNo - 1) * this.pageSize;
    return this.formData.listdata.slice(start, start + this.pageSize);
  }

  /** Route path of the list page — used by `goBack()` and after save/delete. */
  protected abstract pageUrl: string;

  constructor(protected router: Router, protected cdr: ChangeDetectorRef) { }

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

  edit(entity: any): void {
    this.router.navigate([this.pageUrl, entity.id], { state: entity });
  }

  /**
    * Returns the service instance responsible for CRUD operations on this entity.
    * Called by `onSave()`, `onDelete()`, and `loadEntity()`.
    */
  protected abstract getService(): BaseService;

  ngOnInit(): void {
    this.getService().get(
      (response: any) => {
        this.formData.listdata = response.data;
        this.formData.error = response.error;
        this.formData.message = response.message;
        this.refresh();
      },
      (err: any) => {
        this.formData.error = true;
        this.formData.message = err?.status === 0 ? 'Server Error' : (err?.error?.message || 'Failed to load.');
        this.refresh();
      }
    );
  }
}
