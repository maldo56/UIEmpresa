import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpPaquetesComponent } from './mp-paquetes.component';

describe('MpPaquetesComponent', () => {
  let component: MpPaquetesComponent;
  let fixture: ComponentFixture<MpPaquetesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpPaquetesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpPaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
