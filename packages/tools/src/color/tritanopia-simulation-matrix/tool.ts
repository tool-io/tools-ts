import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simulate } from "../batch-shared.js";
export type Input = Readonly<{ readonly baseRgb: readonly number[] }>;
export type Output = Readonly<{
  readonly simulatedRgb: readonly number[];
  readonly clippedLinearChannelIndices: readonly number[];
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return simulate(input.baseRgb, "tritan");
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { baseRgb: [1, 0, 0] } satisfies Input;
export const exampleOutput = {
  simulatedRgb: [0.9999999999999999, 0.0, 0.058385974375206574],
  clippedLinearChannelIndices: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/tritanopia-simulation-matrix",
  title: "Tritanopia Simulation Matrix",
  description:
    "Apply Machado et al. 2009 full-severity tritan matrix in linear sRGB then encode, reporting clipping. Model visualization only, not diagnosis, an exact individual view or accessibility certification.",
  inputs: inputFields,
  outputs: [
    { id: "simulatedRgb", label: "Simulated rgb", kind: "numberList" },
    {
      id: "clippedLinearChannelIndices",
      label: "Clipped linear channel indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({ baseRgb: value.baseRgb as readonly number[] }),
});
export const run = tool.execute;
export default tool;
