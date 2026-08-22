import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const automorphicCheckerTool = createSimpleTool({
  id: "number/automorphic-checker",
  title: "Automorphic Number Checker",
  description:
    "Check whether the square of a nonnegative integer ends with the integer itself.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    { id: "automorphic", label: "Automorphic number", kind: "boolean" },
  ],
  calculate: (input) => {
    const value = input.value as number;
    return {
      automorphic: String(BigInt(value) ** 2n).endsWith(String(value)),
    };
  },
});
export const runAutomorphicChecker = automorphicCheckerTool.execute;
export default automorphicCheckerTool;

export type AutomorphicCheckerInput = {
  readonly value: number;
};

export type AutomorphicCheckerOutput = {
  readonly automorphic: boolean;
};

export const automorphicCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    automorphic: true,
  },
} satisfies ToolExample<AutomorphicCheckerInput, AutomorphicCheckerOutput>;
