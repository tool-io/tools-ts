import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const armstrongCheckerTool = createSimpleTool({
  id: "number/armstrong-checker",
  title: "Armstrong Number Checker",
  description:
    "Check whether a nonnegative integer equals the sum of its digits each raised to the digit count.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [{ id: "armstrong", label: "Armstrong number", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    const digits = String(value);
    let sum = 0n;
    for (const digit of digits) sum += BigInt(digit) ** BigInt(digits.length);
    return { armstrong: sum === BigInt(value) };
  },
});
export const runArmstrongChecker = armstrongCheckerTool.execute;
export default armstrongCheckerTool;

export type ArmstrongCheckerInput = {
  readonly value: number;
};

export type ArmstrongCheckerOutput = {
  readonly armstrong: boolean;
};

export const armstrongCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    armstrong: true,
  },
} satisfies ToolExample<ArmstrongCheckerInput, ArmstrongCheckerOutput>;
