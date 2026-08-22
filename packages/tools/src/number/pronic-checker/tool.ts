import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const pronicCheckerTool = createSimpleTool({
  id: "number/pronic-checker",
  title: "Pronic Number Checker",
  description:
    "Check whether a nonnegative integer equals the product of two consecutive integers.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [{ id: "pronic", label: "Pronic number", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    const root = Math.floor(Math.sqrt(value));
    return { pronic: root * (root + 1) === value };
  },
});
export const runPronicChecker = pronicCheckerTool.execute;
export default pronicCheckerTool;

export type PronicCheckerInput = {
  readonly value: number;
};

export type PronicCheckerOutput = {
  readonly pronic: boolean;
};

export const pronicCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    pronic: false,
  },
} satisfies ToolExample<PronicCheckerInput, PronicCheckerOutput>;
