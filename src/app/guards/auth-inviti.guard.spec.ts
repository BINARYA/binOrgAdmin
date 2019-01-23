import { TestBed, async, inject } from '@angular/core/testing';

import { AuthInvitiGuard } from './auth-inviti.guard';

describe('AuthInvitiGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInvitiGuard]
    });
  });

  it('should ...', inject([AuthInvitiGuard], (guard: AuthInvitiGuard) => {
    expect(guard).toBeTruthy();
  }));
});
