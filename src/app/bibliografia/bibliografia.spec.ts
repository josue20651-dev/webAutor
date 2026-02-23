import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bibliografia } from './bibliografia';

describe('Bibliografia', () => {
  let component: Bibliografia;
  let fixture: ComponentFixture<Bibliografia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bibliografia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bibliografia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
