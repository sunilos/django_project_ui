export interface ORSAPIConfig {
  baseUrl: string;
  LOGIN_API: string;
  TOKEN_REFRESH_API: string;
  CHANGE_PASSWORD_API: string;
  FORGOT_PASSWORD_API: string;
  REGISTER_API: string;
  USER_API: string;
  ROLE_API: string;
  COLLEGE_API: string;
  COURSE_API: string;
  STUDENT_API: string;
  SUBJECT_API: string;
  FACULTY_API: string;
  MARKSHEET_API: string;
  TIMETABLE_API: string;
  STUDENT_SEARCH_API: string;
  COLLEGE_SEARCH_API: string;
}

const BASE = 'http://127.0.0.1:8000';
const CONTEXT = '/ORSAPI/api';


export const ORSAPI: ORSAPIConfig = {
  
  baseUrl: BASE,

  TOKEN_REFRESH_API: `${BASE}/api/token/refresh/`,
  LOGIN_API: `${BASE}${CONTEXT}/User/login/`, 
  CHANGE_PASSWORD_API: `${BASE}${CONTEXT}/User/change-password/`,
  FORGOT_PASSWORD_API: `${BASE}${CONTEXT}/User/forgot-password/`,
  REGISTER_API: `${BASE}${CONTEXT}/User/register/`,

  USER_API: `${BASE}${CONTEXT}/User/`,
  ROLE_API: `${BASE}${CONTEXT}/Role/`,
  COLLEGE_API: `${BASE}${CONTEXT}/College/`,
  COURSE_API: `${BASE}${CONTEXT}/Course/`,
  STUDENT_API: `${BASE}${CONTEXT}/Student/`,
  STUDENT_SEARCH_API: `${BASE}${CONTEXT}/Student/search/`,
  COLLEGE_SEARCH_API: `${BASE}${CONTEXT}/College/search/`,
  SUBJECT_API: `${BASE}${CONTEXT}/Subject/`,
  FACULTY_API: `${BASE}${CONTEXT}/Faculty/`,
  MARKSHEET_API: `${BASE}${CONTEXT}/Marksheet/`,
  TIMETABLE_API: `${BASE}${CONTEXT}/TimeTable/`
};
