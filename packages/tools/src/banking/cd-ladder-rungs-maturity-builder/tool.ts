import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  bounded,
  allocateMinor,
  addMonths,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly ladderStartDate: string;
  readonly totalLadderPrincipalMinor: number;
  readonly rungCount: number;
  readonly firstTermMonths: number;
  readonly termSpacingMonths: number;
}>;
export type Output = Readonly<{
  readonly rungMaturityDates: readonly string[];
  readonly rungPrincipalMinor: readonly number[];
  readonly rungTermsMonths: readonly number[];
}>;
const inputFields = [
  { id: "ladderStartDate", label: "Ladder start date", kind: "string" },
  {
    id: "totalLadderPrincipalMinor",
    label: "Total ladder principal minor",
    kind: "number",
  },
  { id: "rungCount", label: "Rung count", kind: "number" },
  { id: "firstTermMonths", label: "First term months", kind: "number" },
  { id: "termSpacingMonths", label: "Term spacing months", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.totalLadderPrincipalMinor, "totalLadderPrincipalMinor");
  bounded(input.rungCount, "rungs", 1, 128);
  bounded(input.firstTermMonths, "term", 1, 1200);
  bounded(input.termSpacingMonths, "spacing", 1, 1200);
  const terms = Array.from(
      { length: input.rungCount },
      (_, i) => input.firstTermMonths + i * input.termSpacingMonths,
    ),
    dates = terms.map((t) => addMonths(input.ladderStartDate, t));
  return {
    rungMaturityDates: dates,
    rungPrincipalMinor: allocateMinor(
      input.totalLadderPrincipalMinor,
      Array(input.rungCount).fill(1),
    ),
    rungTermsMonths: terms,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ladderStartDate: "2024-01-31",
  totalLadderPrincipalMinor: 100,
  rungCount: 3,
  firstTermMonths: 1,
  termSpacingMonths: 1,
} satisfies Input;
export const exampleOutput = {
  rungMaturityDates: ["2024-02-29", "2024-03-31", "2024-04-30"],
  rungPrincipalMinor: [34, 33, 33],
  rungTermsMonths: [1, 2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/cd-ladder-rungs-maturity-builder",
  title: "CD Ladder Rungs Maturity Builder Tool",
  description:
    "Build caller CD ladder maturities anchored independently to original start day with end-of-month clamping and exact principal remainder allocation; no rolling-clamp drift, business-day maturity adjustment, rates or reinvestment assumptions.",
  inputs: inputFields,
  outputs: [
    {
      id: "rungMaturityDates",
      label: "Rung maturity dates",
      kind: "stringList",
    },
    {
      id: "rungPrincipalMinor",
      label: "Rung principal minor",
      kind: "numberList",
    },
    { id: "rungTermsMonths", label: "Rung terms months", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      ladderStartDate: value.ladderStartDate as string,
      totalLadderPrincipalMinor: value.totalLadderPrincipalMinor as number,
      rungCount: value.rungCount as number,
      firstTermMonths: value.firstTermMonths as number,
      termSpacingMonths: value.termSpacingMonths as number,
    }),
});
export const run = tool.execute;
export default tool;
