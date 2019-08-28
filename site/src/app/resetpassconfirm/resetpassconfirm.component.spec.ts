import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpassconfirmComponent } from './resetpassconfirm.component';

describe('ResetpassconfirmComponent', () => {
  let component: ResetpassconfirmComponent;
  let fixture: ComponentFixture<ResetpassconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpassconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpassconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
