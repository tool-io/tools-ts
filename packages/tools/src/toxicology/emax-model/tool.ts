import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyFittedBaselineResponse: number;
  readonly callerIndependentlyFittedMaximumResponseIncrement: number;
  readonly callerIndependentlyFittedHalfMaximumDose: number;
  readonly actualDose: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyFittedBaselineResponse",
    label: "Caller independently fitted baseline response",
    kind: "number",
  },
  {
    id: "callerIndependentlyFittedMaximumResponseIncrement",
    label: "Caller independently fitted maximum response increment",
    kind: "number",
  },
  {
    id: "callerIndependentlyFittedHalfMaximumDose",
    label: "Caller independently fitted half maximum dose",
    kind: "number",
  },
  { id: "actualDose", label: "Actual dose", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerIndependentlyFittedHalfMaximumDose, "ED50");
  nonnegative(input.actualDose, "dose");
  return {
    conditionalEmaxResponse:
      input.callerIndependentlyFittedBaselineResponse +
      (input.callerIndependentlyFittedMaximumResponseIncrement *
        input.actualDose) /
        (input.callerIndependentlyFittedHalfMaximumDose + input.actualDose),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyFittedBaselineResponse: 1,
    callerIndependentlyFittedMaximumResponseIncrement: 4,
    callerIndependentlyFittedHalfMaximumDose: 2,
    actualDose: 2,
  },
  output: { result: { conditionalEmaxResponse: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/emax-model",
  title: "Emax Model Calculator",
  description:
    "Explicit independently fitted E0+Emaxincrement*d/(ED50+d) response model with nonzero baseline and signed increment. Not the existing normalizedHillEC50fit or a dose recommendation; model fitting, endpoint and extrapolation applicability external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
