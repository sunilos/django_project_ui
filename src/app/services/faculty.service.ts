import { Injectable } from '@angular/core';
import { ORSAPI } from './orsapi.config';
import { ServiceLocator } from './service-locator';
import { BaseService } from './base.service';

export interface Faculty {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address?: string;
  gender?: string;
  dob?: string;
  college_ID: number;
  collegeName: string;
  subject_ID: number;
  subjectName: string;
  course_ID: number;
  courseName: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class FacultyService extends BaseService {

  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator);
    this.url = ORSAPI.FACULTY_API;
  }
}
