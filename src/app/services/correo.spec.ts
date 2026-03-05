import { TestBed } from '@angular/core/testing';

import { Correo } from './correo';

describe('Correo', () => {
  let service: Correo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Correo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
