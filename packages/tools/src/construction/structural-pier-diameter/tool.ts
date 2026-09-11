import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualTotalPierVerticalForce: number;
  readonly callerIndependentlyApplicablePierCompressionStress: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalPierVerticalForce",
    label: "Actual total pier vertical force",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicablePierCompressionStress",
    label: "Caller independently applicable pier compression stress",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualTotalPierVerticalForce,
    "actualTotalPierVerticalForce",
  );
  positive(
    input.callerIndependentlyApplicablePierCompressionStress,
    "callerIndependentlyApplicablePierCompressionStress",
  );
  return {
    value: Math.sqrt(
      (4 * input.actualTotalPierVerticalForce) /
        (Math.PI * input.callerIndependentlyApplicablePierCompressionStress),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTotalPierVerticalForce: 15.707963267948966,
    callerIndependentlyApplicablePierCompressionStress: 5,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/structural-pier-diameter",
  title: "Pier Diameter Calculator",
  description:
    "Ideal circular pier diameter from uniformaxialstresssqrt(4N/(\u03c0\u03c3)), not ground bearing/capacity or reinforcement. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
