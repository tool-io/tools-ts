import { formatPlainDate, parsePlainDate } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IndictionCycleYearSolverInput = {
  readonly indictionNumber: number;
  readonly convention?:
    | "indictio_graeca_september"
    | "indictio_romana_christmas"
    | "indictio_bedana_january";
  readonly searchFromYear?: number;
  readonly searchToYear?: number;
};

export type IndictionCycleYearSolverOutput = {
  readonly startYears: number[];
  readonly matchCount: number;
  readonly firstIndictionStartDate: string;
};

const ANCHORS: Record<
  Exclude<IndictionCycleYearSolverInput["convention"], undefined>,
  { anchorYear: number; month: number; day: number }
> = {
  indictio_graeca_september: { anchorYear: 312, day: 1, month: 9 },
  indictio_romana_christmas: { anchorYear: 312, day: 25, month: 12 },
  indictio_bedana_january: { anchorYear: 313, day: 1, month: 1 },
};

const properMod15 = (value: number): number => ((value % 15) + 15) % 15;

export const calculateIndictionCycleYearSolver = (
  input: IndictionCycleYearSolverInput,
): IndictionCycleYearSolverOutput => {
  if (!(
    Number.isSafeInteger(input.indictionNumber) &&
    input.indictionNumber >= 1 &&
    input.indictionNumber <= 15
  ))
    return simpleError(
      "indictionNumber",
      "Indictions number 1 through 15.",
      "invalid_indiction",
    );
  const convention = input.convention ?? "indictio_graeca_september";
  const searchFromYear = input.searchFromYear ?? 300;
  const searchToYear = input.searchToYear ?? 2100;
  if (!(
    Number.isSafeInteger(searchFromYear) &&
    Number.isSafeInteger(searchToYear) &&
    searchFromYear >= 1 &&
    searchToYear <= 9999 &&
    searchFromYear <= searchToYear &&
    searchToYear - searchFromYear + 1 <= toolResourceLimits.iterations
  ))
    return simpleError(
      "searchFromYear",
      `Search bounds must be integers from 1 through 9999 in ascending order and span at most ${toolResourceLimits.iterations.toLocaleString("en-US")} years.`,
      "invalid_range",
    );
  const anchor = ANCHORS[convention];
  const targetRemainder = properMod15(
    anchor.anchorYear + input.indictionNumber - 1,
  );
  const startYears: number[] = [];
  let firstMatch = -1;
  for (let year = searchFromYear; year <= searchToYear; year += 1) {
    if (properMod15(year) === targetRemainder) {
      if (firstMatch === -1) firstMatch = year;
      startYears.push(year);
    }
  }
  if (firstMatch === -1)
    return { startYears, matchCount: 0, firstIndictionStartDate: "" };
  return {
    startYears,
    matchCount: startYears.length,
    firstIndictionStartDate: formatPlainDate(
      parsePlainDate(
        `${String(firstMatch).padStart(4, "0")}-${String(anchor.month).padStart(2, "0")}-${String(anchor.day).padStart(2, "0")}`,
      ),
    ),
  };
};

export const indictionCycleYearSolverExample = {
  input: {
    convention: "indictio_graeca_september",
    indictionNumber: 15,
    searchFromYear: 1490,
    searchToYear: 1560,
  },
  output: {
    startYears: [1496, 1511, 1526, 1541, 1556],
    matchCount: 5,
    firstIndictionStartDate: "1496-09-01",
  },
} satisfies ToolExample<
  IndictionCycleYearSolverInput,
  IndictionCycleYearSolverOutput
>;

export const indictionCycleYearSolverTool = createSimpleTool({
  id: "paleography/indiction-cycle-year-solver",
  title: "Indiction Cycle Year Solver",
  description:
    "Solve which calendar years begin a given indiction (1-15) under a chosen documented epoch - the Greek indiction turning each 1 September from 312, the Roman papal indiction each 25 December from 312, or the Bedan indiction each 1 January from 313 - using exact modulo-15 arithmetic.",
  inputs: [
    {
      description: "Indiction sought, 1-15.",
      id: "indictionNumber",
      kind: "integer",
      label: "Indiction",
      minimum: 1,
      maximum: 15,
    },
    {
      default: "indictio_graeca_september",
      description: "Epoch convention fixing when the indiction turns.",
      enum: [
        "indictio_graeca_september",
        "indictio_romana_christmas",
        "indictio_bedana_january",
      ],
      id: "convention",
      kind: "string",
      label: "Convention",
    },
    {
      default: 300,
      description: "First year scanned for cycle starts.",
      id: "searchFromYear",
      kind: "integer",
      label: "Search from",
      minimum: 1,
      maximum: 9999,
    },
    {
      default: 2100,
      description: "Last year scanned for cycle starts.",
      id: "searchToYear",
      kind: "integer",
      label: "Search to",
      minimum: 1,
      maximum: 9999,
    },
  ],
  outputs: [
    {
      description:
        "Years in range whose cycle opens with the requested indiction.",
      id: "startYears",
      kind: "numberList",
      label: "Start years",
    },
    {
      description: "How many such years fall inside the range.",
      id: "matchCount",
      kind: "integer",
      label: "Match count",
    },
    {
      description: "Turnover date of the first matching cycle (YYYY-MM-DD).",
      id: "firstIndictionStartDate",
      kind: "string",
      label: "First start",
    },
  ],
  calculate: (input) =>
    calculateIndictionCycleYearSolver({
      convention:
        input.convention as IndictionCycleYearSolverInput["convention"],
      indictionNumber: input.indictionNumber as number,
      searchFromYear: input.searchFromYear as number,
      searchToYear: input.searchToYear as number,
    }),
});

export const runIndictionCycleYearSolver = indictionCycleYearSolverTool.execute;
export default indictionCycleYearSolverTool;
