import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { kaprekarSteps } from "../milestone-algorithms.js";

export const example = {
  input: {
    value: 3524,
  },
  output: {
    steps: 3,
    sequence: [3524, 3087, 8352, 6174],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tool = createSimpleTool({
  id: "number/kaprekar-steps",
  title: "Kaprekar Steps Calculator",
  description:
    "Apply the four-digit descending-minus-ascending digit routine with leading zeros until 6174 or zero, reporting every intermediate value.",
  inputs: [
    { id: "value", kind: "integer", label: "value", minimum: 0, maximum: 9999 },
  ],
  outputs: [
    { id: "steps", kind: "integer", label: "steps" },
    { id: "sequence", kind: "numberList", label: "sequence" },
  ],
  calculate: (input) => kaprekarSteps(input.value as number),
});
export type KaprekarStepsInput = Readonly<typeof example.input>;
export type KaprekarStepsOutput = Readonly<typeof example.output>;
export const kaprekarStepsTool = tool;
export const runKaprekarSteps = tool.execute;
export default tool;
