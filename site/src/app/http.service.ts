import { Injectable } from '@angular/core';
import { Photo } from './photo';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  public getPhotos(): Observable<Array<Photo>> {
    const url = `${environment.apiUrl}api/photo`;
    return this.http.get<Array<Photo>>(url);
  }



  public addPhoto(newImage: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', newImage, newImage.name);
    const url = `${environment.apiUrl}api/photo/send`;
    return this.http.post<string>(url, formData);
  }

  public save(): Observable<any> {
    const url = `${environment.apiUrl}api/photo/save`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(url, httpOptions);
  }

  public reset(): Observable<any> {
    const url = `${environment.apiUrl}api/photo/reset`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(url, httpOptions);
  }

  public delPhoto(photo: Photo): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const url = `${environment.apiUrl}api/photo/${photo.guid}`;
    return this.http.delete(url, httpOptions);
  }

  public loginPost(email, password): Observable<string> {
    const body = {
      email: email,
      password: password
    };
    const url = `${environment.apiUrl}Account/Login`;
    return this.http.post<string>(url, body);
  }

  public registerPost(email, password): Observable<string> {
    const body = {
      email: email,
      password: password
    };
    const url = `${environment.apiUrl}Account/Register`;
    return this.http.post<string>(url, body);
  }

  public forgotPassPost(email): Observable<string> {
    const url = `${environment.apiUrl}Account/ForgotPassword`;
    const formData = new FormData();
    formData.append('Email', email);
    return this.http.post<string>(url, formData);
  }

  public resetPassPost(email, pass, passconfirm, code): Observable<string> {
    const url = `${environment.apiUrl}Account/ResetPassword`;
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', pass);
    formData.append('ConfirmPassword', passconfirm);
    formData.append('Code', code);
    return this.http.post<string>(url, formData);
  }

  public registerExtPost(email): Observable<string> {
    const httpOptions = {
      responseType: 'text' as 'json'
    };
    const url = `${environment.apiUrl}Account/ExternalConfirmation`;
    const formData = new FormData();
    formData.append('Email', email);
    return this.http.post<string>(url, formData, httpOptions);
  }

  public googleToken(token: string): Observable<string>{
    const url = `${environment.apiUrl}Account/GoogleGetInfoByToken?token=${token}`;
    return this.http.get<string>(url);
  }

  public facebookToken(token: string): Observable<string>{
    const url = `${environment.apiUrl}Account/FacebookGetInfoByToken?token=${token}`;
    return this.http.get<string>(url);
  }
}
