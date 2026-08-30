import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly iceThicknessM: number;
  readonly surfaceSlopeDegrees: number;
  readonly valleyShapeFactor: number;
}>;
export type Output = Readonly<{
  readonly uncorrectedDrivingStressPa: number;
  readonly shapeCorrectedBasalStressPa: number;
}>;
const inputFields = [
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "iceThicknessM", label: "Ice thickness m", kind: "number" },
  { id: "surfaceSlopeDegrees", label: "Surface slope degrees", kind: "number" },
  { id: "valleyShapeFactor", label: "Valley shape factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.iceThicknessM, "iceThicknessM");
  positive(input.valleyShapeFactor, "valleyShapeFactor");
  fraction(input.valleyShapeFactor, "valleyShapeFactor");
  if (input.surfaceSlopeDegrees < 0 || input.surfaceSlopeDegrees >= 90)
    simpleError("surfaceSlopeDegrees", "Slope in [0,90) required.");
  const uncorrectedDrivingStressPa =
    input.iceDensityKgPerM3 *
    input.gravityMPerSecondSquared *
    input.iceThicknessM *
    Math.sin((input.surfaceSlopeDegrees * Math.PI) / 180);
  return {
    uncorrectedDrivingStressPa,
    shapeCorrectedBasalStressPa:
      uncorrectedDrivingStressPa * input.valleyShapeFactor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceDensityKgPerM3: 900,
  gravityMPerSecondSquared: 10,
  iceThicknessM: 100,
  surfaceSlopeDegrees: 30,
  valleyShapeFactor: 0.8,
} satisfies Input;
export const exampleOutput = {
  uncorrectedDrivingStressPa: 450000,
  shapeCorrectedBasalStressPa: 360000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/basal-shear-stress",
  title: "Basal Shear Stress",
  description:
    "Calculate local slab driving and shape-corrected basal shear; longitudinal stress gradients and spatial force balance are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncorrectedDrivingStressPa",
      label: "Uncorrected driving stress pa",
      kind: "number",
    },
    {
      id: "shapeCorrectedBasalStressPa",
      label: "Shape corrected basal stress pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      iceThicknessM: value.iceThicknessM as number,
      surfaceSlopeDegrees: value.surfaceSlopeDegrees as number,
      valleyShapeFactor: value.valleyShapeFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
