import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly innerBangleDiameterMm: number;
  readonly radialBandThicknessMm: number;
  readonly axialBandHeightMm: number;
  readonly materialDensityGramsPerCm3: number;
}>;
export type Output = Readonly<{
  readonly ellipticalTorusVolumeMm3: number;
  readonly modeledBangleMassGrams: number;
}>;
const inputFields = [
  {
    id: "innerBangleDiameterMm",
    label: "Inner bangle diameter mm",
    kind: "number",
  },
  {
    id: "radialBandThicknessMm",
    label: "Radial band thickness mm",
    kind: "number",
  },
  { id: "axialBandHeightMm", label: "Axial band height mm", kind: "number" },
  {
    id: "materialDensityGramsPerCm3",
    label: "Material density grams per cm3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.innerBangleDiameterMm, "innerBangleDiameterMm");
  positive(input.radialBandThicknessMm, "radialBandThicknessMm");
  positive(input.axialBandHeightMm, "axialBandHeightMm");
  positive(input.materialDensityGramsPerCm3, "materialDensityGramsPerCm3");
  const major = (input.innerBangleDiameterMm + input.radialBandThicknessMm) / 2,
    a = input.radialBandThicknessMm / 2,
    b = input.axialBandHeightMm / 2,
    ellipticalTorusVolumeMm3 = 2 * Math.PI * Math.PI * major * a * b;
  return {
    ellipticalTorusVolumeMm3,
    modeledBangleMassGrams:
      (ellipticalTorusVolumeMm3 / 1000) * input.materialDensityGramsPerCm3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  innerBangleDiameterMm: 50,
  radialBandThicknessMm: 10,
  axialBandHeightMm: 8,
  materialDensityGramsPerCm3: 3,
} satisfies Input;
export const exampleOutput = {
  ellipticalTorusVolumeMm3: 11843.52528130723,
  modeledBangleMassGrams: 35.53057584392169,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/jade-bangle-weight",
  title: "Jade Bangle ID-to-Weight Estimator",
  description:
    "Estimate measured smooth bangle as elliptical-section torus under supplied density; no jade identity, rectangular section substitution or assumption of hidden cracks/voids.",
  inputs: inputFields,
  outputs: [
    {
      id: "ellipticalTorusVolumeMm3",
      label: "Elliptical torus volume mm3",
      kind: "number",
    },
    {
      id: "modeledBangleMassGrams",
      label: "Modeled bangle mass grams",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      innerBangleDiameterMm: value.innerBangleDiameterMm as number,
      radialBandThicknessMm: value.radialBandThicknessMm as number,
      axialBandHeightMm: value.axialBandHeightMm as number,
      materialDensityGramsPerCm3: value.materialDensityGramsPerCm3 as number,
    }),
});
export const run = tool.execute;
export default tool;
