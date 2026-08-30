import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SingularityDateVerdictInput = {
  readonly citationCount: number;
  readonly claimedYear: number;
  readonly primarySourceCount: number;
};

export type SingularityDateVerdictOutput = {
  readonly claimAssessment: string;
  readonly evidenceStrength: "strong" | "weak" | "insufficient";
  readonly verdict: "supported" | "weaklySupported" | "notEstablished";
};

export const assessKurzweilDateClaim = (
  input: SingularityDateVerdictInput,
): SingularityDateVerdictOutput => {
  if (!Number.isSafeInteger(input.claimedYear) || input.claimedYear < 1)
    simpleError(
      "claimedYear",
      "Claimed year must be a positive integer.",
      "invalid_claimed_year",
    );
  for (const [field, value] of [
    ["citationCount", input.citationCount],
    ["primarySourceCount", input.primarySourceCount],
  ] as const)
    if (!Number.isSafeInteger(value) || value < 0)
      simpleError(
        field,
        "Citation counts must be nonnegative integers.",
        "invalid_citation_count",
      );
  if (input.primarySourceCount > input.citationCount)
    simpleError(
      "primarySourceCount",
      "Primary source count cannot exceed total citation count.",
      "citation_counts_inconsistent",
    );
  const evidenceStrength =
    input.primarySourceCount >= 2 && input.citationCount >= 3
      ? "strong"
      : input.citationCount > 0
        ? "weak"
        : "insufficient";
  return {
    claimAssessment:
      "A dated prediction is a claim, not a verified future event; reassess it as evidence and conditions change.",
    evidenceStrength,
    verdict:
      evidenceStrength === "strong"
        ? "supported"
        : evidenceStrength === "weak"
          ? "weaklySupported"
          : "notEstablished",
  };
};

export const singularityDateClaimExample = {
  input: { citationCount: 4, claimedYear: 2045, primarySourceCount: 2 },
  output: {
    claimAssessment:
      "A dated prediction is a claim, not a verified future event; reassess it as evidence and conditions change.",
    evidenceStrength: "strong",
    verdict: "supported",
  },
} satisfies ToolExample<
  SingularityDateVerdictInput,
  SingularityDateVerdictOutput
>;

export const singularityDateClaimTool = createSimpleTool({
  calculate: (input) =>
    assessKurzweilDateClaim({
      citationCount: input.citationCount as number,
      claimedYear: input.claimedYear as number,
      primarySourceCount: input.primarySourceCount as number,
    }),
  description:
    "Assess whether a dated singularity claim has enough caller-supplied citation metadata to call supported, weak, or unestablished.",
  id: "futurology/singularity-kurzweil-date-claim-verdict-lookup",
  inputs: [
    {
      id: "citationCount",
      kind: "integer",
      label: "Citation count",
      minimum: 0,
    },
    { id: "claimedYear", kind: "integer", label: "Claimed year", minimum: 1 },
    {
      id: "primarySourceCount",
      kind: "integer",
      label: "Primary source count",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "claimAssessment", kind: "string", label: "Claim assessment" },
    {
      enum: ["strong", "weak", "insufficient"],
      id: "evidenceStrength",
      kind: "string",
      label: "Evidence strength",
    },
    {
      enum: ["supported", "weaklySupported", "notEstablished"],
      id: "verdict",
      kind: "string",
      label: "Claim verdict",
    },
  ],
  title: "Singularity Kurzweil Date Claim Verdict Lookup",
});

export const runSingularityDateClaim = singularityDateClaimTool.execute;
export default singularityDateClaimTool;
