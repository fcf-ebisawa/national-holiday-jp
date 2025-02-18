import { NationalHolidayJp } from './NationalHolidayJp';

/**
 * 日付の型を統一してDate型に変換する内部ヘルパー関数
 * @param date - 変換する日付（数値、文字列、またはDate型）
 * @returns 変換後のDate型オブジェクト
 * @throws {Error} 無効な日付形式の場合
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
 * 指定された日付の祝日名を取得する
 * @param date - 確認したい日付（数値、文字列、またはDate型）
 * @returns 祝日名。祝日でない場合はundefined
 *
 * @example
 * ```typescript
 * // 日付文字列を使用
 * const holiday1 = await getHoliday('2024-01-01');
 * console.log(holiday1); // "元日"
 *
 * // Date型を使用
 * const holiday2 = await getHoliday(new Date('2024-01-01'));
 * console.log(holiday2); // "元日"
 * ```
 */
export const getHoliday = async (date: number | string | Date): Promise<string | undefined> => {
  date = toDate(date);
  const holidayJp = await NationalHolidayJp.getInstance();
  const holidays = holidayJp.getHolidays();

  return holidays[date.toISOString().split('T')[0]!.replace(/-/g, '/')];
};

/**
 * 指定された日付が祝日かどうかを判定する
 * @param date - 確認したい日付（数値、文字列、またはDate型）
 * @returns 祝日の場合は{isHoliday: true, name: string, date: Date}、
 *          祝日でない場合は{isHoliday: false}
 *
 * @example
 * ```typescript
 * const result = await isHoliday('2024-01-01');
 * if (result.isHoliday) {
 *   console.log(result.name); // "元日"
 *   console.log(result.date); // 2024-01-01のDateオブジェクト
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
 * 祝日判定の戻り値の型定義
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
 * 指定された期間内の祝日を全て取得する
 * @param start - 期間の開始日（数値、文字列、またはDate型）
 * @param end - 期間の終了日（数値、文字列、またはDate型）
 * @returns 祝日の配列。各要素は{name: string, date: Date}の形式
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
 * betweenHoliday関数の戻り値の型定義
 * @internal
 */
type BetweenHolidayResult = {
  name: string;
  date: Date;
}[];
