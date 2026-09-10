import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  loopSurvey,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualShotDistanceMeters: number;
  readonly actualAzimuthDegrees: number;
  readonly actualInclinationDegrees: number;
  readonly actualStartXyzMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualShotDistanceMeters",
    label: "Actual shot distance meters",
    kind: "number",
  },
  {
    id: "actualAzimuthDegrees",
    label: "Actual azimuth degrees",
    kind: "number",
  },
  {
    id: "actualInclinationDegrees",
    label: "Actual inclination degrees",
    kind: "number",
  },
  {
    id: "actualStartXyzMeters",
    label: "Actual start xyz meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualStartXyzMeters.length !== 3)
    simpleError("start", "3Dstationcoordinate.");
  const s = loopSurvey([
    [
      input.actualShotDistanceMeters,
      input.actualAzimuthDegrees,
      input.actualInclinationDegrees,
    ],
  ]);
  return {
    conditionalEndXyzMeters: input.actualStartXyzMeters.map(
      (v, i) => v + s.signedClosureMeters[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualShotDistanceMeters: 5,
    actualAzimuthDegrees: 90,
    actualInclinationDegrees: 0,
    actualStartXyzMeters: [1, 2, 3],
  },
  output: { result: { conditionalEndXyzMeters: [6, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/survey-shot-3d-coordinate",
  title: "Survey Shot 3D Coordinate Calculator",
  description:
    "Cave shot Cartesian endpoint, xEastyNorthzup, azimuth clockwise from north, inclination positive-up. Declination/calibration datum actual independently corrected; no curved map projection or adjustment.",
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
