import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpCategoriasComponent } from './mp-categorias.component';

describe('MpCategoriasComponent', () => {
  let component: MpCategoriasComponent;
  let fixture: ComponentFixture<MpCategoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
