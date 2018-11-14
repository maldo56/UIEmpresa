import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpEstadosComponent } from './mp-estados.component';

describe('MpEstadosComponent', () => {
  let component: MpEstadosComponent;
  let fixture: ComponentFixture<MpEstadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpEstadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
