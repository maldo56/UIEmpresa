import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpProductosComponent } from './mp-productos.component';

describe('MpProductosComponent', () => {
  let component: MpProductosComponent;
  let fixture: ComponentFixture<MpProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
