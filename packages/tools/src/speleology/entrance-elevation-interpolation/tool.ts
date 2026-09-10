import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  referenceInterpolation,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualAlongContourTransectDistancesMeters: readonly number[];
  readonly actualContourElevationsMeters: readonly number[];
  readonly actualEntranceTransectDistanceMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAlongContourTransectDistancesMeters",
    label: "Actual along contour transect distances meters",
    kind: "numberList",
  },
  {
    id: "actualContourElevationsMeters",
    label: "Actual contour elevations meters",
    kind: "numberList",
  },
  {
    id: "actualEntranceTransectDistanceMeters",
    label: "Actual entrance transect distance meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    conditionalInterpolatedEntranceElevationMeters: referenceInterpolation(
      input.actualAlongContourTransectDistancesMeters,
      input.actualContourElevationsMeters,
      input.actualEntranceTransectDistanceMeters,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAlongContourTransectDistancesMeters: [0, 10],
    actualContourElevationsMeters: [100, 120],
    actualEntranceTransectDistanceMeters: 5,
  },
  output: { result: { conditionalInterpolatedEntranceElevationMeters: 110 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/entrance-elevation-interpolation",
  title: "Cave Entrance Elevation Interpolation from Contours Calculator",
  description:
    "Local piecewise-linear entrance-elevation interpolation between actual matched transect/contour intersections, no extrapolation. Terrain shape/CRSdatum and contour uncertainty external, not exact height survey.",
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
