import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EvilCheckerInput = {
  readonly value: number;
};

export type EvilCheckerOutput = {
  readonly isEvil: boolean;
};

export const evilCheckerExample = {
  input: { value: 3 },
  output: { isEvil: true },
} satisfies ToolExample<EvilCheckerInput, EvilCheckerOutput>;

export const calculateEvilChecker = (
  input: EvilCheckerInput,
): EvilCheckerOutput => ({
  isEvil: (input.value.toString(2).match(/1/g) ?? []).length % 2 === 0,
});

export const evilCheckerTool = createSimpleTool({
  id: "number/evil-checker",
  title: "Evil Number Checker",
  description:
    "Check whether a nonnegative integer has an even count of one bits in binary.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [{ id: "isEvil", label: "Is an evil number", kind: "boolean" }],
  calculate: (input) => calculateEvilChecker({ value: input.value as number }),
});
export const runEvilChecker = evilCheckerTool.execute;
export default evilCheckerTool;
