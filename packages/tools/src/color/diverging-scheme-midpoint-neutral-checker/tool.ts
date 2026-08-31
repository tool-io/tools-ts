import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, lab, nonnegative } from "../batch-shared.js";
export type Input = Readonly<{
  readonly midpointLab: readonly number[];
  readonly callerNeutralChromaCeiling: number;
}>;
export type Output = Readonly<{
  readonly midpointChroma: number;
  readonly withinCallerNeutralChromaPolicy: boolean;
}>;
const inputFields = [
  { id: "midpointLab", label: "Midpoint lab", kind: "numberList" },
  {
    id: "callerNeutralChromaCeiling",
    label: "Caller neutral chroma ceiling",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerNeutralChromaCeiling, "callerNeutralChromaCeiling");
  lab(input.midpointLab);
  const C = Math.hypot(input.midpointLab[1], input.midpointLab[2]);
  return {
    midpointChroma: C,
    withinCallerNeutralChromaPolicy: C <= input.callerNeutralChromaCeiling,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  midpointLab: [50, 3, 4],
  callerNeutralChromaCeiling: 5,
} satisfies Input;
export const exampleOutput = {
  midpointChroma: 5,
  withinCallerNeutralChromaPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/diverging-scheme-midpoint-neutral-checker",
  title: "Diverging Scheme Midpoint Neutral Check",
  description:
    "Audit caller measured diverging-scheme midpoint same-white CIELAB chroma against explicit inclusive neutral tolerance; neutrality alone does not establish perceptual balance, accessibility or symmetry of endpoints.",
  inputs: inputFields,
  outputs: [
    { id: "midpointChroma", label: "Midpoint chroma", kind: "number" },
    {
      id: "withinCallerNeutralChromaPolicy",
      label: "Within caller neutral chroma policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      midpointLab: value.midpointLab as readonly number[],
      callerNeutralChromaCeiling: value.callerNeutralChromaCeiling as number,
    }),
});
export const run = tool.execute;
export default tool;
