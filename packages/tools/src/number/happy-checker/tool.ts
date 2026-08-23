import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HappyCheckerInput = {
  readonly value: number;
};

export type HappyCheckerOutput = {
  readonly isHappy: boolean;
};

export const happyCheckerExample = {
  input: { value: 19 },
  output: { isHappy: true },
} satisfies ToolExample<HappyCheckerInput, HappyCheckerOutput>;

export const calculateHappyChecker = (
  input: HappyCheckerInput,
): HappyCheckerOutput => {
  let current = input.value;
  const seen = new Set<number>();
  while (current !== 1 && !seen.has(current)) {
    seen.add(current);
    current = [...String(current)].reduce(
      (sum, digit) => sum + Number(digit) ** 2,
      0,
    );
  }
  return { isHappy: current === 1 };
};

export const happyCheckerTool = createSimpleTool({
  id: "number/happy-checker",
  title: "Happy Number Checker",
  description:
    "Check whether repeated sums of squared digits reach one rather than entering a cycle.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 1 }],
  outputs: [{ id: "isHappy", label: "Is a happy number", kind: "boolean" }],
  calculate: (input) => calculateHappyChecker({ value: input.value as number }),
});
export const runHappyChecker = happyCheckerTool.execute;
export default happyCheckerTool;
