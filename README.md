# national-holiday-jp

A simple npm package for retrieving Japanese national holidays.

## Features

- 🗓 Check and retrieve Japanese national holidays
- 📅 Get a list of holidays within a specified period
- ⚡️ Lightweight implementation with no dependencies
- 🎯 Type safety with TypeScript
- ✅ Complete test coverage with Vitest

## Installation

```bash
npm install @fcf-ebisawa/national-holiday-jp
```

## Usage

### ES Modules

```typescript
import { isHoliday, getHoliday, betweenHoliday } from '@fcf-ebisawa/national-holiday-jp';

// Check if a date is a holiday
const result = await isHoliday('2024-01-01');
if (result.isHoliday) {
  console.log(result.name); // 'New Year's Day'
  console.log(result.date); // Date object for 2024-01-01
}

// Get holiday name for a specific date
const holidayName = await getHoliday('2024-01-01'); // 'New Year's Day'

// Get a list of holidays within a period
const holidays = await betweenHoliday('2024-01-01', '2024-12-31');
// [
//   { date: Date('2024-01-01'), name: 'New Year's Day' },
//   { date: Date('2024-01-08'), name: 'Coming of Age Day' },
//   ...
// ]
```

### CommonJS

```javascript
const { isHoliday, getHoliday, betweenHoliday } = require('@fcf-ebisawa/national-holiday-jp');

// Same usage as ES Modules (using async/await)
```

## API

### `isHoliday(date: number | string | Date): Promise<IsHolidayResult>`

Determines if the specified date is a holiday.

- Returns: `{ isHoliday: true, name: string, date: Date }` if it's a holiday
- Returns: `{ isHoliday: false }` if it's not a holiday

### `getHoliday(date: number | string | Date): Promise<string | undefined>`

Returns the holiday name for the specified date. Returns `undefined` if the date is not a holiday.

### `betweenHoliday(start: number | string | Date, end: number | string | Date): Promise<Array<{ date: Date; name: string }>>`

Returns a list of holidays within the specified period.

## Date Formats

Accepts dates in the following formats:

- `Date` object: `new Date('2024-01-01')`
- Date string: `'2024-01-01'`
- Timestamp: `1704067200000`

## Development

1. Install dependencies

```bash
npm install
```

2. Run tests

```bash
npm test                 # Run tests
npm run test:coverage   # Generate coverage report
```

3. Build

```bash
npm run build
```

## Package Structure

```
.
├── lib/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── NationalHolidayJp.ts  # Main class
│   └── *.spec.ts          # Test files
└── dist/                  # Build output (auto-generated)
    ├── es/               # ES Modules
    ├── cjs/              # CommonJS
    └── types/            # Type definitions
```

## License

This package is released under the [Apache-2.0 License](LICENSE).

### About Holiday Data

The holiday data used in this package is sourced from the [Cabinet Office of Japan's holiday data](https://data.e-gov.go.jp/data/dataset/cao_20190522_0002/resource/d9ad35a5-6c9c-4127-bdbe-aa138fdffe42), which is provided under the [CC-BY license](https://creativecommons.org/licenses/by/4.0/).

Data used: National holidays from 1955 to 2020 (including substitute holidays)
Source: Cabinet Office of Japan

## Contributing

Please report bugs and feature requests in [GitHub Issues](https://github.com/yourusername/national-holiday-jp/issues).
Pull requests are welcome.

---

　
