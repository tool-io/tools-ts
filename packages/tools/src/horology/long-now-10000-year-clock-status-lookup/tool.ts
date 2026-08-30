import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const clockEntries = {
  assemblyStatus: {
    keyDate: "official project page accessed 2026-09-24",
    statement:
      "The Long Now Foundation states that the first monument-scale 10,000 Year Clock is still being assembled inside a mountain in West Texas.",
  },
  chimes: {
    keyDate: "design",
    statement:
      "The official project describes astronomical and calendar displays plus a chime generator designed to produce more than 3.5 million unique sequences across ten millennia.",
  },
  designPrinciples: {
    keyDate: "engineering principles",
    statement:
      "The Foundation states the design principles as longevity, maintainability, and transparency, including familiar materials, buildable parts, and an included manual.",
  },
  energy: {
    keyDate: "power system",
    statement:
      "The monument-scale clock is described as a mechanical clock powered by mechanical energy harvested from sunlight.",
  },
  prototypeHistory: {
    keyDate: "1999–2005",
    statement:
      "The Foundation's archive states that the first nine-foot prototype was completed for New Year's Eve 1999 and displayed at London's Science Museum; it also documents a second larger prototype.",
  },
} as const;

export type LongNowStatusFocus = keyof typeof clockEntries;

export type LongNowStatusLookupInput = {
  readonly statusFocus: LongNowStatusFocus;
};

export type LongNowStatusLookupOutput = {
  readonly keyDate: string;
  readonly statusFocus: LongNowStatusFocus;
  readonly verifiedStatement: string;
};

export const lookupLongNowClockStatus = (
  input: LongNowStatusLookupInput,
): LongNowStatusLookupOutput => {
  const entry = clockEntries[input.statusFocus];
  if (entry === undefined)
    simpleError(
      "statusFocus",
      "Long Now clock status focus is not supported.",
      "unsupported_status_focus",
    );
  return {
    keyDate: entry.keyDate,
    statusFocus: input.statusFocus,
    verifiedStatement: entry.statement,
  };
};

export const longNowExample = {
  input: { statusFocus: "assemblyStatus" },
  output: {
    keyDate: "official project page accessed 2026-09-24",
    statusFocus: "assemblyStatus",
    verifiedStatement:
      "The Long Now Foundation states that the first monument-scale 10,000 Year Clock is still being assembled inside a mountain in West Texas.",
  },
} satisfies ToolExample<LongNowStatusLookupInput, LongNowStatusLookupOutput>;

export const longNowTool = createSimpleTool({
  calculate: (input) =>
    lookupLongNowClockStatus({
      statusFocus: input.statusFocus as LongNowStatusFocus,
    }),
  description:
    "Return a dated Long Now Foundation assembly-status snapshot, solar-energy concept, design principles, chime program, or 1999 prototype history.",
  id: "horology/long-now-10000-year-clock-status-lookup",
  inputs: [
    {
      enum: [
        "assemblyStatus",
        "energy",
        "designPrinciples",
        "chimes",
        "prototypeHistory",
      ],
      id: "statusFocus",
      kind: "string",
      label: "Long Now 10,000-year clock status focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Project date or status" },
    {
      id: "statusFocus",
      kind: "string",
      label: "Long Now 10,000-year clock status focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Long Now statement",
    },
  ],
  title: "Long Now 10,000-Year Clock Status Lookup",
});

export const runLongNow = longNowTool.execute;
export default longNowTool;
