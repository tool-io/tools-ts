import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly waveAmplitudeM: number;
  readonly angularFrequencyPerSecond: number;
  readonly waveNumberPerM: number;
  readonly depthBelowSurfaceM: number;
}>;
export type Output = Readonly<{
  readonly deepWaterStokesDriftMPerSecond: number;
}>;
const inputFields = [
  { id: "waveAmplitudeM", label: "Wave amplitude m", kind: "number" },
  {
    id: "angularFrequencyPerSecond",
    label: "Angular frequency per second",
    kind: "number",
  },
  { id: "waveNumberPerM", label: "Wave number per m", kind: "number" },
  { id: "depthBelowSurfaceM", label: "Depth below surface m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.angularFrequencyPerSecond, "angularFrequencyPerSecond");
  positive(input.waveNumberPerM, "waveNumberPerM");
  nonnegative(input.waveAmplitudeM, "waveAmplitudeM");
  nonnegative(input.depthBelowSurfaceM, "depthBelowSurfaceM");
  return {
    deepWaterStokesDriftMPerSecond:
      input.waveAmplitudeM ** 2 *
      input.angularFrequencyPerSecond *
      input.waveNumberPerM *
      Math.exp(-2 * input.waveNumberPerM * input.depthBelowSurfaceM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waveAmplitudeM: 0.1,
  angularFrequencyPerSecond: 1,
  waveNumberPerM: 1,
  depthBelowSurfaceM: 1,
} satisfies Input;
export const exampleOutput = {
  deepWaterStokesDriftMPerSecond: 0.0013533528323661271,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/stokes-drift-surface-velocity",
  title: "Stokes Drift Surface Velocity",
  description:
    "Evaluate monochromatic deep-water Stokes drift at caller depth below surface, not Eulerian mean current; supplied amplitude is half wave height.",
  inputs: inputFields,
  outputs: [
    {
      id: "deepWaterStokesDriftMPerSecond",
      label: "Deep water stokes drift m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waveAmplitudeM: value.waveAmplitudeM as number,
      angularFrequencyPerSecond: value.angularFrequencyPerSecond as number,
      waveNumberPerM: value.waveNumberPerM as number,
      depthBelowSurfaceM: value.depthBelowSurfaceM as number,
    }),
});
export const run = tool.execute;
export default tool;
