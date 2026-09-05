import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly hydraulicApertureM: number;
  readonly fluidDensityKgM3: number;
  readonly gravityMSecond2: number;
  readonly viscosityPaSecond: number;
}>;
export type Output = Readonly<{
  readonly fractureTransmissivityM2Second: number;
}>;
const inputFields = [
  { id: "hydraulicApertureM", label: "Hydraulic aperture m", kind: "number" },
  { id: "fluidDensityKgM3", label: "Fluid density kg m3", kind: "number" },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
  { id: "viscosityPaSecond", label: "Viscosity pa second", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.hydraulicApertureM, "hydraulicApertureM");
  positive(input.fluidDensityKgM3, "fluidDensityKgM3");
  positive(input.gravityMSecond2, "gravityMSecond2");
  positive(input.viscosityPaSecond, "viscosityPaSecond");
  return {
    fractureTransmissivityM2Second:
      (input.fluidDensityKgM3 *
        input.gravityMSecond2 *
        input.hydraulicApertureM ** 3) /
      (12 * input.viscosityPaSecond),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hydraulicApertureM: 0.01,
  fluidDensityKgM3: 1000,
  gravityMSecond2: 10,
  viscosityPaSecond: 0.01,
} satisfies Input;
export const exampleOutput = {
  fractureTransmissivityM2Second: 0.08333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/fracture-transmissivity-cubic-law",
  title: "Geology Fracture Transmissivity Cubic Law Calculator",
  description:
    "Fluid-dependent cubic-lawρgb³/(12μ) fracture transmissivity; distinct from intrinsic b²/12. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fractureTransmissivityM2Second",
      label: "Fracture transmissivity m2 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      hydraulicApertureM: value.hydraulicApertureM as number,
      fluidDensityKgM3: value.fluidDensityKgM3 as number,
      gravityMSecond2: value.gravityMSecond2 as number,
      viscosityPaSecond: value.viscosityPaSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
