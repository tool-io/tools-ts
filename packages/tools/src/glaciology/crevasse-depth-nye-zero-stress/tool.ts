import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly tensileStressPa: number;
  readonly iceDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{ readonly idealDryNyeCrevasseDepthM: number }>;
const inputFields = [
  { id: "tensileStressPa", label: "Tensile stress pa", kind: "number" },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(input.tensileStressPa, "tensileStressPa");
  return {
    idealDryNyeCrevasseDepthM:
      (2 * input.tensileStressPa) /
      (input.iceDensityKgPerM3 * input.gravityMPerSecondSquared),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tensileStressPa: 90000,
  iceDensityKgPerM3: 900,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = { idealDryNyeCrevasseDepthM: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/crevasse-depth-nye-zero-stress",
  title: "Crevasse Depth Nye Zero Stress",
  description:
    "Calculate ideal dry Nye crevasse depth 2·tensile stress/(rho·g); water pressure, fracture toughness, damage and finite geometry are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealDryNyeCrevasseDepthM",
      label: "Ideal dry nye crevasse depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tensileStressPa: value.tensileStressPa as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
