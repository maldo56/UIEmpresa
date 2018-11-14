import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpZonaEntregaComponent } from './mp-zona-entrega.component';

describe('MpZonaEntregaComponent', () => {
  let component: MpZonaEntregaComponent;
  let fixture: ComponentFixture<MpZonaEntregaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpZonaEntregaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpZonaEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
