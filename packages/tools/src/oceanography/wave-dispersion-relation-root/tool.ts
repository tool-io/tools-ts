import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, wave } from "../shared.js";
export type Input = Readonly<{
  readonly periodSeconds: number;
  readonly waterDepthM: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly waveNumberPerM: number;
  readonly wavelengthM: number;
  readonly phaseSpeedMPerSecond: number;
  readonly groupSpeedMPerSecond: number;
}>;
const inputFields = [
  { id: "periodSeconds", label: "Period seconds", kind: "number" },
  { id: "waterDepthM", label: "Water depth m", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const w = wave(
    input.periodSeconds,
    input.waterDepthM,
    input.gravityMPerSecondSquared,
  );
  return {
    waveNumberPerM: w.k,
    wavelengthM: (2 * Math.PI) / w.k,
    phaseSpeedMPerSecond: w.phase,
    groupSpeedMPerSecond: w.group,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  periodSeconds: 6.283185307179586,
  waterDepthM: 1,
  gravityMPerSecondSquared: 1.3130352854993315,
} satisfies Input;
export const exampleOutput = {
  waveNumberPerM: 1,
  wavelengthM: 6.283185307179586,
  phaseSpeedMPerSecond: 1,
  groupSpeedMPerSecond: 0.7757205647717833,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-dispersion-relation-root",
  title: "Wave Dispersion Relation Root Solver",
  description:
    "Solve finite-depth linear dispersion omega²=g k tanh(kh) by bounded dimensionless bisection, returning phase/group speeds without deep/shallow aliases.",
  inputs: inputFields,
  outputs: [
    { id: "waveNumberPerM", label: "Wave number per m", kind: "number" },
    { id: "wavelengthM", label: "Wavelength m", kind: "number" },
    {
      id: "phaseSpeedMPerSecond",
      label: "Phase speed m per second",
      kind: "number",
    },
    {
      id: "groupSpeedMPerSecond",
      label: "Group speed m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      periodSeconds: value.periodSeconds as number,
      waterDepthM: value.waterDepthM as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
