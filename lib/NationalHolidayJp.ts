/**
 * URL for the Cabinet Office's holiday CSV data
 * @see {@link https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv}
 */
const NATIONAL_HOLIDAY_JP_DATA_URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

/**
 * Class for retrieving and managing Japanese national holiday information
 * @remarks
 * This class implements the singleton pattern and can only be instantiated through the `getInstance()` method.
 *
 * @example
 * ```typescript
 * const holidayJp = await NationalHolidayJp.getInstance();
 * const holidays = holidayJp.getHolidays();
 * ```
 */
export class NationalHolidayJp {
  /** Singleton instance */
  static instance?: NationalHolidayJp;

  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Object holding holiday data
   * Keys are dates (YYYY-MM-DD format), values are holiday names
   */
  private holidays: Record<string, string> = {};

  private lastFetched: Date = new Date();

  /**
   * Refresh the holiday data
   * @throws {Error} Network or CSV parsing errors
   */
  async refresh(): Promise<void> {
    await this.fetchNationalHolidayJpData();
  }

  /**
   * Get the last update timestamp
   */
  getLastUpdated(): Date | null {
    return this.lastFetched;
  }

  /** Private constructor - prevents direct instantiation */
  private constructor() {}

  /**
   * Fetch and parse holiday data from the Cabinet Office website
   * @throws {Error} Network or CSV parsing errors
   */
  private async fetchNationalHolidayJpData(): Promise<void> {
    const res = await fetch(NATIONAL_HOLIDAY_JP_DATA_URL);
    const buffer = await res.arrayBuffer();

    const decoder = new TextDecoder('sjis');
    const csv = decoder.decode(buffer);

    const lines = csv
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '');

    this.holidays = lines.reduce(
      (acc, line) => {
        const [date, name] = line.trim().split(',');
        if (date && name) {
          acc[date] = name;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    this.lastFetched = new Date();
  }

  /**
   * Get an instance of NationalHolidayJp
   * @returns Singleton instance
   * @throws {Error} If data fetching fails
   *
   * @example
   * ```typescript
   * const holidayJp = await NationalHolidayJp.getInstance();
   * ```
   */
  static async getInstance(): Promise<NationalHolidayJp> {
    if (!NationalHolidayJp.instance || NationalHolidayJp.shouldRefreshCache()) {
      NationalHolidayJp.instance = new NationalHolidayJp();
      await NationalHolidayJp.instance.fetchNationalHolidayJpData();
    }
    return NationalHolidayJp.instance;
  }

  private static shouldRefreshCache(): boolean {
    if (!NationalHolidayJp.instance) return true;
    const now = new Date();
    const elapsed = now.getTime() - NationalHolidayJp.instance.lastFetched.getTime();
    return elapsed > NationalHolidayJp.CACHE_DURATION;
  }

  /**
   * Return the fetched holiday data
   * @returns Object containing holiday data. Keys are dates (YYYY-MM-DD format), values are holiday names
   *
   * @example
   * ```typescript
   * const holidays = holidayJp.getHolidays();
   * console.log(holidays['2024-01-01']); // "New Year's Day"
   * ```
   */
  getHolidays(): Record<string, string> {
    return this.holidays;
  }
}
