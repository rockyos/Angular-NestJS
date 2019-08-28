import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';
import { Photo } from '../photo';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output() photosFromForm = new EventEmitter<Photo[]>();
  photos: Photo[];
  hiddenIcon: boolean = false;

  constructor(private service: HttpService) { }

  ngOnInit() {
  }

  addPhoto(fileInput: any) {
    const newFile = fileInput.target.files[0] as File;
    this.service.addPhoto(newFile).subscribe(response => this.service.getPhotos().subscribe(resualt => this.photosFromForm.emit(this.photos = resualt)));
  }

  saveBtn() {
    this.service.save().subscribe(response => this.service.getPhotos().subscribe(resualt => this.photosFromForm.emit(this.photos = resualt)));
  }

  resetBtn() {
    this.service.reset().subscribe(response => this.service.getPhotos().subscribe(resualt => this.photosFromForm.emit(this.photos = resualt)));
  }

}
