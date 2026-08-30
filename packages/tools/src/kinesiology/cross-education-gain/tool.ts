import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly untrainedLimbBefore: number;
  readonly untrainedLimbAfter: number;
}>;
export type Output = Readonly<{
  readonly absoluteGain: number;
  readonly percentGain: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.untrainedLimbBefore <= 0 || input.untrainedLimbAfter < 0)
    simpleError(
      "untrainedLimbBefore",
      "Positive baseline and nonnegative follow-up strength required.",
    );
  const absoluteGain = input.untrainedLimbAfter - input.untrainedLimbBefore;
  return {
    absoluteGain,
    percentGain: (100 * absoluteGain) / input.untrainedLimbBefore,
  };
};
export const exampleInput = {
  untrainedLimbBefore: 40,
  untrainedLimbAfter: 50,
} satisfies Input;
export const exampleOutput = {
  absoluteGain: 10,
  percentGain: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/cross-education-gain",
  title: "Cross Education Gain",
  description:
    "Measure observed change in the untrained limb; does not establish a causal mechanism.",
  inputs: [
    {
      id: "untrainedLimbBefore",
      label: "Untrained limb before",
      kind: "number",
    },
    { id: "untrainedLimbAfter", label: "Untrained limb after", kind: "number" },
  ],
  outputs: [
    { id: "absoluteGain", label: "Absolute gain", kind: "number" },
    { id: "percentGain", label: "Percent gain", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      untrainedLimbBefore: value.untrainedLimbBefore as number,
      untrainedLimbAfter: value.untrainedLimbAfter as number,
    }),
});
export const run = tool.execute;
export default tool;
