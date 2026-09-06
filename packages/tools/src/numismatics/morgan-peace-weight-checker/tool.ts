import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedMassGrams: number;
  readonly callerApplicableToleranceGrams: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedMassGrams", label: "Observed mass grams", kind: "number" },
  {
    id: "callerApplicableToleranceGrams",
    label: "Caller applicable tolerance grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedMassGrams, "mass");
  nonnegative(input.callerApplicableToleranceGrams, "tolerance");
  const delta = input.observedMassGrams - 26.73;
  return {
    nominalMassGrams: 26.73,
    signedMassDifferenceGrams: delta,
    withinCallerMassTolerance:
      Math.abs(delta) <= input.callerApplicableToleranceGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedMassGrams: 26.73, callerApplicableToleranceGrams: 0.02 },
  output: {
    result: {
      nominalMassGrams: 26.73,
      signedMassDifferenceGrams: 0,
      withinCallerMassTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/morgan-peace-weight-checker",
  title: "Morgan Peace Weight Checker",
  description:
    "Compare independently identified original Morgan/Peace standard silver-dollar issue mass to nominal 26.73 grams. Modern commemorative/bullion issues excluded; actual tolerance independently verified, not authenticity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
