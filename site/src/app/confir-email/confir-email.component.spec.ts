import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirEmailComponent } from './confir-email.component';

describe('ConfirEmailComponent', () => {
  let component: ConfirEmailComponent;
  let fixture: ComponentFixture<ConfirEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
