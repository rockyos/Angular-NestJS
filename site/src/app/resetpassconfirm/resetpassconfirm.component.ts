import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-resetpassconfirm',
  templateUrl: './resetpassconfirm.component.html',
  styleUrls: ['./resetpassconfirm.component.css']
})
export class ResetpassconfirmComponent implements OnInit {
  url = `${environment.clientUrl}`;
  constructor() { }

  ngOnInit() {
  }

}
