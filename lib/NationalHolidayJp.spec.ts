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

  it('should create a singleton instance', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);

    const instance1 = await NationalHolidayJp.getInstance();
    const instance2 = await NationalHolidayJp.getInstance();

    expect(instance1).toBe(instance2);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should fetch and parse holiday data correctly', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue(mockFetchResponse);

    const instance = await NationalHolidayJp.getInstance();
    const holidays = instance.getHolidays();

    expect(holidays).toEqual({
      '2024-01-01': '元日',
      '2024-01-08': '成人の日',
    });
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock fetch to throw an error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(NationalHolidayJp.getInstance()).rejects.toThrow('Network error');
  });

  it('should handle malformed CSV data', async () => {
    // Mock malformed CSV data
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

    // Should ignore invalid lines
    expect(holidays).toEqual({});
  });

  it('should handle empty CSV data', async () => {
    // Mock empty CSV data
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
