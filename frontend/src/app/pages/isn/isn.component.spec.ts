import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsnComponent } from './isn.component';

describe('IsnComponent', () => {
  let component: IsnComponent;
  let fixture: ComponentFixture<IsnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
