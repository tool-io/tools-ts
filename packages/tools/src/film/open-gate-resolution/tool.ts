import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualFullSensorWidthPhotosites: number;
  readonly actualFullSensorHeightPhotosites: number;
  readonly callerVerifiedHorizontalBinning: number;
  readonly callerVerifiedVerticalBinning: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualFullSensorWidthPhotosites",
    label: "Actual full sensor width photo sites",
    kind: "number",
  },
  {
    id: "actualFullSensorHeightPhotosites",
    label: "Actual full sensor height photo sites",
    kind: "number",
  },
  {
    id: "callerVerifiedHorizontalBinning",
    label: "Caller verified horizontal binning",
    kind: "number",
  },
  {
    id: "callerVerifiedVerticalBinning",
    label: "Caller verified vertical binning",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  [
    input.actualFullSensorWidthPhotosites,
    input.actualFullSensorHeightPhotosites,
    input.callerVerifiedHorizontalBinning,
    input.callerVerifiedVerticalBinning,
  ].forEach((v) => bounded(v, "integer", 1, 1000000));
  if (
    input.actualFullSensorWidthPhotosites %
      input.callerVerifiedHorizontalBinning ||
    input.actualFullSensorHeightPhotosites % input.callerVerifiedVerticalBinning
  )
    simpleError("binning", "Actualwhole-binfullsensorgeometry.");
  return {
    conditionalOpenGateWidthPixels:
      input.actualFullSensorWidthPhotosites /
      input.callerVerifiedHorizontalBinning,
    conditionalOpenGateHeightPixels:
      input.actualFullSensorHeightPhotosites /
      input.callerVerifiedVerticalBinning,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualFullSensorWidthPhotosites: 4000,
    actualFullSensorHeightPhotosites: 3000,
    callerVerifiedHorizontalBinning: 2,
    callerVerifiedVerticalBinning: 2,
  },
  output: {
    result: {
      conditionalOpenGateWidthPixels: 2000,
      conditionalOpenGateHeightPixels: 1500,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/open-gate-resolution",
  title: "Open Gate Resolution Calculator",
  description:
    "Actual full sensor open-gate photo site matrix/bin ned output dimensions, instead of aspect ratio. No fabricated camera model resolution, active pixel mask/demosaic or codec output.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalOpenGateWidthPixels: { type: "number" },
          conditionalOpenGateHeightPixels: { type: "number" },
        },
        required: [
          "conditionalOpenGateWidthPixels",
          "conditionalOpenGateHeightPixels",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
