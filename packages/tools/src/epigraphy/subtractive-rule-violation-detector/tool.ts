import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubtractiveRuleViolationDetectorInput = {
  readonly numeral: string;
  readonly repetitionPolicy?: "maxThree" | "allowFour";
};

export type SubtractiveRuleViolationDetectorOutput = {
  readonly isValid: boolean;
  readonly violationCount: number;
  readonly violations: readonly string[];
};

const SYMBOL_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};
const ALLOWED_SUBTRACTIONS = new Set(["IV", "IX", "XL", "XC", "CD", "CM"]);
const SUBTRACTORS = new Set(["I", "X", "C"]);
const NON_REPEATABLE = new Set(["V", "L", "D"]);

export const calculateSubtractiveRuleViolationDetector = (
  input: SubtractiveRuleViolationDetectorInput,
): SubtractiveRuleViolationDetectorOutput => {
  const numeral = input.numeral.trim().toUpperCase();
  const repetitionPolicy = input.repetitionPolicy ?? "maxThree";
  if (!numeral)
    return simpleError(
      "numeral",
      "Numeral text is required.",
      "invalid_numeral",
    );
  for (const ch of numeral)
    if (!(ch in SYMBOL_VALUES))
      return simpleError(
        "numeral",
        `Character '${ch}' is not a Roman numeral symbol (I V X L C D M).`,
        "invalid_numeral",
      );
  const violations: string[] = [];
  let runSymbol = "";
  let runLength = 0;
  const flushRun = () => {
    if (!runSymbol) return;
    const limit = repetitionPolicy === "maxThree" ? 3 : 4;
    if (NON_REPEATABLE.has(runSymbol) && runLength > 1)
      violations.push(`Symbol ${runSymbol} repeats ${runLength} times.`);
    else if (!NON_REPEATABLE.has(runSymbol) && runLength > limit)
      violations.push(`Symbol ${runSymbol} repeats ${runLength} times.`);
  };
  for (let i = 0; i < numeral.length; i += 1) {
    if (numeral[i] === runSymbol) runLength += 1;
    else {
      flushRun();
      runSymbol = numeral[i];
      runLength = 1;
    }
    if (
      i + 1 < numeral.length &&
      SYMBOL_VALUES[numeral[i]] < SYMBOL_VALUES[numeral[i + 1]]
    ) {
      const pair = numeral.slice(i, i + 2);
      if (!ALLOWED_SUBTRACTIONS.has(pair))
        violations.push(`Invalid subtractive pair ${pair}.`);
      else if (!SUBTRACTORS.has(numeral[i]))
        violations.push(`Symbol ${numeral[i]} must not act as a subtractor.`);
      if (i > 0 && numeral[i - 1] === numeral[i])
        violations.push(
          `Stacked subtractors before ${numeral[i + 1]} at position ${i}.`,
        );
    }
  }
  flushRun();
  let previousTokenValue = Number.POSITIVE_INFINITY;
  for (let i = 0; i < numeral.length; i += 1) {
    const current = SYMBOL_VALUES[numeral[i]];
    const next = i + 1 < numeral.length ? SYMBOL_VALUES[numeral[i + 1]] : 0;
    const tokenValue = current < next ? next - current : current;
    if (
      tokenValue > previousTokenValue &&
      !(i > 0 && numeral[i - 1] === numeral[i])
    )
      violations.push(
        `Numeral token at position ${i} is out of descending value order.`,
      );
    previousTokenValue = tokenValue;
    if (current < next) i += 1;
  }
  return {
    isValid: violations.length === 0,
    violationCount: violations.length,
    violations,
  };
};

export const subtractiveRuleViolationDetectorExample = {
  input: { numeral: "MCMXCIV" },
  output: { isValid: true, violationCount: 0, violations: [] },
} satisfies ToolExample<
  SubtractiveRuleViolationDetectorInput,
  SubtractiveRuleViolationDetectorOutput
>;

export const subtractiveRuleViolationDetectorTool = createSimpleTool({
  id: "epigraphy/subtractive-rule-violation-detector",
  title: "Subtractive Notation Rule Violation Detector (IIII vs IV)",
  description:
    "List violations of the classical subtractive canon in a Roman numeral (only I X C may subtract, only the pairs IV IX XL XC CD CM are legal, no stacked subtractors, V L D never repeat) with a configurable repetition ceiling.",
  inputs: [
    {
      description: "Roman numeral text.",
      id: "numeral",
      kind: "string",
      label: "Numeral",
    },
    {
      default: "maxThree",
      description: "Repetition ceiling applied to I X C M runs.",
      enum: ["maxThree", "allowFour"],
      id: "repetitionPolicy",
      kind: "string",
      label: "Repetition policy",
    },
  ],
  outputs: [
    {
      description: "True when no rule violation was found.",
      id: "isValid",
      kind: "boolean",
      label: "Valid",
    },
    {
      description: "Number of violations detected.",
      id: "violationCount",
      kind: "integer",
      label: "Violations",
    },
    {
      description: "Human-readable violation descriptions in scan order.",
      id: "violations",
      kind: "stringList",
      label: "Violation list",
    },
  ],
  calculate: (input) =>
    calculateSubtractiveRuleViolationDetector(
      input as unknown as SubtractiveRuleViolationDetectorInput,
    ),
});

export const runSubtractiveRuleViolationDetector =
  subtractiveRuleViolationDetectorTool.execute;
export default subtractiveRuleViolationDetectorTool;
