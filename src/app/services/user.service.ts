import { Injectable } from '@angular/core';
import { ORSAPI } from './orsapi.config';
import { ServiceLocator } from './service-locator';
import { BaseService } from './base.service';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  login: string;
  password?: string;
  dob?: string | null;
  role_id: number;
  role_Name?: string;
  mobileNumber: string;
  gender?: string;
  photo?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {

  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator);
    this.url = ORSAPI.USER_API;
    this.supportsPreload = false;
  }
}
