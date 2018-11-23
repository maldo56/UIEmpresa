import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpAvanzadoComponent } from './mp-avanzado.component';

describe('MpAvanzadoComponent', () => {
  let component: MpAvanzadoComponent;
  let fixture: ComponentFixture<MpAvanzadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpAvanzadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpAvanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
