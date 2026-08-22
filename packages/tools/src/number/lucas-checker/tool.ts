import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LucasCheckerInput = {
  readonly value: number;
};

export type LucasCheckerOutput = {
  readonly isLucas: boolean;
};

export const lucasCheckerExample = {
  input: { value: 76 },
  output: { isLucas: true },
} satisfies ToolExample<LucasCheckerInput, LucasCheckerOutput>;

export const lucasCheckerTool = createSimpleTool({
  id: "number/lucas-checker",
  title: "Lucas Number Checker",
  description:
    "Check whether a nonnegative safe integer equals a Lucas number L(0)=2, L(1)=1, ...",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [
    {
      id: "isLucas",
      label: "Is a Lucas number",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const value = input.value as number;
    if (value === 1) return { isLucas: true };
    let previous = 2;
    let current = 1;
    while (previous < value) {
      if (current > value) return { isLucas: false };
      const next = previous + current;
      previous = current;
      current = next;
    }
    return { isLucas: previous === value };
  },
});
export const runLucasChecker = lucasCheckerTool.execute;
export default lucasCheckerTool;
