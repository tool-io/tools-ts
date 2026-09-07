import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, curve } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGratingIncidentAngleDeg: readonly number[];
  readonly observedMatchedCouplingFraction: readonly number[];
  readonly queryIncidentAngleDeg: number;
}>;
export type Output = Readonly<{
  readonly interpolatedAngleMatchedCouplingFraction: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedGratingIncidentAngleDeg",
    label: "Observed grating incident angle deg",
    kind: "numberList",
  },
  {
    id: "observedMatchedCouplingFraction",
    label: "Observed matched coupling fraction",
    kind: "numberList",
  },
  {
    id: "queryIncidentAngleDeg",
    label: "Query incident angle deg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedCouplingFraction.forEach((v) =>
    fraction(v, "observedMatchedCouplingFraction"),
  );
  const result = curve(
    input.observedGratingIncidentAngleDeg,
    input.observedMatchedCouplingFraction,
    input.queryIncidentAngleDeg,
  );
  return {
    interpolatedAngleMatchedCouplingFraction: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGratingIncidentAngleDeg: [1, 2, 3],
  observedMatchedCouplingFraction: [0.2, 0.4, 0.8],
  queryIncidentAngleDeg: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedAngleMatchedCouplingFraction: 0.6,
  localMeasuredResponseDerivative: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-photonics-grating-coupler-efficiency-vs-angle",
  title:
    "Semiconductor Silicon Photonics Grating Coupler Efficiency Vs Angle Calculator",
  description:
    "Read actual same-wavelength grating angle/coupling calibration, distinct from path-corrected power yield and no guessed optimum angle. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedAngleMatchedCouplingFraction",
      label: "Interpolated angle matched coupling fraction",
      kind: "number",
    },
    {
      id: "localMeasuredResponseDerivative",
      label: "Local measured response derivative",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGratingIncidentAngleDeg:
        value.observedGratingIncidentAngleDeg as readonly number[],
      observedMatchedCouplingFraction:
        value.observedMatchedCouplingFraction as readonly number[],
      queryIncidentAngleDeg: value.queryIncidentAngleDeg as number,
    }),
});
export const run = tool.execute;
export default tool;
