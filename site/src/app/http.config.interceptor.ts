import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable() export class HttpConfigInterceptor implements HttpInterceptor { 

    constructor(private token: TokenService){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        
        const token: string = this.token.getToken();

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }));
    }
}
