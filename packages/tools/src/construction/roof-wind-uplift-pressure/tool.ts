import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyApplicableVelocityPressure: number;
  readonly callerNetRoofPressureCoefficient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyApplicableVelocityPressure",
    label: "Caller independently applicable velocity pressure",
    kind: "number",
  },
  {
    id: "callerNetRoofPressureCoefficient",
    label: "Caller net roof pressure coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyApplicableVelocityPressure,
    "callerIndependentlyApplicableVelocityPressure",
  );
  return {
    value:
      input.callerIndependentlyApplicableVelocityPressure *
      input.callerNetRoofPressureCoefficient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyApplicableVelocityPressure: 5,
    callerNetRoofPressureCoefficient: -2,
  },
  output: { result: { value: -10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/roof-wind-uplift-pressure",
  title: "Roof Wind Uplift Pressure Calculator",
  description:
    "Actual independently governing net pressure q\u00d7signed net coefficient, not net pressure\u00d7roof area already covered; zone/gust/internal pressure coefficient external. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
