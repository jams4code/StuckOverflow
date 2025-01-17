import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import { AuthenticationService } from '../components/services/authentication.service';
import { Router } from '@angular/router';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUser;
        if (currentUser && currentUser.token)
            request = this.addToken(request, currentUser.token);
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401 && err.headers.get("token-expired"))
                    return this.handle401Error(request, next);
                else
                    return throwError(err);
            })
        );
    }
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        this.authenticationService.logout();
        this.router.navigateByUrl("/login");
        return next.handle(null);
    }
    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
}