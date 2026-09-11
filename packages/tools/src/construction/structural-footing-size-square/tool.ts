import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualTotalFoundationForce: number;
  readonly callerIndependentlyApplicableSoilBearingPressure: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalFoundationForce",
    label: "Actual total foundation force",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicableSoilBearingPressure",
    label: "Caller independently applicable soil bearing pressure",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualTotalFoundationForce, "actualTotalFoundationForce");
  positive(
    input.callerIndependentlyApplicableSoilBearingPressure,
    "callerIndependentlyApplicableSoilBearingPressure",
  );
  return {
    value: Math.sqrt(
      input.actualTotalFoundationForce /
        input.callerIndependentlyApplicableSoilBearingPressure,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTotalFoundationForce: 20,
    callerIndependentlyApplicableSoilBearingPressure: 5,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/structural-footing-size-square",
  title: "Square Footing Size Calculator",
  description:
    "Ideal centricallyuniformsquarefootingsidelengthsqrt(N/qallow), selfweightalreadyinN, no frost/punching/eccentricity design. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
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
