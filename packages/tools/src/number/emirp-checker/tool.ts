import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const isPrime = (value: number): boolean => {
  if (value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let factor = 3; factor * factor <= value; factor += 2)
    if (value % factor === 0) return false;
  return true;
};

const reverseDigits = (value: number): number =>
  Number(String(value).split("").reverse().join(""));

export const emirpCheckerTool = createSimpleTool({
  id: "number/emirp-checker",
  title: "Emirp Checker",
  description:
    "Check whether a prime integer yields a different prime when its digits are reversed.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "emirp", label: "Emirp", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    if (!isPrime(value)) return { emirp: false };
    const reversed = reverseDigits(value);
    return { emirp: reversed !== value && isPrime(reversed) };
  },
});
export const runEmirpChecker = emirpCheckerTool.execute;
export default emirpCheckerTool;

export type EmirpCheckerInput = {
  readonly value: number;
};

export type EmirpCheckerOutput = {
  readonly emirp: boolean;
};

export const emirpCheckerExample = {
  input: {
    value: 1,
  },
  output: {
    emirp: false,
  },
} satisfies ToolExample<EmirpCheckerInput, EmirpCheckerOutput>;
