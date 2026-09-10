import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedSumpRouteDistanceMeters: number;
  readonly callerIndependentlyValidatedActualTravelSpeedMetersPerMinute: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyEstablishedSumpRouteDistanceMeters",
    label: "Caller independently established sump route distance meters",
    kind: "number",
  },
  {
    id: "callerIndependentlyValidatedActualTravelSpeedMetersPerMinute",
    label:
      "Caller independently validated actual travel speed meters per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyEstablishedSumpRouteDistanceMeters,
    "numerator",
  );
  positive(
    input.callerIndependentlyValidatedActualTravelSpeedMetersPerMinute,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.callerIndependentlyEstablishedSumpRouteDistanceMeters) /
      input.callerIndependentlyValidatedActualTravelSpeedMetersPerMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedSumpRouteDistanceMeters: 2,
    callerIndependentlyValidatedActualTravelSpeedMetersPerMinute: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/sump-swim-time-estimate",
  title: "Sump Distance Swim Time Estimate Calculator",
  description:
    "Conditional sump route travel time only, actual current/conditions and demonstrated speed required. No dive gas, safety, decompression or rescue adequacy inferred. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
