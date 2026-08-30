import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, wave } from "../shared.js";
export type Input = Readonly<{
  readonly waveHeightM: number;
  readonly periodSeconds: number;
  readonly waterDepthM: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly bottomOrbitalSpeedAmplitudeMPerSecond: number;
}>;
const inputFields = [
  { id: "waveHeightM", label: "Wave height m", kind: "number" },
  { id: "periodSeconds", label: "Period seconds", kind: "number" },
  { id: "waterDepthM", label: "Water depth m", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.waveHeightM, "waveHeightM");
  const w = wave(
      input.periodSeconds,
      input.waterDepthM,
      input.gravityMPerSecondSquared,
    ),
    x = w.k * input.waterDepthM;
  return {
    bottomOrbitalSpeedAmplitudeMPerSecond:
      (input.waveHeightM * w.omega * Math.exp(-x)) / -Math.expm1(-2 * x),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waveHeightM: 0.2,
  periodSeconds: 6.283185307179586,
  waterDepthM: 1,
  gravityMPerSecondSquared: 1.3130352854993315,
} satisfies Input;
export const exampleOutput = {
  bottomOrbitalSpeedAmplitudeMPerSecond: 0.08509181282393216,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/wave-orbital-velocity-at-bottom",
  title: "Wave Orbital Velocity At Bottom",
  description:
    "Calculate finite-depth Airy bottom orbital velocity amplitude using solved dispersion and an overflow-safe inverse-sinh form; linear-wave assumptions exclude breaking and strong nonlinearity.",
  inputs: inputFields,
  outputs: [
    {
      id: "bottomOrbitalSpeedAmplitudeMPerSecond",
      label: "Bottom orbital speed amplitude m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waveHeightM: value.waveHeightM as number,
      periodSeconds: value.periodSeconds as number,
      waterDepthM: value.waterDepthM as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
