import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simulate } from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseRgb: readonly number[];
  readonly severityFraction: number;
}>;
export type Output = Readonly<{
  readonly simulatedRgb: readonly number[];
  readonly clippedLinearChannelIndices: readonly number[];
}>;
const inputFields = [
  { id: "baseRgb", label: "Base rgb", kind: "numberList" },
  { id: "severityFraction", label: "Severity fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return simulate(input.baseRgb, "protan", input.severityFraction);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseRgb: [1, 0, 0],
  severityFraction: 0,
} satisfies Input;
export const exampleOutput = {
  simulatedRgb: [1, 0, 0],
  clippedLinearChannelIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/protanomaly-severity-interpolation",
  title: "Protanomaly Severity Interpolation",
  description:
    "Interpolate adjacent published Machado protanomaly matrices at 0.1 severity steps in linear RGB, then encode/clamp and report excursions; a model visualization, not an exact individual view, clinical severity scale or accessibility certification.",
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
    calculate({
      baseRgb: value.baseRgb as readonly number[],
      severityFraction: value.severityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
