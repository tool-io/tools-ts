import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FormatObsolescenceScoreRaterInput = {
  readonly yearsSinceRelease: number;
  readonly proprietary?: boolean;
  readonly requiresEmulation?: boolean;
  readonly lacksValidationTooling?: boolean;
};

export type FormatObsolescenceScoreRaterOutput = {
  readonly riskScore: number;
  readonly riskTier: "low" | "moderate" | "high" | "critical";
};

export const calculateFormatObsolescenceScoreRater = (
  input: FormatObsolescenceScoreRaterInput,
): FormatObsolescenceScoreRaterOutput => {
  const years = input.yearsSinceRelease;
  if (!Number.isFinite(years) || years < 0)
    simpleError(
      "yearsSinceRelease",
      "Years since release must be a finite number at least 0.",
      "invalid_age",
    );
  const rawScore =
    input.yearsSinceRelease * 2 +
    (input.proprietary ? 20 : 0) +
    (input.requiresEmulation ? 25 : 0) +
    (input.lacksValidationTooling ? 15 : 0);
  const riskScore = Math.min(100, rawScore);
  const riskTier =
    riskScore < 30
      ? "low"
      : riskScore < 60
        ? "moderate"
        : riskScore < 85
          ? "high"
          : "critical";
  return { riskScore, riskTier };
};

export const formatObsolescenceScoreRaterExample = {
  input: {
    yearsSinceRelease: 22,
    proprietary: true,
    requiresEmulation: true,
    lacksValidationTooling: true,
  },
  output: { riskScore: 100, riskTier: "critical" },
} satisfies ToolExample<
  FormatObsolescenceScoreRaterInput,
  FormatObsolescenceScoreRaterOutput
>;

export const formatObsolescenceScoreRaterTool = createSimpleTool({
  id: "archival-studies/format-obsolescence-score-rater",
  title: "Format Obsolescence Watchlist Risk Score Rater",
  description:
    "Rate preservation format obsolescence risk on a capped 0-100 scale (two points per year since release plus twenty for proprietary formats, twenty-five when emulation is required and fifteen when validation tooling is lacking) with low, moderate, high and critical tiers.",
  inputs: [
    {
      description: "Years elapsed since the format was introduced.",
      id: "yearsSinceRelease",
      kind: "number",
      label: "Years since release",
      minimum: 0,
    },
    {
      default: false,
      description: "Whether the format specification is proprietary (adds 20).",
      id: "proprietary",
      kind: "boolean",
      label: "Proprietary",
    },
    {
      default: false,
      description:
        "Whether rendering requires emulation or legacy hardware (adds 25).",
      id: "requiresEmulation",
      kind: "boolean",
      label: "Requires emulation",
    },
    {
      default: false,
      description: "Whether validation tooling is unavailable (adds 15).",
      id: "lacksValidationTooling",
      kind: "boolean",
      label: "Lacks validation tooling",
    },
  ],
  outputs: [
    {
      description: "Obsolescence risk score capped at 100.",
      id: "riskScore",
      kind: "number",
      label: "Risk score",
    },
    {
      description: "Watchlist tier for the computed score.",
      enum: ["low", "moderate", "high", "critical"],
      id: "riskTier",
      kind: "string",
      label: "Risk tier",
    },
  ],
  calculate: (input) =>
    calculateFormatObsolescenceScoreRater({
      lacksValidationTooling:
        (input.lacksValidationTooling as boolean | undefined) ?? undefined,
      proprietary: (input.proprietary as boolean | undefined) ?? undefined,
      requiresEmulation:
        (input.requiresEmulation as boolean | undefined) ?? undefined,
      yearsSinceRelease: input.yearsSinceRelease as number,
    }),
});

export const runFormatObsolescenceScoreRater =
  formatObsolescenceScoreRaterTool.execute;
export default formatObsolescenceScoreRaterTool;
