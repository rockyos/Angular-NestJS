import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor(private http: HttpClient ) { }

  transform(url: string) {
    return this.http.get( url, { responseType: "blob" }).pipe(
      switchMap(blob => {
        return Observable.create(observer => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () { observer.next(reader.result); }
        });
      }));
  }

}
