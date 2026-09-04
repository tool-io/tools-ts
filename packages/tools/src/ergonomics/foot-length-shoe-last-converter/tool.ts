import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedFootLengthMm: number;
  readonly callerToeAllowanceMm: number;
  readonly callerHeelAllowanceMm: number;
}>;
export type Output = Readonly<{ readonly conditionalLastLengthMm: number }>;
const inputFields = [
  {
    id: "observedFootLengthMm",
    label: "Observed foot length mm",
    kind: "number",
  },
  {
    id: "callerToeAllowanceMm",
    label: "Caller toe allowance mm",
    kind: "number",
  },
  {
    id: "callerHeelAllowanceMm",
    label: "Caller heel allowance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFootLengthMm, "observedFootLengthMm");
  nonnegative(input.callerToeAllowanceMm, "callerToeAllowanceMm");
  nonnegative(input.callerHeelAllowanceMm, "callerHeelAllowanceMm");
  return {
    conditionalLastLengthMm:
      input.observedFootLengthMm +
      input.callerToeAllowanceMm +
      input.callerHeelAllowanceMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFootLengthMm: 250,
  callerToeAllowanceMm: 10,
  callerHeelAllowanceMm: 5,
} satisfies Input;
export const exampleOutput = { conditionalLastLengthMm: 265 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/foot-length-shoe-last-converter",
  title: "Anthropometric Foot Length Shoe Last Size Converter",
  description:
    "Actual foot plus independently prescribed toe/heel allowances yields shoe-last length, not automatic international shoe size or comfortable fit. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalLastLengthMm",
      label: "Conditional last length mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFootLengthMm: value.observedFootLengthMm as number,
      callerToeAllowanceMm: value.callerToeAllowanceMm as number,
      callerHeelAllowanceMm: value.callerHeelAllowanceMm as number,
    }),
});
export const run = tool.execute;
export default tool;
