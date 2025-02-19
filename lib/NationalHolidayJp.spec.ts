import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NationalHolidayJp } from './NationalHolidayJp';

describe('NationalHolidayJp', () => {
  beforeEach(() => {
    // Reset singleton instance before each test
    NationalHolidayJp['instance'] = undefined;
    vi.clearAllMocks();
  });

  // Mock CSV data (SJIS encoded content)
  const mockCsvData = new Uint8Array([
    // SJIS encoded CSV header and data
    0x8d, 0x91, 0x96, 0xaf, 0x82, 0xcc, 0x8f, 0x8a, 0x93, 0xfa, 0x81, 0x45, 0x8b, 0x9b, 0x93, 0xfa,
    0x8c, 0x8e, 0x93, 0xfa, 0x2c, 0x8d, 0x91, 0x96, 0xaf, 0x82, 0xcc, 0x8f, 0x8a, 0x93, 0xfa, 0x81,
    0x45, 0x8b, 0x9b, 0x93, 0xfa, 0x96, 0xbc, 0x8f, 0xbd, 0x0d, 0x0a,
    // 2024/1/1,元日
    0x32, 0x30, 0x32, 0x34, 0x2f, 0x31, 0x2f, 0x31, 0x2c, 0x8c, 0xb3, 0x93, 0xfa, 0x0d, 0x0a,
    // 2024/1/8,成人の日
    0x32, 0x30, 0x32, 0x34, 0x2f, 0x31, 0x2f, 0x38, 0x2c, 0x90, 0xac, 0x90, 0x6c, 0x82, 0xcc, 0x93,
    0xfa, 0x0d, 0x0a,
  ]);

  // Mock fetch response
  const mockFetchResponse = {
    arrayBuffer: () => Promise.resolve(mockCsvData.buffer),
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
        '2024/1/1': '元日',
        '2024/1/8': '成人の日',
      });
    });

    it('should handle fetch errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(NationalHolidayJp.getInstance()).rejects.toThrow('Network error');
    });

    it('should handle malformed CSV data', async () => {
      const malformedCsvData = new Uint8Array([
        // SJIS encoded malformed CSV
        0x8d, 0x91, 0x96, 0xaf, 0x82, 0xcc, 0x8f, 0x8a, 0x93, 0xfa, 0x0d, 0x0a, 0x69, 0x6e, 0x76,
        0x61, 0x6c, 0x69, 0x64, 0x0d, 0x0a,
      ]);

      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(malformedCsvData.buffer),
      });

      const instance = await NationalHolidayJp.getInstance();
      const holidays = instance.getHolidays();

      expect(holidays).toEqual({});
    });

    it('should handle empty CSV data', async () => {
      const emptyCsvData = new Uint8Array([
        // SJIS encoded empty CSV
        0x8d, 0x91, 0x96, 0xaf, 0x82, 0xcc, 0x8f, 0x8a, 0x93, 0xfa, 0x0d, 0x0a,
      ]);

      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(emptyCsvData.buffer),
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

      // New data for refresh (SJIS encoded)
      const newMockData = new Uint8Array([
        // Header
        0x8d, 0x91, 0x96, 0xaf, 0x82, 0xcc, 0x8f, 0x8a, 0x93, 0xfa, 0x81, 0x45, 0x8b, 0x9b, 0x93,
        0xfa, 0x96, 0xbc, 0x8f, 0xbd, 0x0d, 0x0a,
        // 2024/2/11,建国記念の日
        0x32, 0x30, 0x32, 0x34, 0x2f, 0x32, 0x2f, 0x31, 0x31, 0x2c, 0x8c, 0x9a, 0x8d, 0x91, 0x8b,
        0x4c, 0x94, 0x4f, 0x82, 0xcc, 0x93, 0xfa, 0x0d, 0x0a,
      ]);

      global.fetch = vi.fn().mockResolvedValue({
        arrayBuffer: () => Promise.resolve(newMockData.buffer),
      });

      await instance.refresh();
      const holidays = instance.getHolidays();

      expect(holidays).toEqual({
        '2024/2/11': '建国記念の日',
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
