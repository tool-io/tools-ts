import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly particleDiameterM: number;
  readonly particleDensityKgPerM3: number;
  readonly waterDensityKgPerM3: number;
  readonly dynamicViscosityPaSeconds: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly signedStokesVelocityMPerSecond: number;
  readonly particleReynoldsNumber: number;
  readonly withinCreepingFlowScreen: boolean;
}>;
const inputFields = [
  { id: "particleDiameterM", label: "Particle diameter m", kind: "number" },
  {
    id: "particleDensityKgPerM3",
    label: "Particle density kg per m3",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "dynamicViscosityPaSeconds",
    label: "Dynamic viscosity pa seconds",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.particleDiameterM, "particleDiameterM");
  positive(input.particleDensityKgPerM3, "particleDensityKgPerM3");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.dynamicViscosityPaSeconds, "dynamicViscosityPaSeconds");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  const signedStokesVelocityMPerSecond =
      ((input.particleDensityKgPerM3 - input.waterDensityKgPerM3) *
        input.gravityMPerSecondSquared *
        input.particleDiameterM ** 2) /
      (18 * input.dynamicViscosityPaSeconds),
    particleReynoldsNumber =
      (input.waterDensityKgPerM3 *
        Math.abs(signedStokesVelocityMPerSecond) *
        input.particleDiameterM) /
      input.dynamicViscosityPaSeconds;
  return {
    signedStokesVelocityMPerSecond,
    particleReynoldsNumber,
    withinCreepingFlowScreen: particleReynoldsNumber <= 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  particleDiameterM: 0.0001,
  particleDensityKgPerM3: 1100,
  waterDensityKgPerM3: 1000,
  dynamicViscosityPaSeconds: 0.001,
  gravityMPerSecondSquared: 9,
} satisfies Input;
export const exampleOutput = {
  signedStokesVelocityMPerSecond: 0.0005,
  particleReynoldsNumber: 0.05,
  withinCreepingFlowScreen: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/settling-velocity",
  title: "Settling Velocity",
  description:
    "Calculate signed ideal spherical-particle Stokes settling and check Re≤1; upward buoyancy is retained, and nonspherical, flocculated and hindered settling are not modeled.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedStokesVelocityMPerSecond",
      label: "Signed stokes velocity m per second",
      kind: "number",
    },
    {
      id: "particleReynoldsNumber",
      label: "Particle reynolds number",
      kind: "number",
    },
    {
      id: "withinCreepingFlowScreen",
      label: "Within creeping flow screen",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      particleDiameterM: value.particleDiameterM as number,
      particleDensityKgPerM3: value.particleDensityKgPerM3 as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      dynamicViscosityPaSeconds: value.dynamicViscosityPaSeconds as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
