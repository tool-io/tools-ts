import { simpleError, bounded } from "../folklore/batch44-shared.js";
export * from "../folklore/batch44-shared.js";
export { money, signedSum, sumMoney, roundMinor } from "../accounting/money.js";
// Proleptic Gregorian day coordinates; parse manually,never Date's special 0–99-year constructor.
const dateCoordinate = (text: string): number => {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(text))
    simpleError("date", "Explicit Gregorian YYYY-MM-DD date.");
  const [y, m, d] = text.split("-").map(Number);
  bounded(y, "year", 1, 9999);
  bounded(m, "month", 1, 12);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0),
    length = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      m - 1
    ];
  bounded(d, "day", 1, length);
  const a = Math.floor((14 - m) / 12),
    yy = y + 4800 - a,
    mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
};
export const daysBetween = (from: string, to: string): number =>
  dateCoordinate(to) - dateCoordinate(from);
export const gradeTable: Readonly<Record<string, string>> = {
  "1": "Poor",
  "2": "Fair",
  "3": "About Good",
  "4": "Good",
  "6": "Good",
  "8": "Very Good",
  "10": "Very Good",
  "12": "Fine",
  "15": "Fine",
  "20": "Very Fine",
  "25": "Very Fine",
  "30": "Very Fine",
  "35": "Very Fine",
  "40": "Extremely Fine",
  "45": "Extremely Fine",
  "50": "About Uncirculated",
  "53": "About Uncirculated",
  "55": "About Uncirculated",
  "58": "About Uncirculated",
  ...Object.fromEntries(
    Array.from({ length: 11 }, (_, i) => [String(60 + i), "Mint State"]),
  ),
};
