import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CatalanCheckerInput = {
  readonly value: number;
};

export type CatalanCheckerOutput = {
  readonly isCatalan: boolean;
};

export const catalanCheckerExample = {
  input: { value: 42 },
  output: { isCatalan: true },
} satisfies ToolExample<CatalanCheckerInput, CatalanCheckerOutput>;

export const catalanCheckerTool = createSimpleTool({
  id: "number/catalan-checker",
  title: "Catalan Number Checker",
  description:
    "Check whether a nonnegative safe integer is a Catalan number generated with the exact recurrence C(k+1) = C(k) * 2(2k+1) / (k+2).",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    {
      id: "isCatalan",
      label: "Is a Catalan number",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const safeLimit = BigInt(Number.MAX_SAFE_INTEGER);
    let current = 1n;
    let k = 0n;
    while (current <= safeLimit) {
      if (current === BigInt(value)) return { isCatalan: true };
      current = (current * 2n * (2n * k + 1n)) / (k + 2n);
      k += 1n;
    }
    return { isCatalan: false };
  },
});
export const runCatalanChecker = catalanCheckerTool.execute;
export default catalanCheckerTool;
