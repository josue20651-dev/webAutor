import { TestBed } from '@angular/core/testing';

import { carritoService } from './carritoService';

describe('Carrito', () => {
  let service: carritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(carritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
