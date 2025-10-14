import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexCreateComponent } from './complex-create.component';

describe('ComplexCreateComponent', () => {
  let component: ComplexCreateComponent;
  let fixture: ComponentFixture<ComplexCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplexCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplexCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
