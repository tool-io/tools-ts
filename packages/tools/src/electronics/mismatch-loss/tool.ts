import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MismatchLossInput = {
  readonly reflectionCoefficient: number;
};

export type MismatchLossOutput = {
  readonly mismatchLossDb: number;
};

export const mismatchLossExample = {
  input: { reflectionCoefficient: 0.2 },
  output: { mismatchLossDb: 0.17728766960431602 },
} satisfies ToolExample<MismatchLossInput, MismatchLossOutput>;

export const mismatchLossTool = createSimpleTool({
  calculate: (input) => {
    const { reflectionCoefficient } = input as unknown as MismatchLossInput;
    const magnitude = Math.abs(reflectionCoefficient);
    if (magnitude >= 1)
      simpleError(
        "reflectionCoefficient",
        "Reflection coefficient magnitude must be below 1.",
        "invalid_reflection",
      );
    return {
      mismatchLossDb: -10 * Math.log10(1 - magnitude * magnitude),
    };
  },
  description:
    "Compute the mismatch loss in decibels caused by a reflection coefficient.",
  id: "electronics/mismatch-loss",
  inputs: [
    {
      id: "reflectionCoefficient",
      kind: "number",
      label: "Reflection coefficient",
    },
  ],
  outputs: [
    {
      id: "mismatchLossDb",
      kind: "number",
      label: "Mismatch loss",
      unit: "dB",
    },
  ],
  title: "Mismatch Loss dB",
});
export const runMismatchLoss = mismatchLossTool.execute;
export default mismatchLossTool;
