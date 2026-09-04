import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedStackLengthsFeet: readonly number[];
  readonly observedStackWidthsFeet: readonly number[];
  readonly observedStackHeightsFeet: readonly number[];
  readonly observedSolidWoodFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedStandardStackCords: number;
  readonly observedSolidWoodCubicFeet: number;
}>;
const inputFields = [
  {
    id: "observedStackLengthsFeet",
    label: "Observed stack lengths feet",
    kind: "numberList",
  },
  {
    id: "observedStackWidthsFeet",
    label: "Observed stack widths feet",
    kind: "numberList",
  },
  {
    id: "observedStackHeightsFeet",
    label: "Observed stack heights feet",
    kind: "numberList",
  },
  {
    id: "observedSolidWoodFractions",
    label: "Observed solid wood fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStackLengthsFeet.forEach((v) =>
    nonnegative(v, "observedStackLengthsFeet"),
  );
  input.observedStackWidthsFeet.forEach((v) =>
    nonnegative(v, "observedStackWidthsFeet"),
  );
  input.observedStackHeightsFeet.forEach((v) =>
    nonnegative(v, "observedStackHeightsFeet"),
  );
  input.observedSolidWoodFractions.forEach((v) =>
    fraction(v, "observedSolidWoodFractions"),
  );
  aligned(
    input.observedStackLengthsFeet,
    input.observedStackWidthsFeet,
    "observedStackLengthsFeet",
  );
  aligned(
    input.observedStackLengthsFeet,
    input.observedStackHeightsFeet,
    "observedStackLengthsFeet",
  );
  aligned(
    input.observedStackLengthsFeet,
    input.observedSolidWoodFractions,
    "observedStackLengthsFeet",
  );
  const stack = input.observedStackLengthsFeet.map(
    (v, i) =>
      v * input.observedStackWidthsFeet[i] * input.observedStackHeightsFeet[i],
  );
  return {
    observedStandardStackCords: sum(stack) / 128,
    observedSolidWoodCubicFeet: sum(
      stack.map((v, i) => v * input.observedSolidWoodFractions[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStackLengthsFeet: [8, 4],
  observedStackWidthsFeet: [4, 4],
  observedStackHeightsFeet: [4, 4],
  observedSolidWoodFractions: [0.5, 0.75],
} satisfies Input;
export const exampleOutput = {
  observedStandardStackCords: 1.5,
  observedSolidWoodCubicFeet: 112,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/firewood-stack-cord-measure-standard-4x4x8",
  title: "Standard Cord 4x4x8 Stack Measure Calculator",
  description:
    "Reconcile observed stacked firewood128ft³ cords and independently measured solid fractions; cords are stack envelope not128ft³ solid wood, no commercial legal scaling claim. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedStandardStackCords",
      label: "Observed standard stack cords",
      kind: "number",
    },
    {
      id: "observedSolidWoodCubicFeet",
      label: "Observed solid wood cubic feet",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStackLengthsFeet:
        value.observedStackLengthsFeet as readonly number[],
      observedStackWidthsFeet:
        value.observedStackWidthsFeet as readonly number[],
      observedStackHeightsFeet:
        value.observedStackHeightsFeet as readonly number[],
      observedSolidWoodFractions:
        value.observedSolidWoodFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
