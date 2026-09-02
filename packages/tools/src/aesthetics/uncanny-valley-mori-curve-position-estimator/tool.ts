import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, curve } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerMatchedCoordinates: readonly number[];
  readonly callerMatchedResponses: readonly number[];
  readonly queryCoordinate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedCoordinates",
    label: "Caller matched coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedResponses",
    label: "Caller matched responses",
    kind: "numberList",
  },
  { id: "queryCoordinate", label: "Query coordinate", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const c = curve(
    input.callerMatchedCoordinates,
    input.callerMatchedResponses,
    input.queryCoordinate,
  );
  return { interpolatedMatchedResponse: c.value, localMatchedSlope: c.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedCoordinates: [1, 2, 3],
    callerMatchedResponses: [2, 4, 8],
    queryCoordinate: 2.5,
  },
  output: { result: { interpolatedMatchedResponse: 6, localMatchedSlope: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/uncanny-valley-mori-curve-position-estimator",
  title: "Uncanny Valley Mori Curve Position Estimator",
  description:
    "Interpolate actual independently matched Mori-style likeness/affinity observations, not a fabricated universal uncanny-valley curve or its causal location. Independently matched empirical calibration, piecewise linear, no extrapolation; not a universal physiological, psychological, causal or aesthetic threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
