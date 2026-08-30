import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, trajectory } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly gradientsMilliTeslaPerMeter: readonly (readonly number[])[];
  readonly gammaHzPerTesla: number;
}>;
export type Output = Readonly<{
  readonly kSpaceCyclesPerMeter: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList", unit: "ms" },
  {
    id: "gradientsMilliTeslaPerMeter",
    label: "Gradients milli tesla per meter",
    kind: "matrix",
  },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    kSpaceCyclesPerMeter: trajectory(
      input.timesMs,
      input.gradientsMilliTeslaPerMeter,
      input.gammaHzPerTesla,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 1, 2],
  gradientsMilliTeslaPerMeter: [
    [10, 0],
    [10, 0],
    [10, 0],
  ],
  gammaHzPerTesla: 1000000,
} satisfies Input;
export const exampleOutput = {
  kSpaceCyclesPerMeter: [
    [0, 0],
    [10, 0],
    [20, 0],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/cartesian-gradient-kspace-integration",
  title: "Cartesian K-Space Trajectory",
  description:
    "Integrate two-axis piecewise-linear gradients by trapezoids into Cartesian k-space from a zero origin; refocusing sign changes must already be applied to supplied gradients.",
  inputs: inputFields,
  outputs: [
    {
      id: "kSpaceCyclesPerMeter",
      label: "K space cycles per meter",
      kind: "matrix",
    },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      gradientsMilliTeslaPerMeter:
        value.gradientsMilliTeslaPerMeter as readonly (readonly number[])[],
      gammaHzPerTesla: value.gammaHzPerTesla as number,
    }),
});
export const run = tool.execute;
export default tool;
