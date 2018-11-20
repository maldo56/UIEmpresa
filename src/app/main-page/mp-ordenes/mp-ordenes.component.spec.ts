import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpOrdenesComponent } from './mp-ordenes.component';

describe('MpOrdenesComponent', () => {
  let component: MpOrdenesComponent;
  let fixture: ComponentFixture<MpOrdenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpOrdenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
