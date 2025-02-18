import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NationalHolidayJp } from './NationalHolidayJp';

describe('NationalHolidayJp', () => {
  beforeEach(() => {
    // Reset singleton instance before each test
    NationalHolidayJp['instance'] = undefined;
    vi.clearAllMocks();
  });

  // Mock CSV data
  const mockCsvData = new TextEncoder().encode(
    `国民の祝日・休日月日,国民の祝日・休日名称
2024-01-01,元日
2024-01-08,成人の日
`,
  );

  // Mock fetch response
  const mockFetchResponse = {
    arrayBuffer: () => Promise.resolve(mockCsvData),
  };

  describe('getInstance', () => {
    it('should create a singleton instance', async () => {
      global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);

      const instance1 = await NationalHolidayJp.getInstance();
      const instance2 = await NationalHolidayJp.getInstance();

      expect(instance1).toBe(instance2);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache after CACHE_DURATION', async () => {
      global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);

      // Get initial instance
      const instance1 = await NationalHolidayJp.getInstance();

      // Move time forward past cache duration
      const initialDate = instance1.getLastUpdated();
      vi.setSystemTime(new Date(initialDate!.getTime() + 25 * 60 * 60 * 1000)); // 25 hours later

      // Get instance again
      await NationalHolidayJp.getInstance();

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('data fetching and parsing', () => {
    it('should fetch and parse holiday data correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);

      const instance = await NationalHolidayJp.getInstance();
      const holidays = instance.getHolidays();

      expect(holidays).toEqual({
        '2024-01-01': '元日',
        '2024-01-08': '成人の日',
      });
    });

    it('should handle fetch errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(NationalHolidayJp.getInstance()).rejects.toThrow('Network error');
    });

    it('should handle malformed CSV data', async () => {
      const malformedCsvData = new TextEncoder().encode(
        `国民の祝日・休日月日,国民の祝日・休日名称
invalid-date
2024-01-01
`,
      );

      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(malformedCsvData),
      });

      const instance = await NationalHolidayJp.getInstance();
      const holidays = instance.getHolidays();

      expect(holidays).toEqual({});
    });

    it('should handle empty CSV data', async () => {
      const emptyCsvData = new TextEncoder().encode(
        `国民の祝日・休日月日,国民の祝日・休日名称
`,
      );

      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(emptyCsvData),
      });

      const instance = await NationalHolidayJp.getInstance();
      const holidays = instance.getHolidays();

      expect(holidays).toEqual({});
    });
  });

  describe('refresh', () => {
    it('should update holiday data when refresh is called', async () => {
      // Initial data
      global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);
      const instance = await NationalHolidayJp.getInstance();

      // New data for refresh
      const newMockData = new TextEncoder().encode(
        `国民の祝日・休日月日,国民の祝日・休日名称
2024-02-11,建国記念の日
`,
      );

      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(newMockData),
      });

      await instance.refresh();
      const holidays = instance.getHolidays();

      expect(holidays).toEqual({
        '2024-02-11': '建国記念の日',
      });
    });
  });

  describe('getLastUpdated', () => {
    it('should return the last fetch time', async () => {
      const now = new Date();
      vi.setSystemTime(now);

      global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);
      const instance = await NationalHolidayJp.getInstance();

      const lastUpdated = instance.getLastUpdated();
      expect(lastUpdated).toEqual(now);
    });
  });
});
