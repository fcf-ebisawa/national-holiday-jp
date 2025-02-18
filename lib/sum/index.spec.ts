import { describe, it, expect } from 'vitest';
import { sum } from '.';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });
});
