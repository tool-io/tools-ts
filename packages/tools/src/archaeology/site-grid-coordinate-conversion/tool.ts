import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  shape,
  rad,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly localGridXY: readonly (readonly number[])[];
  readonly callerScaleMetersPerGridUnit: number;
  readonly callerCounterclockwiseRotationDegrees: number;
  readonly callerPlanarTranslationMeters: readonly number[];
}>;
export type Output = Readonly<{
  readonly sitePlanarCoordinatesMeters: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "localGridXY", label: "Local grid x y", kind: "matrix" },
  {
    id: "callerScaleMetersPerGridUnit",
    label: "Caller scale meters per grid unit",
    kind: "number",
  },
  {
    id: "callerCounterclockwiseRotationDegrees",
    label: "Caller counterclockwise rotation degrees",
    kind: "number",
  },
  {
    id: "callerPlanarTranslationMeters",
    label: "Caller planar translation meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerScaleMetersPerGridUnit, "callerScaleMetersPerGridUnit");
  if (
    shape(input.localGridXY, "grid") !== 2 ||
    input.callerPlanarTranslationMeters.length !== 2
  )
    simpleError(
      "coordinates",
      "Actual localplanarXYand two-component translation.",
    );
  const c = Math.cos(rad(input.callerCounterclockwiseRotationDegrees)),
    s = Math.sin(rad(input.callerCounterclockwiseRotationDegrees)),
    k = input.callerScaleMetersPerGridUnit;
  return {
    sitePlanarCoordinatesMeters: input.localGridXY.map(([x, y]) => [
      input.callerPlanarTranslationMeters[0] + k * (c * x - s * y),
      input.callerPlanarTranslationMeters[1] + k * (s * x + c * y),
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  localGridXY: [
    [1, 0],
    [0, 1],
  ],
  callerScaleMetersPerGridUnit: 2,
  callerCounterclockwiseRotationDegrees: 90,
  callerPlanarTranslationMeters: [10, 20],
} satisfies Input;
export const exampleOutput = {
  sitePlanarCoordinatesMeters: [
    [10, 22],
    [8, 20],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/site-grid-coordinate-conversion",
  title: "Site Grid Coordinate Converter",
  description:
    "Explicit local planar site grid similarity transform, not lat/lonprojection, geodesy or unexplained datum shift. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "sitePlanarCoordinatesMeters",
      label: "Site planar coordinates meters",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      localGridXY: value.localGridXY as readonly (readonly number[])[],
      callerScaleMetersPerGridUnit:
        value.callerScaleMetersPerGridUnit as number,
      callerCounterclockwiseRotationDegrees:
        value.callerCounterclockwiseRotationDegrees as number,
      callerPlanarTranslationMeters:
        value.callerPlanarTranslationMeters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
