import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Add token to request if available
        const token = this.authService.getToken();

        if (token) {
            request = this.addTokenToRequest(request, token);
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                // If error is 401 and not already trying to refresh
                if (error.status === 401 && !request.url.includes('/refresh') && !request.url.includes('/login')) {
                    return this.handle401Error(request, next);
                }

                return throwError(() => error);
            })
        );
    }

    private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = this.authService.getRefreshToken();

            if (refreshToken) {
                return this.authService.refreshToken().pipe(
                    switchMap((response: any) => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(response.token);

                        // Retry the failed request with new token
                        return next.handle(this.addTokenToRequest(request, response.token));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;

                        // Refresh failed, logout and redirect to login
                        this.authService.logout();
                        this.router.navigate(['/login']);

                        return throwError(() => err);
                    })
                );
            } else {
                // No refresh token, logout
                this.isRefreshing = false;
                this.authService.logout();
                this.router.navigate(['/login']);

                return throwError(() => new Error('No refresh token'));
            }
        } else {
            // Wait for refresh to complete, then retry request
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => next.handle(this.addTokenToRequest(request, token)))
            );
        }
    }
}