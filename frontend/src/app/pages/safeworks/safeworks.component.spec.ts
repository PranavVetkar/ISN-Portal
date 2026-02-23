import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeworksComponent } from './safeworks.component';

describe('SafeworksComponent', () => {
  let component: SafeworksComponent;
  let fixture: ComponentFixture<SafeworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeworksComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SafeworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
