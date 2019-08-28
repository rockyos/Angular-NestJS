import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpassconfirmComponent } from './forgotpassconfirm.component';

describe('ForgotpassconfirmComponent', () => {
  let component: ForgotpassconfirmComponent;
  let fixture: ComponentFixture<ForgotpassconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpassconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpassconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
