import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // With proxy configured, we don't need to prepend the API URL
  // The proxy will forward /api requests to the backend
  return next(req);
};
