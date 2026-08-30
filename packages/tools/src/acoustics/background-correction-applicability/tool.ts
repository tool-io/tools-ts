import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly backgroundLevelDecibels: number;
  readonly totalLevelDecibels: number;
}>;
export type Output = Readonly<{
  readonly applicability:
    "invalid" | "correction-required" | "negligible-correction";
  readonly levelDifferenceDecibels: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.backgroundLevelDecibels) ||
    !Number.isFinite(input.totalLevelDecibels)
  )
    simpleError(
      "totalLevelDecibels",
      "Levels must be finite.",
      "invalid_level",
    );
  const levelDifferenceDecibels =
    input.totalLevelDecibels - input.backgroundLevelDecibels;
  if (!Number.isFinite(levelDifferenceDecibels))
    simpleError(
      "totalLevelDecibels",
      "Level difference is out of range.",
      "numeric_overflow",
    );
  if (levelDifferenceDecibels <= 0)
    simpleError(
      "totalLevelDecibels",
      "Total level must exceed background.",
      "invalid_level_order",
    );
  const applicability =
    levelDifferenceDecibels < 3
      ? "invalid"
      : levelDifferenceDecibels < 10
        ? "correction-required"
        : "negligible-correction";
  return { applicability, levelDifferenceDecibels };
};

export const example = {
  input: { backgroundLevelDecibels: 60, totalLevelDecibels: 65 },
  output: { applicability: "correction-required", levelDifferenceDecibels: 5 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: { backgroundLevelDecibels: 60, totalLevelDecibels: 70 },
  output: {
    applicability: "negligible-correction",
    levelDifferenceDecibels: 10,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      backgroundLevelDecibels: input.backgroundLevelDecibels as number,
      totalLevelDecibels: input.totalLevelDecibels as number,
    }),
  description:
    "Classify source-plus-background separation for energetic correction: under 3 dB invalid, 3–10 dB correction range, and at least 10 dB negligible correction.",
  id: "acoustics/background-correction-applicability",
  inputs: [
    {
      id: "backgroundLevelDecibels",
      kind: "number",
      label: "Background level",
      unit: "dB",
    },
    {
      id: "totalLevelDecibels",
      kind: "number",
      label: "Total measured level",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "applicability",
      kind: "string",
      label: "Correction applicability",
      enum: ["invalid", "correction-required", "negligible-correction"],
    },
    {
      id: "levelDifferenceDecibels",
      kind: "number",
      label: "Total-minus-background difference",
      unit: "dB",
    },
  ],
  title: "Background Correction Applicability",
});

export const run = tool.execute;
export default tool;
