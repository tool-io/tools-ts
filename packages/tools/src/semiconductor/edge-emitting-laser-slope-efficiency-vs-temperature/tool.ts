import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedEdgeLaserTemperatureKelvin: readonly number[];
  readonly observedMatchedOpticalSlopeWattsAmp: readonly number[];
  readonly queryEdgeLaserTemperatureKelvin: number;
}>;
export type Output = Readonly<{
  readonly interpolatedEdgeLaserSlopeWattsAmp: number;
  readonly localMeasuredResponseDerivative: number;
}>;
const inputFields = [
  {
    id: "observedEdgeLaserTemperatureKelvin",
    label: "Observed edge laser temperature kelvin",
    kind: "numberList",
  },
  {
    id: "observedMatchedOpticalSlopeWattsAmp",
    label: "Observed matched optical slope watts amp",
    kind: "numberList",
  },
  {
    id: "queryEdgeLaserTemperatureKelvin",
    label: "Query edge laser temperature kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedOpticalSlopeWattsAmp.forEach((v) =>
    positive(v, "observedMatchedOpticalSlopeWattsAmp"),
  );
  input.observedEdgeLaserTemperatureKelvin.forEach((v) =>
    nonnegative(v, "observedEdgeLaserTemperatureKelvin"),
  );
  nonnegative(
    input.queryEdgeLaserTemperatureKelvin,
    "queryEdgeLaserTemperatureKelvin",
  );
  const result = curve(
    input.observedEdgeLaserTemperatureKelvin,
    input.observedMatchedOpticalSlopeWattsAmp,
    input.queryEdgeLaserTemperatureKelvin,
  );
  return {
    interpolatedEdgeLaserSlopeWattsAmp: result.value,
    localMeasuredResponseDerivative: result.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEdgeLaserTemperatureKelvin: [1, 2, 3],
  observedMatchedOpticalSlopeWattsAmp: [2, 4, 8],
  queryEdgeLaserTemperatureKelvin: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedEdgeLaserSlopeWattsAmp: 6,
  localMeasuredResponseDerivative: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/edge-emitting-laser-slope-efficiency-vs-temperature",
  title:
    "Semiconductor Edge Emitting Laser Slope Efficiency Vs Temperature Calculator",
  description:
    "Read actual edge-emitter same-branch slope-temperature calibration, not forward differential efficiency from photon energy. Independently matched measured piecewise-linear curve only, local slope retained; no extrapolation, invented material constants, process recipe or safety claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedEdgeLaserSlopeWattsAmp",
      label: "Interpolated edge laser slope watts amp",
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
      observedEdgeLaserTemperatureKelvin:
        value.observedEdgeLaserTemperatureKelvin as readonly number[],
      observedMatchedOpticalSlopeWattsAmp:
        value.observedMatchedOpticalSlopeWattsAmp as readonly number[],
      queryEdgeLaserTemperatureKelvin:
        value.queryEdgeLaserTemperatureKelvin as number,
    }),
});
export const run = tool.execute;
export default tool;
