import { JwtGuard } from './jwt.guard';

describe('Jwt.GuardGuard', () => {
  it('should be defined', () => {
    expect(new JwtGuard()).toBeDefined();
  });
});
