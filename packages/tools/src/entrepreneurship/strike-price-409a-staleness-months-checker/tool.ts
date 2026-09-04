import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  holdingDays,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerValuationDate: string;
  readonly observedGrantDate: string;
  readonly callerMaxCompletedMonths: number;
  readonly independentMaterialEventSinceValuation: boolean;
}>;
export type Output = Readonly<{
  readonly completedValuationAgeMonths: number;
  readonly callerStalenessReview: boolean;
}>;
const inputFields = [
  { id: "callerValuationDate", label: "Caller valuation date", kind: "string" },
  { id: "observedGrantDate", label: "Observed grant date", kind: "string" },
  {
    id: "callerMaxCompletedMonths",
    label: "Caller max completed months",
    kind: "number",
  },
  {
    id: "independentMaterialEventSinceValuation",
    label: "Independent material event since valuation",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  holdingDays(input.callerValuationDate, input.observedGrantDate);
  bounded(input.callerMaxCompletedMonths, "months", 1, 120);
  const a = input.callerValuationDate.split("-").map(Number),
    b = input.observedGrantDate.split("-").map(Number),
    m = (b[0] - a[0]) * 12 + b[1] - a[1] - (b[2] < a[2] ? 1 : 0);
  return {
    completedValuationAgeMonths: m,
    callerStalenessReview:
      m >= input.callerMaxCompletedMonths ||
      input.independentMaterialEventSinceValuation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerValuationDate: "2025-01-15",
  observedGrantDate: "2026-01-14",
  callerMaxCompletedMonths: 12,
  independentMaterialEventSinceValuation: true,
} satisfies Input;
export const exampleOutput = {
  completedValuationAgeMonths: 11,
  callerStalenessReview: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/strike-price-409a-staleness-months-checker",
  title: "Strike Price 409a Staleness Months Checker",
  description:
    "Observed completed calendar-month409Avaluation age plus independent material-event flag; not official safe-harbor validity or assumption no event from elapsed time. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "completedValuationAgeMonths",
      label: "Completed valuation age months",
      kind: "number",
    },
    {
      id: "callerStalenessReview",
      label: "Caller staleness review",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerValuationDate: value.callerValuationDate as string,
      observedGrantDate: value.observedGrantDate as string,
      callerMaxCompletedMonths: value.callerMaxCompletedMonths as number,
      independentMaterialEventSinceValuation:
        value.independentMaterialEventSinceValuation as boolean,
    }),
});
export const run = tool.execute;
export default tool;
