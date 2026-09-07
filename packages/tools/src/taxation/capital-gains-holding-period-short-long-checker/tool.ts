import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  holdingDays,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly acquisitionDate: string;
  readonly dispositionDate: string;
  readonly callerLongTermMinimumElapsedDays: number;
}>;
export type Output = Readonly<{
  readonly observedHoldingDays: number;
  readonly callerLongTermScreen: boolean;
}>;
const inputFields = [
  { id: "acquisitionDate", label: "Acquisition date", kind: "string" },
  { id: "dispositionDate", label: "Disposition date", kind: "string" },
  {
    id: "callerLongTermMinimumElapsedDays",
    label: "Caller long term minimum elapsed days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerLongTermMinimumElapsedDays, "threshold", 1, 100000);
  const d = holdingDays(input.acquisitionDate, input.dispositionDate);
  return {
    observedHoldingDays: d,
    callerLongTermScreen: d >= input.callerLongTermMinimumElapsedDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  acquisitionDate: "2025-01-01",
  dispositionDate: "2026-01-02",
  callerLongTermMinimumElapsedDays: 366,
} satisfies Input;
export const exampleOutput = {
  observedHoldingDays: 366,
  callerLongTermScreen: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/capital-gains-holding-period-short-long-checker",
  title: "Capital Gains Holding Period Short Long Checker",
  description:
    "Actual Gregorian elapsed holding days vs independent caller applicable long-term boundary; caller resolves anniversary/counting/exception rules, not universal365 days. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedHoldingDays",
      label: "Observed holding days",
      kind: "number",
    },
    {
      id: "callerLongTermScreen",
      label: "Caller long term screen",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      acquisitionDate: value.acquisitionDate as string,
      dispositionDate: value.dispositionDate as string,
      callerLongTermMinimumElapsedDays:
        value.callerLongTermMinimumElapsedDays as number,
    }),
});
export const run = tool.execute;
export default tool;
