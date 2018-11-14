import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpEditarPerfilComponent } from './mp-editar-perfil.component';

describe('MpEditarPerfilComponent', () => {
  let component: MpEditarPerfilComponent;
  let fixture: ComponentFixture<MpEditarPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpEditarPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpEditarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
