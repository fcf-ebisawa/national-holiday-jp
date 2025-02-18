# national-holiday-jp

日本の祝日を取得するためのシンプルなnpmパッケージです。

## 機能

- 🗓 日本の祝日の判定と取得
- 📅 指定期間内の祝日一覧の取得
- ⚡️ 軽量で依存関係のない実装
- 🎯 TypeScriptによる型安全性
- ✅ Vitestによる完全なテストカバレッジ

## インストール

```bash
npm install national-holiday-jp
```

## 使用方法

### ES Modules

```typescript
import { isHoliday, getHoliday, betweenHoliday } from 'national-holiday-jp';

// 指定日が祝日かどうかを判定
const result = await isHoliday('2024-01-01');
if (result.isHoliday) {
  console.log(result.name); // '元日'
  console.log(result.date); // 2024-01-01のDateオブジェクト
}

// 指定日の祝日名を取得
const holidayName = await getHoliday('2024-01-01'); // '元日'

// 指定期間の祝日一覧を取得
const holidays = await betweenHoliday('2024-01-01', '2024-12-31');
// [
//   { date: Date('2024-01-01'), name: '元日' },
//   { date: Date('2024-01-08'), name: '成人の日' },
//   ...
// ]
```

### CommonJS

```javascript
const { isHoliday, getHoliday, betweenHoliday } = require('national-holiday-jp');

// 以下、ES Modulesと同様の使用方法（async/awaitを使用）
```

## API

### `isHoliday(date: number | string | Date): Promise<IsHolidayResult>`

指定された日付が祝日かどうかを判定します。

- 戻り値: 祝日の場合は`{ isHoliday: true, name: string, date: Date }`
- 祝日でない場合は`{ isHoliday: false }`

### `getHoliday(date: number | string | Date): Promise<string | undefined>`

指定された日付の祝日名を返します。祝日でない場合は`undefined`を返します。

### `betweenHoliday(start: number | string | Date, end: number | string | Date): Promise<Array<{ date: Date; name: string }>>`

指定された期間内の祝日一覧を返します。

## 日付形式

以下の形式の日付を受け付けます：

- `Date`オブジェクト: `new Date('2024-01-01')`
- 日付文字列: `'2024-01-01'`
- タイムスタンプ: `1704067200000`

## 開発

1. 依存関係のインストール

```bash
npm install
```

2. テストの実行

```bash
npm test                 # テストの実行
npm run test:coverage   # カバレッジレポートの生成
```

3. ビルド

```bash
npm run build
```

## パッケージの構造

```
.
├── lib/                    # ソースコード
│   ├── index.ts           # メインエントリーポイント
│   ├── NationalHolidayJp.ts  # メインクラス
│   └── *.spec.ts          # テストファイル
└── dist/                  # ビルド出力（自動生成）
    ├── es/               # ES Modules
    ├── cjs/              # CommonJS
    └── types/            # 型定義ファイル
```

## ライセンス

このパッケージは[Apache-2.0ライセンス](LICENSE)の下で公開されています。

### 祝日データについて

本パッケージで使用している祝日データは、[内閣府の祝日データ](https://data.e-gov.go.jp/data/dataset/cao_20190522_0002/resource/d9ad35a5-6c9c-4127-bdbe-aa138fdffe42)を使用しています。このデータは[CC-BYライセンス](https://creativecommons.org/licenses/by/4.0/deed.ja)の下で提供されています。

使用データ: 昭和30年（1955年）から令和2年（2020年）国民の祝日等（いわゆる振替休日等を含む）
提供: 内閣府

## 貢献

バグ報告や機能要望は[GitHubのIssue](https://github.com/yourusername/national-holiday-jp/issues)にお願いします。
プルリクエストも歓迎です。

---
