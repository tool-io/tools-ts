import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KalendsMedievalDateParserInput = {
  readonly reference: "kalends" | "nones" | "ides";
  readonly count: number;
  readonly namedMonth:
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december";
  readonly leapYear?: boolean;
};

export type KalendsMedievalDateParserOutput = {
  readonly resolvedDayOfMonth: number;
  readonly resolvedMonth: KalendsMedievalDateParserInput["namedMonth"];
  readonly referenceDayNumber: number;
  readonly romanNotation: string;
};

const MONTHS = [
  { name: "january", abbrev: "ian.", days: 31 },
  { name: "february", abbrev: "feb.", days: 28 },
  { name: "march", abbrev: "mart.", days: 31 },
  { name: "april", abbrev: "apr.", days: 30 },
  { name: "may", abbrev: "mai.", days: 31 },
  { name: "june", abbrev: "iun.", days: 30 },
  { name: "july", abbrev: "iul.", days: 31 },
  { name: "august", abbrev: "aug.", days: 31 },
  { name: "september", abbrev: "sep.", days: 30 },
  { name: "october", abbrev: "oct.", days: 31 },
  { name: "november", abbrev: "nov.", days: 30 },
  { name: "december", abbrev: "dec.", days: 31 },
] as const;

const ROMAN_ONES = [
  "",
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
  "viii",
  "ix",
] as const;

const toRoman = (value: number): string => {
  const tens = Math.floor(value / 10);
  return `${"x".repeat(tens)}${ROMAN_ONES[value % 10]}`;
};

export const calculateKalendsMedievalDateParser = (
  input: KalendsMedievalDateParserInput,
): KalendsMedievalDateParserOutput => {
  if (!(
    Number.isSafeInteger(input.count) &&
    input.count >= 2 &&
    input.count <= 19
  ))
    return simpleError(
      "count",
      "The ante diem count must be an integer from 2 (pridie) up to 19.",
      "invalid_count",
    );
  const namedIndex = MONTHS.findIndex(
    (month) => month.name === input.namedMonth,
  );
  const leapYear = input.leapYear ?? false;
  let resolvedIndex = namedIndex;
  let referenceDay: number;
  let maxCount: number;
  let baseDayCount: number;
  if (input.reference === "kalends") {
    referenceDay = 1;
    resolvedIndex = (namedIndex + 11) % 12;
    const previousLength =
      resolvedIndex === 1 ? (leapYear ? 29 : 28) : MONTHS[resolvedIndex].days;
    const previousIdes = [2, 4, 6, 9].includes(resolvedIndex) ? 15 : 13;
    maxCount = previousLength + 1 - previousIdes;
    baseDayCount = previousLength;
  } else {
    const idesDay = [2, 4, 6, 9].includes(namedIndex) ? 15 : 13;
    referenceDay = input.reference === "nones" ? idesDay - 8 : idesDay;
    maxCount = input.reference === "nones" ? referenceDay - 1 : 8;
    baseDayCount = referenceDay - 1;
  }
  if (input.count > maxCount)
    return simpleError(
      "count",
      `For ${input.reference} of ${input.namedMonth} the count runs only from 2 to ${maxCount}.`,
      "invalid_count",
    );
  const resolvedMonth = MONTHS[resolvedIndex];
  const resolvedDayOfMonth = baseDayCount + 2 - input.count;
  return {
    resolvedDayOfMonth,
    resolvedMonth: resolvedMonth.name,
    referenceDayNumber: referenceDay,
    romanNotation: `${
      input.count === 2 ? "prid." : `a.d. ${toRoman(input.count)}`
    } ${input.reference === "kalends" ? "kal." : input.reference === "nones" ? "non." : "id."} ${MONTHS[namedIndex].abbrev}`,
  };
};

export const kalendsMedievalDateParserExample = {
  input: { reference: "kalends", count: 3, namedMonth: "april" },
  output: {
    resolvedDayOfMonth: 30,
    resolvedMonth: "march",
    referenceDayNumber: 1,
    romanNotation: "a.d. iii kal. apr.",
  },
} satisfies ToolExample<
  KalendsMedievalDateParserInput,
  KalendsMedievalDateParserOutput
>;

export const kalendsMedievalDateParserTool = createSimpleTool({
  id: "paleography/kalends-medieval-date-parser",
  title: "Kalends Medieval Date Parser",
  description:
    "Convert a Roman-style medieval date ('ante diem n kalends/nones/ides of month M') into a day of month by exact inclusive backward counting, with the Ides on the 15th of March/May/July/October and the Nones eight days earlier; leap-year Februaries use the 29-day mapping (medieval scribal practice around the bissextile varied).",
  inputs: [
    {
      description: "Reference day named in the date.",
      enum: ["kalends", "nones", "ides"],
      id: "reference",
      kind: "string",
      label: "Reference",
    },
    {
      description: "Ante diem count (2 = pridie).",
      id: "count",
      kind: "integer",
      label: "Count",
      minimum: 2,
      maximum: 19,
    },
    {
      description: "Month named in the date.",
      enum: [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ],
      id: "namedMonth",
      kind: "string",
      label: "Named month",
    },
    {
      default: false,
      description: "True for a Julian leap year (February has 29 days).",
      id: "leapYear",
      kind: "boolean",
      label: "Leap year",
    },
  ],
  outputs: [
    {
      description: "Day of month the notation resolves to.",
      id: "resolvedDayOfMonth",
      kind: "integer",
      label: "Day",
    },
    {
      description: "Calendar month containing the date.",
      id: "resolvedMonth",
      kind: "string",
      label: "Resolved month",
    },
    {
      description:
        "Day-of-month of the reference day itself (kalends 1, nones 5 or 7, ides 13 or 15).",
      id: "referenceDayNumber",
      kind: "integer",
      label: "Reference day",
    },
    {
      description:
        "Classical abbreviation of the input, e.g. 'a.d. iii kal. apr.'.",
      id: "romanNotation",
      kind: "string",
      label: "Roman notation",
    },
  ],
  calculate: (input) =>
    calculateKalendsMedievalDateParser({
      count: input.count as number,
      leapYear: input.leapYear as boolean,
      namedMonth:
        input.namedMonth as KalendsMedievalDateParserInput["namedMonth"],
      reference: input.reference as KalendsMedievalDateParserInput["reference"],
    }),
});

export const runKalendsMedievalDateParser =
  kalendsMedievalDateParserTool.execute;
export default kalendsMedievalDateParserTool;
