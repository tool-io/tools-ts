import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly spotDisplacementMillimeters: number;
  readonly autocollimatorFocalLengthMillimeters: number;
}>;
export type Output = Readonly<{
  readonly mirrorAngleRadians: number;
  readonly mirrorAngleArcseconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.autocollimatorFocalLengthMillimeters <= 0)
    simpleError(
      "autocollimatorFocalLengthMillimeters",
      "Focal length must be positive.",
      "invalid_focal_length",
    );
  const mirrorAngleRadians =
    input.spotDisplacementMillimeters /
    (2 * input.autocollimatorFocalLengthMillimeters);
  return {
    mirrorAngleRadians,
    mirrorAngleArcseconds: ((mirrorAngleRadians * 180) / Math.PI) * 3600,
  };
};

export const exampleInput = {
  spotDisplacementMillimeters: 2,
  autocollimatorFocalLengthMillimeters: 1,
} satisfies Input;
export const exampleOutput = {
  mirrorAngleRadians: 1,
  mirrorAngleArcseconds: 206264.80624709636,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      spotDisplacementMillimeters: input.spotDisplacementMillimeters as number,
      autocollimatorFocalLengthMillimeters:
        input.autocollimatorFocalLengthMillimeters as number,
    }),
  description: "Convert autocollimator spot displacement into mirror angle.",
  id: "laser/autocollimator-angle",
  inputs: [
    {
      id: "spotDisplacementMillimeters",
      label: "Reflected spot displacement",
      kind: "number",
      unit: "mm",
    },
    {
      id: "autocollimatorFocalLengthMillimeters",
      label: "Autocollimator focal length",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "mirrorAngleRadians",
      label: "Mirror angle",
      kind: "number",
      unit: "rad",
    },
    {
      id: "mirrorAngleArcseconds",
      label: "Mirror angle",
      kind: "number",
      unit: "arcsec",
    },
  ],
  title: "Autocollimator Angle",
});

export const run = tool.execute;
export default tool;
