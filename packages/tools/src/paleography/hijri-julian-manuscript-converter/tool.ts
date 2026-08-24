import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HijriJulianManuscriptConverterInput = {
  readonly mode?: "hijri_to_julian" | "julian_to_hijri";
  readonly hijriYear?: number;
  readonly hijriMonth?: number;
  readonly hijriDay?: number;
  readonly julianYear?: number;
  readonly julianMonth?: number;
  readonly julianDay?: number;
};

export type HijriJulianManuscriptConverterOutput = {
  readonly hijriYear: number;
  readonly hijriMonth: number;
  readonly hijriDay: number;
  readonly julianYear: number;
  readonly julianMonth: number;
  readonly julianDay: number;
  readonly julianDayNumber: number;
};

const HIJRI_EPOCH_JDN = 1948440;
const MEAN_ISLAMIC_YEAR_DAYS = 354 + 11 / 30;

const isIslamicLeap = (year: number): boolean => (11 * year + 14) % 30 < 11;
const daysBeforeIslamicYear = (year: number): number =>
  354 * (year - 1) + Math.floor((11 * year + 3) / 30);
const daysBeforeIslamicMonth = (month: number): number =>
  29 * (month - 1) + Math.floor(month / 2);
const islamicMonthLength = (year: number, month: number): number => {
  if (month % 2 === 1) return 30;
  return month === 12 && isIslamicLeap(year) ? 30 : 29;
};
const islamicToJdn = (y: number, m: number, d: number): number =>
  HIJRI_EPOCH_JDN +
  daysBeforeIslamicYear(y) +
  daysBeforeIslamicMonth(m) +
  d -
  1;
const jdnToIslamic = (
  jdn: number,
): { y: number; m: number; d: number } | null => {
  const rel = jdn - HIJRI_EPOCH_JDN;
  if (rel < 0) return null;
  let y = Math.floor(rel / MEAN_ISLAMIC_YEAR_DAYS) + 1;
  if (y < 1) y = 1;
  while (daysBeforeIslamicYear(y + 1) <= rel) y += 1;
  while (y > 1 && daysBeforeIslamicYear(y) > rel) y -= 1;
  const rest = rel - daysBeforeIslamicYear(y);
  let m = 1;
  while (m < 12 && daysBeforeIslamicMonth(m + 1) <= rest) m += 1;
  return { y, m, d: rest - daysBeforeIslamicMonth(m) + 1 };
};
const jdnJulian = (y: number, m: number, d: number): number => {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083
  );
};
const julianMonthLength = (y: number, m: number): number => {
  if (m === 2) return y % 4 === 0 ? 29 : 28;
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
};
const jdnToJulian = (
  jdn: number,
): { y: number; m: number; d: number } | null => {
  let est = 622 + Math.floor((jdn - HIJRI_EPOCH_JDN) / 365.25);
  if (est < 1) est = 1;
  while (jdnJulian(est, 1, 1) > jdn) est -= 1;
  while (jdnJulian(est + 1, 1, 1) <= jdn) est += 1;
  let rest = jdn - jdnJulian(est, 1, 1);
  for (let m = 1; m <= 12; m += 1) {
    const len = julianMonthLength(est, m);
    if (rest < len) return { y: est, m, d: rest + 1 };
    rest -= len;
  }
  return null;
};

export const calculateHijriJulianManuscriptConverter = (
  input: HijriJulianManuscriptConverterInput,
): HijriJulianManuscriptConverterOutput => {
  const mode = input.mode ?? "hijri_to_julian";
  const hy = input.hijriYear ?? 1;
  const hm = input.hijriMonth ?? 1;
  const hd = input.hijriDay ?? 1;
  const jy = input.julianYear ?? 622;
  const jm = input.julianMonth ?? 7;
  const jd = input.julianDay ?? 16;
  for (const [field, value] of [
    ["hijriYear", hy],
    ["julianYear", jy],
  ] as const)
    if (!(Number.isSafeInteger(value) && value >= 1))
      return simpleError(
        field,
        "Years must be positive integers.",
        "invalid_year",
      );
  for (const [field, value] of [
    ["hijriMonth", hm],
    ["julianMonth", jm],
  ] as const)
    if (!(Number.isSafeInteger(value) && value >= 1 && value <= 12))
      return simpleError(
        field,
        "Months must be integers from 1 to 12.",
        "invalid_month",
      );
  if (!(
    Number.isSafeInteger(hd) &&
    hd >= 1 &&
    hd <= islamicMonthLength(hy, hm)
  ))
    return simpleError(
      "hijriDay",
      `Day must be an integer from 1 to ${islamicMonthLength(hy, hm)} for this tabular lunar month.`,
      "invalid_day",
    );
  if (!(Number.isSafeInteger(jd) && jd >= 1 && jd <= julianMonthLength(jy, jm)))
    return simpleError(
      "julianDay",
      "Julian day of month is not valid for that month and year.",
      "invalid_day",
    );
  const jdn =
    mode === "julian_to_hijri"
      ? jdnJulian(jy, jm, jd)
      : islamicToJdn(hy, hm, hd);
  if (!Number.isSafeInteger(jdn))
    return simpleError(
      mode === "julian_to_hijri" ? "julianYear" : "hijriYear",
      "The year is outside the exactly representable calendar range.",
      "invalid_year",
    );
  const julian = jdnToJulian(jdn);
  const islamic = jdnToIslamic(jdn);
  if (!julian || !islamic)
    return simpleError(
      "mode",
      "The date falls outside the supported range.",
      "invalid_date",
    );
  return {
    hijriYear: islamic.y,
    hijriMonth: islamic.m,
    hijriDay: islamic.d,
    julianYear: julian.y,
    julianMonth: julian.m,
    julianDay: julian.d,
    julianDayNumber: jdn,
  };
};

export const hijriJulianManuscriptConverterExample = {
  input: { mode: "hijri_to_julian", hijriYear: 1, hijriMonth: 1, hijriDay: 1 },
  output: {
    hijriYear: 1,
    hijriMonth: 1,
    hijriDay: 1,
    julianYear: 622,
    julianMonth: 7,
    julianDay: 16,
    julianDayNumber: 1948440,
  },
} satisfies ToolExample<
  HijriJulianManuscriptConverterInput,
  HijriJulianManuscriptConverterOutput
>;

export const hijriJulianManuscriptConverterTool = createSimpleTool({
  id: "paleography/hijri-julian-manuscript-converter",
  title: "Hijri-Julian Manuscript Converter",
  description:
    "Convert colophon dates between the Hijri calendar and the Julian calendar using the arithmetical (tabular) Islamic calendar with the civil epoch of Friday 16 July 622 CE (JDN 1948440); observed calendars can differ by a day.",
  inputs: [
    {
      default: "hijri_to_julian",
      description: "Direction of conversion.",
      enum: ["hijri_to_julian", "julian_to_hijri"],
      id: "mode",
      kind: "string",
      label: "Mode",
    },
    {
      default: 1,
      description: "Hijri year.",
      id: "hijriYear",
      kind: "integer",
      label: "Hijri year",
      minimum: 1,
    },
    {
      default: 1,
      description: "Hijri month (1 Muharram to 12 Dhu al-Hijja).",
      id: "hijriMonth",
      kind: "integer",
      label: "Hijri month",
      maximum: 12,
      minimum: 1,
    },
    {
      default: 1,
      description: "Hijri day of month.",
      id: "hijriDay",
      kind: "integer",
      label: "Hijri day",
      maximum: 30,
      minimum: 1,
    },
    {
      default: 622,
      description: "Julian calendar year.",
      id: "julianYear",
      kind: "integer",
      label: "Julian year",
      minimum: 1,
    },
    {
      default: 7,
      description: "Julian calendar month.",
      id: "julianMonth",
      kind: "integer",
      label: "Julian month",
      maximum: 12,
      minimum: 1,
    },
    {
      default: 16,
      description: "Julian day of month.",
      id: "julianDay",
      kind: "integer",
      label: "Julian day",
      maximum: 31,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Hijri year.",
      id: "hijriYear",
      kind: "integer",
      label: "Hijri year",
    },
    {
      description: "Hijri month 1-12.",
      id: "hijriMonth",
      kind: "integer",
      label: "Hijri month",
      maximum: 12,
      minimum: 1,
    },
    {
      description: "Hijri day of month.",
      id: "hijriDay",
      kind: "integer",
      label: "Hijri day",
      maximum: 30,
      minimum: 1,
    },
    {
      description: "Julian calendar year.",
      id: "julianYear",
      kind: "integer",
      label: "Julian year",
    },
    {
      description: "Julian calendar month 1-12.",
      id: "julianMonth",
      kind: "integer",
      label: "Julian month",
      maximum: 12,
      minimum: 1,
    },
    {
      description: "Julian day of month.",
      id: "julianDay",
      kind: "integer",
      label: "Julian day",
      maximum: 31,
      minimum: 1,
    },
    {
      description: "Julian day number of the date.",
      id: "julianDayNumber",
      kind: "integer",
      label: "JDN",
    },
  ],
  calculate: (input) =>
    calculateHijriJulianManuscriptConverter({
      hijriDay: input.hijriDay as number,
      hijriMonth: input.hijriMonth as number,
      hijriYear: input.hijriYear as number,
      julianDay: input.julianDay as number,
      julianMonth: input.julianMonth as number,
      julianYear: input.julianYear as number,
      mode: input.mode as HijriJulianManuscriptConverterInput["mode"],
    }),
});

export const runHijriJulianManuscriptConverter =
  hijriJulianManuscriptConverterTool.execute;
export default hijriJulianManuscriptConverterTool;
