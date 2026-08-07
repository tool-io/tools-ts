import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomItem } from "../item/tool.js";
export const calculateRandomLetter = (
  letterCase: "lowercase" | "mixed" | "uppercase",
  random = Math.random,
): string | null =>
  calculateRandomItem(
    [
      ...(letterCase === "lowercase"
        ? "abcdefghijklmnopqrstuvwxyz"
        : letterCase === "uppercase"
          ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"),
    ],
    random,
  );
export const randomLetterExample = {
  input: { letterCase: "mixed" },
} satisfies ToolExample<{ readonly letterCase: string }>;
export const randomLetterTool = createSimpleTool({
  id: "random/letter",
  title: "Random Letter Generator",
  description:
    "Generate a random uppercase, lowercase, or mixed-case Latin letter.",
  inputs: [
    {
      enum: ["mixed", "uppercase", "lowercase"],
      id: "letterCase",
      kind: "string",
      label: "Letter case",
    },
  ],
  outputs: [
    {
      format: "random/letter",
      id: "letter",
      kind: "string",
      label: "Random letter",
    },
  ],
  calculate: (input, context) => {
    const letter = calculateRandomLetter(
      input.letterCase as "lowercase" | "mixed" | "uppercase",
      context.random ?? Math.random,
    );
    if (!letter)
      return simpleError("letterCase", "Select a supported letter case.");
    return { letter };
  },
});
export const runRandomLetter = randomLetterTool.execute;
export default randomLetterTool;
