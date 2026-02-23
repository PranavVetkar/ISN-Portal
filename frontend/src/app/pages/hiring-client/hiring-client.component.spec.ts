import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringClientComponent } from './hiring-client.component';

describe('HiringClientComponent', () => {
  let component: HiringClientComponent;
  let fixture: ComponentFixture<HiringClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
