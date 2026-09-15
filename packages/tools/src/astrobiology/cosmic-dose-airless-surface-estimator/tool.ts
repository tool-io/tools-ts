import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredDoseMsvPerDay: number;
  readonly days: number;
  readonly exposureFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMeasuredDoseMsvPerDay",
    label: "Caller measured dose msv per day",
    kind: "number",
  },
  { id: "days", label: "Days", kind: "number" },
  { id: "exposureFraction", label: "Exposure fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.callerMeasuredDoseMsvPerDay, "dose");
  nonnegative(i.days, "days");
  fraction(i.exposureFraction, "fraction");
  return {
    conditionalDoseMsv:
      i.callerMeasuredDoseMsvPerDay * i.days * i.exposureFraction,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { callerMeasuredDoseMsvPerDay: 1, days: 365, exposureFraction: 0.5 },
  output: { result: { conditionalDoseMsv: 182.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/cosmic-dose-airless-surface-estimator",
  title: "Cosmic Radiation Dose on Airless Surface mSv/year Estimator",
  description:
    "Exposure inventory using independently established airless-surface dose rate and shield/time fraction; no cosmic-ray transport or biologically safe exposure prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
