import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { Photo } from '../photo';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @Input() photos: Photo[];
  url = `${environment.apiUrl}api/photo`;
  username: string;

  constructor(private service: HttpService, private token: TokenService) { }

  ngOnInit() {
    this.getData();
    var decoded = this.token.getDecodJWT();
    this.username = decoded['sub'];
  }

  getData() {
    this.service.getPhotos().subscribe(resualt => this.photos = resualt);
  }

  btnLogOut() {
    this.token.logOut();
  }

  deleteBtn(photo: Photo) {
    let index = this.photos.indexOf(photo);
    this.service.delPhoto(photo).subscribe(response => this.photos.splice(index, 1));
  }
}
