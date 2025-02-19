import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHoliday, isHoliday, betweenHoliday } from './index';
import { NationalHolidayJp } from './NationalHolidayJp';

describe('Holiday Functions', () => {
  beforeEach(() => {
    // Reset singleton instance before each test
    NationalHolidayJp['instance'] = undefined;
    vi.clearAllMocks();
  });

  // Mock holiday data
  const mockHolidays = {
    '2024/1/1': '元日',
    '2024/1/8': '成人の日',
    '2024/2/11': '建国記念の日',
    '2024/2/12': '建国記念の日 振替休日',
  };

  beforeEach(() => {
    // Mock NationalHolidayJp instance
    vi.spyOn(NationalHolidayJp, 'getInstance').mockResolvedValue({
      getHolidays: () => mockHolidays,
    } as any);
  });

  describe('getHoliday', () => {
    it('should return holiday name for a holiday date (string input)', async () => {
      const result = await getHoliday('2024-01-01');
      expect(result).toBe('元日');
    });

    it('should return holiday name for a holiday date (Date input)', async () => {
      const result = await getHoliday(new Date('2024-01-01'));
      expect(result).toBe('元日');
    });

    it('should return undefined for a non-holiday date', async () => {
      const result = await getHoliday('2024-01-02');
      expect(result).toBeUndefined();
    });

    it('should handle timestamp input', async () => {
      const result = await getHoliday(new Date('2024-01-01').getTime());
      expect(result).toBe('元日');
    });
  });

  describe('isHoliday', () => {
    it('should return holiday info for a holiday date', async () => {
      const result = await isHoliday('2024-01-01');
      expect(result).toEqual({
        isHoliday: true,
        name: '元日',
        date: new Date('2024-01-01'),
      });
    });

    it('should return false for a non-holiday date', async () => {
      const result = await isHoliday('2024-01-02');
      expect(result).toEqual({ isHoliday: false });
    });

    it('should handle Date object input', async () => {
      const result = await isHoliday(new Date('2024-01-01'));
      expect(result).toEqual({
        isHoliday: true,
        name: '元日',
        date: new Date('2024-01-01'),
      });
    });
  });

  describe('betweenHoliday', () => {
    it('should return all holidays within the specified period', async () => {
      const result = await betweenHoliday('2024-01-01', '2024-01-31');
      expect(result).toEqual([
        { name: '元日', date: new Date('2024-01-01') },
        { name: '成人の日', date: new Date('2024-01-08') },
      ]);
    });

    it('should handle Date object inputs', async () => {
      const result = await betweenHoliday(new Date('2024-02-01'), new Date('2024-02-29'));
      expect(result).toEqual([
        { name: '建国記念の日', date: new Date('2024-02-11') },
        { name: '建国記念の日 振替休日', date: new Date('2024-02-12') },
      ]);
    });

    it('should return empty array when no holidays in period', async () => {
      const result = await betweenHoliday('2024-03-01', '2024-03-31');
      expect(result).toEqual([]);
    });

    it('should handle single day period', async () => {
      const result = await betweenHoliday('2024-01-01', '2024-01-01');
      expect(result).toEqual([{ name: '元日', date: new Date('2024-01-01') }]);
    });

    it('should handle timestamp inputs', async () => {
      const start = new Date('2024-01-01').getTime();
      const end = new Date('2024-01-31').getTime();
      const result = await betweenHoliday(start, end);
      expect(result).toEqual([
        { name: '元日', date: new Date('2024-01-01') },
        { name: '成人の日', date: new Date('2024-01-08') },
      ]);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid date inputs', async () => {
      await expect(getHoliday('invalid-date')).rejects.toThrow();
      await expect(isHoliday('invalid-date')).rejects.toThrow();
      await expect(betweenHoliday('invalid-date', '2024-01-01')).rejects.toThrow();
    });

    it('should handle end date before start date', async () => {
      const result = await betweenHoliday('2024-12-31', '2024-01-01');
      expect(result).toEqual([]);
    });
  });
});
