import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexListComponent } from './complex-list.component';

describe('ComplexListComponent', () => {
  let component: ComplexListComponent;
  let fixture: ComponentFixture<ComplexListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplexListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplexListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
