import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScribeChangeDetectorInput = {
  readonly lineSpacingAMm: number;
  readonly lineSpacingBMm: number;
  readonly lettersPerLineA: number;
  readonly lettersPerLineB: number;
  readonly tolerancePercent?: number;
};

export type ScribeChangeDetectorOutput = {
  readonly lineSpacingDeviationPercent: number;
  readonly lettersPerLineDeviationPercent: number;
  readonly scribeChangeFlagged: boolean;
  readonly flaggedMetric: "none" | "line_spacing" | "letters_per_line" | "both";
};

const symmetricDeviationPercent = (a: number, b: number): number => {
  if (a === b) return 0;
  const directDenominator = (a + b) / 2;
  const direct = (Math.abs(a - b) / directDenominator) * 100;
  if (Number.isFinite(directDenominator) && Number.isFinite(direct))
    return direct;
  const maximum = Math.max(a, b);
  const ratio = Math.min(a, b) / maximum;
  return (200 * (1 - ratio)) / (1 + ratio);
};

export const calculateScribeChangeDetector = (
  input: ScribeChangeDetectorInput,
): ScribeChangeDetectorOutput => {
  if (!(
    Number.isFinite(input.lineSpacingAMm) &&
    input.lineSpacingAMm > 0 &&
    Number.isFinite(input.lineSpacingBMm) &&
    input.lineSpacingBMm > 0
  ))
    return simpleError(
      "lineSpacingAMm",
      "Line spacings must be greater than zero millimetres.",
      "invalid_measurement",
    );
  if (!(
    Number.isFinite(input.lettersPerLineA) &&
    input.lettersPerLineA > 0 &&
    Number.isFinite(input.lettersPerLineB) &&
    input.lettersPerLineB > 0
  ))
    return simpleError(
      "lettersPerLineA",
      "Letters-per-line counts must be greater than zero.",
      "invalid_measurement",
    );
  const tolerancePercent = input.tolerancePercent ?? 5;
  if (!(Number.isFinite(tolerancePercent) && tolerancePercent >= 0))
    return simpleError(
      "tolerancePercent",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const lineSpacingDeviationPercent = symmetricDeviationPercent(
    input.lineSpacingAMm,
    input.lineSpacingBMm,
  );
  const lettersPerLineDeviationPercent = symmetricDeviationPercent(
    input.lettersPerLineA,
    input.lettersPerLineB,
  );
  const spacingExceeds = lineSpacingDeviationPercent > tolerancePercent;
  const lettersExceed = lettersPerLineDeviationPercent > tolerancePercent;
  return {
    lineSpacingDeviationPercent,
    lettersPerLineDeviationPercent,
    scribeChangeFlagged: spacingExceeds || lettersExceed,
    flaggedMetric:
      spacingExceeds && lettersExceed
        ? "both"
        : spacingExceeds
          ? "line_spacing"
          : lettersExceed
            ? "letters_per_line"
            : "none",
  };
};

export const scribeChangeDetectorExample = {
  input: {
    lineSpacingAMm: 6,
    lineSpacingBMm: 6.5,
    lettersPerLineA: 40,
    lettersPerLineB: 39,
  },
  output: {
    lineSpacingDeviationPercent: 8,
    lettersPerLineDeviationPercent: 2.5316455696202533,
    scribeChangeFlagged: true,
    flaggedMetric: "line_spacing",
  },
} satisfies ToolExample<ScribeChangeDetectorInput, ScribeChangeDetectorOutput>;

export const scribeChangeDetectorTool = createSimpleTool({
  id: "paleography/scribe-change-detector",
  title: "Scribe Change Detector",
  description:
    "Flag a possible change of scribe under the stated rule: each metric (line spacing, letters per line) is compared by the symmetric percent deviation |a-b|/mean(a,b)*100, and a deviation above tolerance (default 5%) on either metric flags a change.",
  inputs: [
    {
      description: "Mean ruled-line spacing of section A in mm.",
      id: "lineSpacingAMm",
      kind: "number",
      label: "Spacing A",
      minimum: 0,
      unit: "mm",
    },
    {
      description: "Mean ruled-line spacing of section B in mm.",
      id: "lineSpacingBMm",
      kind: "number",
      label: "Spacing B",
      minimum: 0,
      unit: "mm",
    },
    {
      description: "Mean letters per line in section A.",
      id: "lettersPerLineA",
      kind: "number",
      label: "Letters A",
      minimum: 0,
    },
    {
      description: "Mean letters per line in section B.",
      id: "lettersPerLineB",
      kind: "number",
      label: "Letters B",
      minimum: 0,
    },
    {
      default: 5,
      description: "Deviation threshold in percent.",
      id: "tolerancePercent",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Symmetric percent deviation of line spacing.",
      id: "lineSpacingDeviationPercent",
      kind: "number",
      label: "Spacing dev %",
    },
    {
      description: "Symmetric percent deviation of letters per line.",
      id: "lettersPerLineDeviationPercent",
      kind: "number",
      label: "Letters dev %",
    },
    {
      description: "True when either deviation exceeds tolerance.",
      id: "scribeChangeFlagged",
      kind: "boolean",
      label: "Change flagged",
    },
    {
      description: "Which metric exceeded tolerance.",
      id: "flaggedMetric",
      enum: ["none", "line_spacing", "letters_per_line", "both"],
      kind: "string",
      label: "Flagged metric",
    },
  ],
  calculate: (input) =>
    calculateScribeChangeDetector({
      lineSpacingAMm: input.lineSpacingAMm as number,
      lineSpacingBMm: input.lineSpacingBMm as number,
      lettersPerLineA: input.lettersPerLineA as number,
      lettersPerLineB: input.lettersPerLineB as number,
      tolerancePercent: input.tolerancePercent as number,
    }),
});

export const runScribeChangeDetector = scribeChangeDetectorTool.execute;
export default scribeChangeDetectorTool;
