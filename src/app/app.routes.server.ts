import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'welcome', renderMode: RenderMode.Client },
  { path: 'roles', renderMode: RenderMode.Client },
  { path: 'colleges', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender }
];
