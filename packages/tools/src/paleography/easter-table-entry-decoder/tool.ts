import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EasterTableEntryDecoderInput = {
  readonly year: number;
  readonly calendar?: "gregorian" | "julian";
};

export type EasterTableEntryDecoderOutput = {
  readonly goldenNumber: number;
  readonly easterMonth: number;
  readonly easterDay: number;
};

export const calculateEasterTableEntryDecoder = (
  input: EasterTableEntryDecoderInput,
): EasterTableEntryDecoderOutput => {
  if (!(Number.isSafeInteger(input.year) && input.year >= 325))
    return simpleError(
      "year",
      "Year must be an integer no earlier than 325 (Council of Nicaea).",
      "invalid_year",
    );
  const calendar = input.calendar ?? "gregorian";
  if (calendar === "julian") {
    const a = input.year % 4;
    const b = input.year % 7;
    const c = input.year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const total = d + e + 114;
    return {
      goldenNumber: c + 1,
      easterMonth: Math.floor(total / 31),
      easterDay: (total % 31) + 1,
    };
  }
  const a = input.year % 19;
  const b = Math.floor(input.year / 100);
  const c = input.year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const total = h + l - 7 * m + 114;
  return {
    goldenNumber: a + 1,
    easterMonth: Math.floor(total / 31),
    easterDay: (total % 31) + 1,
  };
};

export const easterTableEntryDecoderExample = {
  input: { year: 2025, calendar: "gregorian" },
  output: { goldenNumber: 12, easterMonth: 4, easterDay: 20 },
} satisfies ToolExample<
  EasterTableEntryDecoderInput,
  EasterTableEntryDecoderOutput
>;

export const easterTableEntryDecoderTool = createSimpleTool({
  id: "paleography/easter-table-entry-decoder",
  title: "Easter Table Entry Decoder",
  description:
    "Decode the computus row for a year into golden number and Easter Sunday date using Meeus's Gregorian algorithm or the classic Julian (Alexandrian) algorithm; Julian results are dates in the Julian calendar.",
  inputs: [
    {
      description: "Year to decode (325 or later).",
      id: "year",
      kind: "integer",
      label: "Year",
      minimum: 325,
    },
    {
      default: "gregorian",
      description: "Calendar whose Easter table is consulted.",
      enum: ["gregorian", "julian"],
      id: "calendar",
      kind: "string",
      label: "Calendar",
    },
  ],
  outputs: [
    {
      description: "Golden number of the year (1-19).",
      id: "goldenNumber",
      kind: "integer",
      label: "Golden number",
      maximum: 19,
      minimum: 1,
    },
    {
      description: "Month of Easter Sunday (3 = March, 4 = April).",
      id: "easterMonth",
      kind: "integer",
      label: "Month",
      maximum: 4,
      minimum: 3,
    },
    {
      description: "Day of month of Easter Sunday.",
      id: "easterDay",
      kind: "integer",
      label: "Day",
      maximum: 31,
      minimum: 1,
    },
  ],
  calculate: (input) =>
    calculateEasterTableEntryDecoder({
      calendar: input.calendar as EasterTableEntryDecoderInput["calendar"],
      year: input.year as number,
    }),
});

export const runEasterTableEntryDecoder = easterTableEntryDecoderTool.execute;
export default easterTableEntryDecoderTool;
