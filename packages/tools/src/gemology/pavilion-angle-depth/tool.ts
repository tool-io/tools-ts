import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly girdleDiameterMm: number;
  readonly culetDiameterMm: number;
  readonly pavilionDepthMm: number;
}>;
export type Output = Readonly<{
  readonly axisymmetricPavilionSlopeDegrees: number;
}>;
const inputFields = [
  { id: "girdleDiameterMm", label: "Girdle diameter mm", kind: "number" },
  { id: "culetDiameterMm", label: "Culet diameter mm", kind: "number" },
  { id: "pavilionDepthMm", label: "Pavilion depth mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.girdleDiameterMm, "girdleDiameterMm");
  nonnegative(input.culetDiameterMm, "culetDiameterMm");
  nonnegative(input.pavilionDepthMm, "pavilionDepthMm");
  const run = positive(
    (input.girdleDiameterMm - input.culetDiameterMm) / 2,
    "pavilionRun",
  );
  return {
    axisymmetricPavilionSlopeDegrees:
      (Math.atan2(input.pavilionDepthMm, run) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  girdleDiameterMm: 10,
  culetDiameterMm: 2,
  pavilionDepthMm: 4,
} satisfies Input;
export const exampleOutput = {
  axisymmetricPavilionSlopeDegrees: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/pavilion-angle-depth",
  title: "Pavilion Angle from Depth",
  description:
    "Infer coaxial truncated-cone pavilion slope from measured girdle/culet diameters and depth, preserving nonzero culet geometry; no crown-table measurement or ideal-cut/light-return certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "axisymmetricPavilionSlopeDegrees",
      label: "Axisymmetric pavilion slope degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      girdleDiameterMm: value.girdleDiameterMm as number,
      culetDiameterMm: value.culetDiameterMm as number,
      pavilionDepthMm: value.pavilionDepthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
