import { ChangeDetectorRef, Directive, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../services/base.service';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class BaseListComponent implements OnInit {

  form!: FormGroup;

  /** Holds the raw response from the preload API; available to child components. */
  preloadData: any;

  protected abstract buildForm(): FormGroup;

  searchForm: any = {
    error: false,
    message: '',
    listdata: [],
    data: {},
    pageNo: 1,
    pageSize: 10
  };
  loading = true;

  get totalPages(): number {
    return Math.ceil(this.searchForm.listdata.length / this.searchForm.pageSize);
  }

  get pagedData(): any[] {
    const start = (this.searchForm.pageNo - 1) * this.searchForm.pageSize;
    return this.searchForm.listdata.slice(start, start + this.searchForm.pageSize);
  }

  /** Route path of the list page — used by `goBack()` and after save/delete. */
  protected abstract pageUrl: string;



  constructor(protected router: Router, protected cdr: ChangeDetectorRef) { }

  protected refresh(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  protected loadDropdowns(): void {
    // alert('calling  base loadDropdowns');
    this.getService().preload((r: any) => {
      this.preloadData = r.data;
      this.cdr.markForCheck();
    }, () => { });
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
    this.loadDropdowns();
    this.doSearch();
  }

  /// Executes the search API call with the current form values and updates `searchForm` with the response.

  protected doSearch(): void {
    this.loading = true;
    let body = this.form.value;
    // Remove empty values from the body
    Object.keys(body).forEach(key => {
      if (body[key] === '' || body[key] === null) {
        delete body[key];
      }
    });

    this.getService().search(body,
      (response: any) => {
        this.searchForm.listdata = response.data;
        this.searchForm.error = response.error;
        this.searchForm.message = response.message;
        this.refresh();
      },
      (err: any) => {
        this.searchForm.error = true;
        this.searchForm.message = err?.status === 0 ? 'Server Error' : (err?.error?.message || 'Failed to load.');
        this.refresh();
      }

    );
  }
}
