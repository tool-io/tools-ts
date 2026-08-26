import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StoichedonAlignmentCheckerInput = {
  readonly linePitchesMm: readonly number[];
  readonly toleranceMm?: number;
};

export type StoichedonAlignmentCheckerOutput = {
  readonly meanPitchMm: number;
  readonly spreadMm: number;
  readonly isStoichedon: boolean;
};

export const calculateStoichedonAlignmentChecker = (
  input: StoichedonAlignmentCheckerInput,
): StoichedonAlignmentCheckerOutput => {
  const pitches = input.linePitchesMm;
  if (!Array.isArray(pitches) || pitches.length < 2)
    return simpleError(
      "linePitchesMm",
      "At least two line pitches are required.",
      "insufficient_lines",
    );
  for (const pitch of pitches)
    if (!(typeof pitch === "number" && Number.isFinite(pitch) && pitch > 0))
      return simpleError(
        "linePitchesMm",
        "Line pitches must be finite positive millimetre values.",
        "invalid_pitch",
      );
  const toleranceMm = input.toleranceMm ?? 1;
  if (!(toleranceMm >= 0))
    return simpleError(
      "toleranceMm",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const total = pitches.reduce((sum, pitch) => sum + pitch, 0);
  const meanPitchMm = total / pitches.length;
  const spreadMm = Math.max(...pitches) - Math.min(...pitches);
  return { meanPitchMm, spreadMm, isStoichedon: spreadMm <= toleranceMm };
};

export const stoichedonAlignmentCheckerExample = {
  input: { linePitchesMm: [12, 12.2, 11.9] },
  output: {
    meanPitchMm: 12.033333333333333,
    spreadMm: 0.29999999999999893,
    isStoichedon: true,
  },
} satisfies ToolExample<
  StoichedonAlignmentCheckerInput,
  StoichedonAlignmentCheckerOutput
>;

export const stoichedonAlignmentCheckerTool = createSimpleTool({
  id: "epigraphy/stoichedon-alignment-checker",
  title: "Stoichedon Grid Alignment Checker",
  description:
    "Judges whether measured vertical line pitches are regular enough to indicate stoichedon grid alignment within a tolerance.",
  inputs: [
    {
      id: "linePitchesMm",
      kind: "numberList",
      label: "Line pitches",
      description:
        "Vertical pitch between adjacent line baselines in millimetres.",
    },
    {
      id: "toleranceMm",
      kind: "number",
      label: "Tolerance",
      description: "Maximum acceptable pitch spread in millimetres.",
      minimum: 0,
      default: 1,
    },
  ],
  outputs: [
    {
      id: "meanPitchMm",
      kind: "number",
      label: "Mean pitch",
      description: "Average line pitch in millimetres.",
    },
    {
      id: "spreadMm",
      kind: "number",
      label: "Spread",
      description: "Difference between widest and narrowest pitch.",
    },
    {
      id: "isStoichedon",
      kind: "boolean",
      label: "Stoichedon",
      description: "Whether the spread fits the tolerance.",
    },
  ],
  calculate: (input) =>
    calculateStoichedonAlignmentChecker(
      input as unknown as StoichedonAlignmentCheckerInput,
    ),
});

export const runStoichedonAlignmentChecker =
  stoichedonAlignmentCheckerTool.execute;
export default stoichedonAlignmentCheckerTool;
