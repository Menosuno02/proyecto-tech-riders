import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarContrasenyaTokenComponent } from './modificar-contrasenya-token.component';

describe('ModificarContrasenyaTokenComponent', () => {
  let component: ModificarContrasenyaTokenComponent;
  let fixture: ComponentFixture<ModificarContrasenyaTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarContrasenyaTokenComponent]
    });
    fixture = TestBed.createComponent(ModificarContrasenyaTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
