import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, deg } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly pixelPitchMicrometers: number;
  readonly effectiveFocalMm: number;
}>;
export type Output = Readonly<{
  readonly smallAnglePlateScaleArcsecPerPixel: number;
}>;
const inputFields = [
  {
    id: "pixelPitchMicrometers",
    label: "Pixel pitch micrometers",
    kind: "number",
  },
  { id: "effectiveFocalMm", label: "Effective focal mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pixelPitchMicrometers, "pixelPitchMicrometers");
  positive(input.effectiveFocalMm, "effectiveFocalMm");
  return {
    smallAnglePlateScaleArcsecPerPixel:
      deg(input.pixelPitchMicrometers / 1000 / input.effectiveFocalMm) * 3600,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pixelPitchMicrometers: 5,
  effectiveFocalMm: 1000,
} satisfies Input;
export const exampleOutput = {
  smallAnglePlateScaleArcsecPerPixel: 1.0313240312354819,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/plate-scale-ccd-pixel-calculator",
  title: "Plate Scale arcsec per Pixel CCD Calculator",
  description:
    "Local small-angle CCD scale with effective focal length at actual configuration; not full detector exact field or WCS projection. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "smallAnglePlateScaleArcsecPerPixel",
      label: "Small angle plate scale arcsec per pixel",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pixelPitchMicrometers: value.pixelPitchMicrometers as number,
      effectiveFocalMm: value.effectiveFocalMm as number,
    }),
});
export const run = tool.execute;
export default tool;
