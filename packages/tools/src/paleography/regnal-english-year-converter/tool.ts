import {
  formatPlainDate,
  millisecondsPerDay,
  parsePlainDate,
} from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RegnalEnglishYearConverterInput = {
  readonly monarch:
    | "henry_ii"
    | "richard_i"
    | "john"
    | "henry_iii"
    | "edward_i"
    | "edward_ii"
    | "edward_iii"
    | "richard_ii"
    | "henry_iv"
    | "henry_v"
    | "henry_vi_first_reign"
    | "edward_iv"
    | "edward_v"
    | "richard_iii"
    | "henry_vii"
    | "henry_viii"
    | "edward_vi"
    | "mary_i"
    | "elizabeth_i"
    | "james_i";
  readonly regnalYear: number;
};

export type RegnalEnglishYearConverterOutput = {
  readonly monarchLabel: string;
  readonly regnalYearStart: string;
  readonly regnalYearEnd: string;
  readonly startCalendarYear: number;
  readonly endCalendarYear: number;
};

type Reign = {
  readonly accession: string;
  readonly label: string;
  readonly reignEnd: string;
};

/**
 * Accession (or coronation, where that is the standard reckoning date) and
 * end of reign (death or deposition) in the Julian calendar with modern year
 * numbering; all textbook dates.
 */
const REIGNS: Record<string, Reign> = {
  henry_ii: {
    accession: "1154-12-19",
    label: "Henry II",
    reignEnd: "1189-07-06",
  },
  richard_i: {
    accession: "1189-09-03",
    label: "Richard I",
    reignEnd: "1199-04-06",
  },
  john: { accession: "1199-05-27", label: "John", reignEnd: "1216-10-19" },
  henry_iii: {
    accession: "1216-10-28",
    label: "Henry III",
    reignEnd: "1272-11-16",
  },
  edward_i: {
    accession: "1272-11-20",
    label: "Edward I",
    reignEnd: "1307-07-07",
  },
  edward_ii: {
    accession: "1307-07-08",
    label: "Edward II (to deposition)",
    reignEnd: "1327-01-20",
  },
  edward_iii: {
    accession: "1327-01-25",
    label: "Edward III",
    reignEnd: "1377-06-21",
  },
  richard_ii: {
    accession: "1377-06-22",
    label: "Richard II (to deposition)",
    reignEnd: "1399-09-29",
  },
  henry_iv: {
    accession: "1399-09-30",
    label: "Henry IV",
    reignEnd: "1413-03-20",
  },
  henry_v: {
    accession: "1413-03-21",
    label: "Henry V",
    reignEnd: "1422-08-31",
  },
  henry_vi_first_reign: {
    accession: "1422-09-01",
    label: "Henry VI, first reign (to deposition)",
    reignEnd: "1461-03-04",
  },
  edward_iv: {
    accession: "1461-03-04",
    label: "Edward IV",
    reignEnd: "1483-04-09",
  },
  edward_v: {
    accession: "1483-04-09",
    label: "Edward V (to deposition)",
    reignEnd: "1483-06-25",
  },
  richard_iii: {
    accession: "1483-06-26",
    label: "Richard III",
    reignEnd: "1485-08-22",
  },
  henry_vii: {
    accession: "1485-08-22",
    label: "Henry VII",
    reignEnd: "1509-04-21",
  },
  henry_viii: {
    accession: "1509-04-22",
    label: "Henry VIII",
    reignEnd: "1547-01-28",
  },
  edward_vi: {
    accession: "1547-01-28",
    label: "Edward VI",
    reignEnd: "1553-07-06",
  },
  mary_i: { accession: "1553-07-06", label: "Mary I", reignEnd: "1558-11-17" },
  elizabeth_i: {
    accession: "1558-11-17",
    label: "Elizabeth I",
    reignEnd: "1603-03-24",
  },
  james_i: {
    accession: "1603-03-24",
    label: "James I",
    reignEnd: "1625-03-27",
  },
};

const addYears = (timestamp: number, years: number): number => {
  const date = new Date(timestamp);
  const moved = Date.UTC(
    date.getUTCFullYear() + years,
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const check = new Date(moved);
  if (
    check.getUTCFullYear() !== date.getUTCFullYear() + years ||
    check.getUTCMonth() !== date.getUTCMonth() ||
    check.getUTCDate() !== date.getUTCDate()
  )
    return simpleError(
      "regnalYear",
      "The anniversary arithmetic failed for this date.",
      "invalid_date",
    );
  return moved;
};

export const calculateRegnalEnglishYearConverter = (
  input: RegnalEnglishYearConverterInput,
): RegnalEnglishYearConverterOutput => {
  const reign = REIGNS[input.monarch];
  if (!reign)
    return simpleError("monarch", "Unknown monarch.", "invalid_monarch");
  if (!(Number.isInteger(input.regnalYear) && input.regnalYear >= 1))
    return simpleError(
      "regnalYear",
      "Regnal years count from 1.",
      "invalid_regnal_year",
    );
  const accessionTs = parsePlainDate(reign.accession);
  const reignEndTs = parsePlainDate(reign.reignEnd);
  const startTs = addYears(accessionTs, input.regnalYear - 1);
  if (startTs > reignEndTs)
    return simpleError(
      "regnalYear",
      `Regnal year ${input.regnalYear} lies beyond ${reign.label}'s reign.`,
      "invalid_regnal_year",
    );
  const endTs = Math.min(addYears(startTs, 1) - millisecondsPerDay, reignEndTs);
  return {
    monarchLabel: reign.label,
    regnalYearStart: formatPlainDate(startTs),
    regnalYearEnd: formatPlainDate(endTs),
    startCalendarYear: new Date(startTs).getUTCFullYear(),
    endCalendarYear: new Date(endTs).getUTCFullYear(),
  };
};

export const regnalEnglishYearConverterExample = {
  input: { monarch: "elizabeth_i", regnalYear: 1 },
  output: {
    monarchLabel: "Elizabeth I",
    regnalYearStart: "1558-11-17",
    regnalYearEnd: "1559-11-16",
    startCalendarYear: 1558,
    endCalendarYear: 1559,
  },
} satisfies ToolExample<
  RegnalEnglishYearConverterInput,
  RegnalEnglishYearConverterOutput
>;

export const regnalEnglishYearConverterTool = createSimpleTool({
  id: "paleography/regnal-english-year-converter",
  title: "Regnal English Year Converter",
  description:
    "Convert an English regnal year into its exact calendar span by anniversary arithmetic from each monarch's documented accession or coronation date to death or deposition (Julian calendar, modern year numbering; Henry VI covers only his first reign).",
  inputs: [
    {
      description: "Monarch whose regnal years are being converted.",
      enum: [
        "henry_ii",
        "richard_i",
        "john",
        "henry_iii",
        "edward_i",
        "edward_ii",
        "edward_iii",
        "richard_ii",
        "henry_iv",
        "henry_v",
        "henry_vi_first_reign",
        "edward_iv",
        "edward_v",
        "richard_iii",
        "henry_vii",
        "henry_viii",
        "edward_vi",
        "mary_i",
        "elizabeth_i",
        "james_i",
      ],
      id: "monarch",
      kind: "string",
      label: "Monarch",
    },
    {
      description: "Regnal year counting from 1.",
      id: "regnalYear",
      kind: "integer",
      label: "Regnal year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Documented name of the monarch and reign scope.",
      id: "monarchLabel",
      kind: "string",
      label: "Monarch",
    },
    {
      description: "First day of the regnal year (YYYY-MM-DD).",
      id: "regnalYearStart",
      kind: "string",
      label: "Start",
    },
    {
      description: "Last day of the regnal year (YYYY-MM-DD).",
      id: "regnalYearEnd",
      kind: "string",
      label: "End",
    },
    {
      description: "Calendar year of the start date.",
      id: "startCalendarYear",
      kind: "number",
      label: "Start year",
    },
    {
      description: "Calendar year of the end date.",
      id: "endCalendarYear",
      kind: "number",
      label: "End year",
    },
  ],
  calculate: (input) =>
    calculateRegnalEnglishYearConverter({
      monarch: input.monarch as RegnalEnglishYearConverterInput["monarch"],
      regnalYear: input.regnalYear as number,
    }),
});

export const runRegnalEnglishYearConverter =
  regnalEnglishYearConverterTool.execute;
export default regnalEnglishYearConverterTool;
