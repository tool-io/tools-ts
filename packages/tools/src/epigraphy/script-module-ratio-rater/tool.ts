import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScriptModuleRatioRaterInput = {
  readonly letterWidthMm: number;
  readonly letterHeightMm: number;
  readonly referenceRatio?: number;
  readonly toleranceRatio?: number;
};

export type ScriptModuleRatioRaterOutput = {
  readonly widthToHeightRatio: number;
  readonly verdict: "condensed" | "reference" | "expanded";
};

export const calculateScriptModuleRatioRater = (
  input: ScriptModuleRatioRaterInput,
): ScriptModuleRatioRaterOutput => {
  if (!(input.letterWidthMm > 0))
    simpleError(
      "letterWidthMm",
      "Letter width must be greater than zero.",
      "invalid_width",
    );
  if (!(input.letterHeightMm > 0))
    simpleError(
      "letterHeightMm",
      "Letter height must be greater than zero.",
      "invalid_height",
    );
  const referenceRatio = input.referenceRatio ?? 0.75;
  const toleranceRatio = input.toleranceRatio ?? 0.05;
  if (!(referenceRatio > 0))
    simpleError(
      "referenceRatio",
      "Reference ratio must be greater than zero.",
      "invalid_reference",
    );
  if (!(toleranceRatio >= 0))
    simpleError(
      "toleranceRatio",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const widthToHeightRatio = input.letterWidthMm / input.letterHeightMm;
  const deviation = Math.abs(widthToHeightRatio - referenceRatio);
  const verdict =
    deviation <= toleranceRatio
      ? "reference"
      : widthToHeightRatio < referenceRatio
        ? "condensed"
        : "expanded";
  return { widthToHeightRatio, verdict };
};

export const scriptModuleRatioRaterExample = {
  input: { letterWidthMm: 6, letterHeightMm: 10 },
  output: { widthToHeightRatio: 0.6, verdict: "condensed" },
} satisfies ToolExample<
  ScriptModuleRatioRaterInput,
  ScriptModuleRatioRaterOutput
>;

export const scriptModuleRatioRaterTool = createSimpleTool({
  id: "epigraphy/script-module-ratio-rater",
  title: "Script Module Width-to-Height Ratio Rater",
  description:
    "Rates a letter module's width-to-height ratio against a configurable reference proportion, defaulting to the common 0.75 lapidary module.",
  inputs: [
    {
      id: "letterWidthMm",
      kind: "number",
      label: "Letter width",
      description: "Mean letter-module width in millimetres.",
      minimum: 0,
    },
    {
      id: "letterHeightMm",
      kind: "number",
      label: "Letter height",
      description: "Mean letter-module height in millimetres.",
      minimum: 0,
    },
    {
      id: "referenceRatio",
      kind: "number",
      label: "Reference ratio",
      description: "Expected width-to-height proportion.",
      default: 0.75,
    },
    {
      id: "toleranceRatio",
      kind: "number",
      label: "Tolerance",
      description: "Absolute tolerance around the reference ratio.",
      default: 0.05,
    },
  ],
  outputs: [
    {
      id: "widthToHeightRatio",
      kind: "number",
      label: "Ratio",
      description: "Computed width divided by height.",
    },
    {
      id: "verdict",
      kind: "string",
      enum: ["condensed", "reference", "expanded"],
      label: "Verdict",
      description: "Rating relative to the reference proportion.",
    },
  ],
  calculate: (input) =>
    calculateScriptModuleRatioRater(
      input as unknown as ScriptModuleRatioRaterInput,
    ),
});

export const runScriptModuleRatioRater = scriptModuleRatioRaterTool.execute;
export default scriptModuleRatioRaterTool;
