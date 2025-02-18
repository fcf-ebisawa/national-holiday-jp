/**
 * 内閣府の祝日CSVデータのURL
 * @see {@link https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv}
 */
const NATIONAL_HOLIDAY_JP_DATA_URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

/**
 * 日本の祝日情報を取得・管理するクラス
 * @remarks
 * このクラスはシングルトンパターンを実装しており、`getInstance()`メソッドを通じてのみインスタンス化できます。
 *
 * @example
 * ```typescript
 * const holidayJp = await NationalHolidayJp.getInstance();
 * const holidays = holidayJp.getHolidays();
 * ```
 */
export class NationalHolidayJp {
  /** シングルトンインスタンス */
  static instance?: NationalHolidayJp;

  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間

  /**
   * 祝日データを保持するオブジェクト
   * キーは日付（YYYY-MM-DD形式）、値は祝日名
   */
  private holidays: Record<string, string> = {};

  private lastFetched: Date = new Date();

  /**
   * データを再取得する
   * @throws {Error} ネットワークエラーやCSVパース時のエラー
   */
  async refresh(): Promise<void> {
    await this.fetchNationalHolidayJpData();
  }

  /**
   * データの最終更新日時を取得する
   */
  getLastUpdated(): Date | null {
    return this.lastFetched;
  }

  /** プライベートコンストラクタ - 直接のインスタンス化を防ぐ */
  private constructor() {}

  /**
   * 内閣府のWebサイトから祝日データを取得し、解析する
   * @throws {Error} ネットワークエラーやCSVパース時のエラー
   */
  private async fetchNationalHolidayJpData(): Promise<void> {
    const res = await fetch(NATIONAL_HOLIDAY_JP_DATA_URL);
    const buffer = await res.arrayBuffer();

    const decoder = new TextDecoder();
    const csv = decoder.decode(buffer);

    const lines = csv
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '');

    this.holidays = lines.reduce(
      (acc, line) => {
        const [date, name] = line.split(',');
        if (date && name) {
          acc[date] = name;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    // データ取得後に最終更新日時を設定
    this.lastFetched = new Date();
  }

  /**
   * NationalHolidayJpのインスタンスを取得する
   * @returns シングルトンインスタンス
   * @throws {Error} データ取得時にエラーが発生した場合
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
   * 取得済みの祝日データを返す
   * @returns 祝日データを含むオブジェクト。キーは日付（YYYY-MM-DD形式）、値は祝日名
   *
   * @example
   * ```typescript
   * const holidays = holidayJp.getHolidays();
   * console.log(holidays['2024-01-01']); // "元日"
   * ```
   */
  getHolidays(): Record<string, string> {
    return this.holidays;
  }
}
