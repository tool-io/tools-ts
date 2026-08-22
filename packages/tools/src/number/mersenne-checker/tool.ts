import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MersenneCheckerInput = {
  readonly value: number;
};

export type MersenneCheckerOutput = {
  readonly isMersenne: boolean;
};

export const mersenneCheckerExample = {
  input: { value: 31 },
  output: { isMersenne: true },
} satisfies ToolExample<MersenneCheckerInput, MersenneCheckerOutput>;

export const mersenneCheckerTool = createSimpleTool({
  id: "number/mersenne-checker",
  title: "Mersenne Number Checker",
  description:
    "Check whether a nonnegative safe integer equals 2^n - 1 for a positive integer n.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    {
      id: "isMersenne",
      label: "Is a Mersenne number",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const candidate = BigInt(value) + 1n;
    return {
      isMersenne: candidate >= 2n && (candidate & (candidate - 1n)) === 0n,
    };
  },
});
export const runMersenneChecker = mersenneCheckerTool.execute;
export default mersenneCheckerTool;
