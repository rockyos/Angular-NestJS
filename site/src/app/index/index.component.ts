import { Component} from '@angular/core';
import { Photo } from '../photo';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent  {

  photos: Photo[];

  public photosChanges(images){
    this.photos = images;
  }
}
