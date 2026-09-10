import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedInnovationP: number;
  readonly callerCalibratedImitationQ: number;
  readonly timeYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedInnovationP",
    label: "Caller calibrated innovation p",
    kind: "number",
  },
  {
    id: "callerCalibratedImitationQ",
    label: "Caller calibrated imitation q",
    kind: "number",
  },
  { id: "timeYears", label: "Time years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerCalibratedInnovationP, "p");
  nonnegative(input.callerCalibratedImitationQ, "q");
  nonnegative(input.timeYears, "time");
  const e = Math.exp(
    -(input.callerCalibratedInnovationP + input.callerCalibratedImitationQ) *
      input.timeYears,
  );
  return {
    conditionalCumulativeAdoptionFraction:
      (1 - e) /
      (1 +
        (input.callerCalibratedImitationQ / input.callerCalibratedInnovationP) *
          e),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedInnovationP: 0.03,
    callerCalibratedImitationQ: 0.38,
    timeYears: 0,
  },
  output: { result: { conditionalCumulativeAdoptionFraction: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/bass-adoption-diffusion-p-q",
  title: "Bass Diffusion p, q Adoption Calculator",
  description:
    "Conditional continuous Bass cumulative-adoption model with independently calibrated p>0, q\u22650, time\u22650, no initial adoption. Not a prediction without calibration, market-size constraint or causal peer-effect estimate.",
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
