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
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly drivingStressPa: number;
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly surfaceSlopeDegrees: number;
  readonly valleyShapeFactor: number;
}>;
export type Output = Readonly<{ readonly inferredIceThicknessM: number }>;
const inputFields = [
  { id: "drivingStressPa", label: "Driving stress pa", kind: "number" },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  { id: "surfaceSlopeDegrees", label: "Surface slope degrees", kind: "number" },
  { id: "valleyShapeFactor", label: "Valley shape factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.valleyShapeFactor, "valleyShapeFactor");
  nonnegative(input.drivingStressPa, "drivingStressPa");
  fraction(input.valleyShapeFactor, "valleyShapeFactor");
  if (input.surfaceSlopeDegrees <= 0 || input.surfaceSlopeDegrees >= 90)
    simpleError(
      "surfaceSlopeDegrees",
      "Slope strictly between 0 and 90 required for identifiable inversion.",
    );
  return {
    inferredIceThicknessM:
      input.drivingStressPa /
      (input.iceDensityKgPerM3 *
        input.gravityMPerSecondSquared *
        input.valleyShapeFactor *
        Math.sin((input.surfaceSlopeDegrees * Math.PI) / 180)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  drivingStressPa: 450000,
  iceDensityKgPerM3: 900,
  gravityMPerSecondSquared: 10,
  surfaceSlopeDegrees: 30,
  valleyShapeFactor: 1,
} satisfies Input;
export const exampleOutput = { inferredIceThicknessM: 100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/thickness-from-slope-driving-stress",
  title: "Thickness From Slope Driving Stress",
  description:
    "Invert local shape-corrected slab driving stress for ice thickness; flat-slope inversions are undefined, and longitudinal stresses remain excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredIceThicknessM",
      label: "Inferred ice thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      drivingStressPa: value.drivingStressPa as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      surfaceSlopeDegrees: value.surfaceSlopeDegrees as number,
      valleyShapeFactor: value.valleyShapeFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
