import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PostEnumerationErrorPercentInput = {
  readonly dualSystemEstimate: number;
  readonly censusEnumeratedCount: number;
};

export type PostEnumerationErrorPercentOutput = {
  readonly coverageRatioPercent: number;
  readonly netUndercountPercent: number;
  readonly coverageStatus: "undercount" | "balanced" | "overcount";
};

export const calculatePostEnumerationErrorPercent = (
  input: PostEnumerationErrorPercentInput,
): PostEnumerationErrorPercentOutput => {
  if (!(input.dualSystemEstimate > 0))
    simpleError(
      "dualSystemEstimate",
      "The dual-system estimate must be greater than zero.",
      "invalid_estimate",
    );
  if (!(
    typeof input.censusEnumeratedCount === "number" &&
    Number.isFinite(input.censusEnumeratedCount) &&
    input.censusEnumeratedCount >= 0
  ))
    simpleError(
      "censusEnumeratedCount",
      "The enumerated census count must be finite and non-negative.",
      "invalid_count",
    );
  const coverageRatioPercent =
    (input.censusEnumeratedCount / input.dualSystemEstimate) * 100;
  const netUndercountPercent =
    ((input.dualSystemEstimate - input.censusEnumeratedCount) /
      input.dualSystemEstimate) *
    100;
  return {
    coverageRatioPercent,
    netUndercountPercent,
    coverageStatus:
      input.censusEnumeratedCount < input.dualSystemEstimate
        ? "undercount"
        : input.censusEnumeratedCount === input.dualSystemEstimate
          ? "balanced"
          : "overcount",
  };
};

export const postEnumerationErrorPercentExample = {
  input: { dualSystemEstimate: 105000, censusEnumeratedCount: 100000 },
  output: {
    coverageRatioPercent: 95.23809523809523,
    netUndercountPercent: 4.761904761904762,
    coverageStatus: "undercount",
  },
} satisfies ToolExample<
  PostEnumerationErrorPercentInput,
  PostEnumerationErrorPercentOutput
>;

export const postEnumerationErrorPercentTool = createSimpleTool({
  id: "demography/post-enumeration-error-percent",
  title: "Post Enumeration Error Percent",
  description:
    "Express post-enumeration survey coverage as the census count relative to a dual-system estimate, reporting the coverage ratio and the net undercount percent where positive values indicate underenumeration.",
  inputs: [
    {
      description:
        "Independent dual-system (capture-recapture) estimate of the true population.",
      id: "dualSystemEstimate",
      kind: "number",
      label: "DSE",
      minimum: 0,
    },
    {
      description: "Population enumerated in the census being evaluated.",
      id: "censusEnumeratedCount",
      kind: "number",
      label: "Census count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Enumerated count divided by the dual-system estimate, times 100.",
      id: "coverageRatioPercent",
      kind: "number",
      label: "Coverage ratio",
    },
    {
      description:
        "Dual-system estimate minus enumerated count as a percent of the estimate; positive means undercount.",
      id: "netUndercountPercent",
      kind: "number",
      label: "Net undercount",
    },
    {
      description: "Coverage verdict for the census against the estimate.",
      enum: ["undercount", "balanced", "overcount"],
      id: "coverageStatus",
      kind: "string",
      label: "Status",
    },
  ],
  calculate: (input) =>
    calculatePostEnumerationErrorPercent(
      input as unknown as PostEnumerationErrorPercentInput,
    ),
});

export const runPostEnumerationErrorPercent =
  postEnumerationErrorPercentTool.execute;
export default postEnumerationErrorPercentTool;
