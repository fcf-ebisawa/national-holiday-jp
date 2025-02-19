import { NationalHolidayJp } from './NationalHolidayJp';

/**
 * Internal helper function to convert date to Date type
 * @param date - Date to convert (number, string, or Date)
 * @returns Converted Date object
 * @throws {Error} If date format is invalid
 * @internal
 */
const toDate = (date: number | string | Date): Date => {
  if (date instanceof Date) {
    return date;
  }
  const converted = new Date(date);

  if (isNaN(converted.getTime())) {
    throw new Error('Invalid date format');
  }

  return converted;
};

/**
 * Get the holiday name for a specified date
 * @param date - Date to check (number, string, or Date)
 * @returns Holiday name if the date is a holiday, undefined otherwise
 *
 * @example
 * ```typescript
 * // Using date string
 * const holiday1 = await getHoliday('2024-01-01');
 * console.log(holiday1); // "New Year's Day"
 *
 * // Using Date object
 * const holiday2 = await getHoliday(new Date('2024-01-01'));
 * console.log(holiday2); // "New Year's Day"
 * ```
 */
export const getHoliday = async (date: number | string | Date): Promise<string | undefined> => {
  date = toDate(date);
  const holidayJp = await NationalHolidayJp.getInstance();
  const holidays = holidayJp.getHolidays();

  const str = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return holidays[str];
};

/**
 * Check if a specified date is a holiday
 * @param date - Date to check (number, string, or Date)
 * @returns If holiday: {isHoliday: true, name: string, date: Date}
 *          If not holiday: {isHoliday: false}
 *
 * @example
 * ```typescript
 * const result = await isHoliday('2024-01-01');
 * if (result.isHoliday) {
 *   console.log(result.name); // "New Year's Day"
 *   console.log(result.date); // Date object for 2024-01-01
 * }
 * ```
 */
export const isHoliday = async (date: number | string | Date): Promise<IsHolidayResult> => {
  date = toDate(date);
  const holiday = await getHoliday(date);

  if (!holiday) {
    return { isHoliday: false };
  }

  return { isHoliday: true, name: holiday, date };
};

/**
 * Type definition for isHoliday function return value
 * @internal
 */
type IsHolidayResult =
  | {
      isHoliday: true;
      name: string;
      date: Date;
    }
  | {
      isHoliday: false;
    };

/**
 * Get all holidays within the specified period
 * @param start - Start date of the period (number, string, or Date)
 * @param end - End date of the period (number, string, or Date)
 * @returns Array of holidays. Each element is in the format {name: string, date: Date}
 *
 * @example
 * ```typescript
 * const holidays = await betweenHoliday('2024-01-01', '2024-01-31');
 * holidays.forEach(holiday => {
 *   console.log(`${holiday.date.toISOString()}: ${holiday.name}`);
 * });
 * ```
 */
export const betweenHoliday = async (
  start: number | string | Date,
  end: number | string | Date,
): Promise<BetweenHolidayResult> => {
  start = toDate(start);
  end = toDate(end);

  const result: BetweenHolidayResult = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    const holiday = await getHoliday(currentDate);

    if (holiday) {
      result.push({ name: holiday, date: new Date(currentDate) });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

/**
 * Type definition for betweenHoliday function return value
 * @internal
 */
type BetweenHolidayResult = {
  name: string;
  date: Date;
}[];
