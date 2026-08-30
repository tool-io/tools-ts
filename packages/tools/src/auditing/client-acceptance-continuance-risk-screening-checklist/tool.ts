import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClientAcceptanceRiskInput = {
  readonly acceptanceThreshold: number;
  readonly riskRatings: ReadonlyArray<number>;
};

export type ClientAcceptanceRiskOutput = {
  readonly averageRating: number;
  readonly highRiskCount: number;
  readonly screenFailed: boolean;
  readonly totalRisks: number;
};

export const screenClientAcceptanceRisks = (
  input: ClientAcceptanceRiskInput,
): ClientAcceptanceRiskOutput => {
  if (
    !Number.isFinite(input.acceptanceThreshold) ||
    input.acceptanceThreshold < 1 ||
    input.acceptanceThreshold > 5
  )
    simpleError(
      "acceptanceThreshold",
      "The acceptance threshold must be from 1 through 5.",
      "invalid_acceptance_threshold",
    );
  if (!Array.isArray(input.riskRatings) || input.riskRatings.length === 0)
    simpleError(
      "riskRatings",
      "At least one risk rating is required.",
      "risk_ratings_required",
    );
  let total = 0;
  let highRiskCount = 0;
  for (const [index, rating] of input.riskRatings.entries()) {
    if (!Number.isFinite(rating) || rating < 1 || rating > 5)
      simpleError(
        `riskRatings.${index}`,
        "Each risk rating must be from 1 through 5.",
        "invalid_risk_rating",
      );
    total += rating;
    if (rating >= input.acceptanceThreshold) highRiskCount += 1;
  }
  return {
    averageRating: total / input.riskRatings.length,
    highRiskCount,
    screenFailed: highRiskCount > 0,
    totalRisks: input.riskRatings.length,
  };
};

export const clientAcceptanceRiskExample = {
  input: { acceptanceThreshold: 4, riskRatings: [5, 4, 2, 1] },
  output: {
    averageRating: 3,
    highRiskCount: 2,
    screenFailed: true,
    totalRisks: 4,
  },
} satisfies ToolExample<ClientAcceptanceRiskInput, ClientAcceptanceRiskOutput>;

export const clientAcceptanceRiskTool = createSimpleTool({
  calculate: (input) =>
    screenClientAcceptanceRisks({
      acceptanceThreshold: input.acceptanceThreshold as number,
      riskRatings: input.riskRatings as number[],
    }),
  description:
    "Screen caller-supplied client-acceptance risk ratings against a selected threshold and report the average and number of ratings at or above it.",
  id: "auditing/client-acceptance-continuance-risk-screening-checklist",
  inputs: [
    {
      description: "Lowest rating treated as requiring acceptance review.",
      id: "acceptanceThreshold",
      kind: "number",
      label: "Acceptance threshold",
      maximum: 5,
      minimum: 1,
    },
    {
      description: "One rating from 1 through 5 for each identified risk.",
      id: "riskRatings",
      kind: "numberList",
      label: "Risk ratings",
    },
  ],
  outputs: [
    { id: "averageRating", kind: "number", label: "Average rating" },
    {
      id: "highRiskCount",
      kind: "integer",
      label: "Ratings at or above threshold",
      minimum: 0,
    },
    { id: "screenFailed", kind: "boolean", label: "Acceptance screen failed" },
    { id: "totalRisks", kind: "integer", label: "Risks reviewed", minimum: 1 },
  ],
  title: "Client Acceptance Continuance Risk Screening Checklist",
});

export const runClientAcceptanceRisk = clientAcceptanceRiskTool.execute;
export default clientAcceptanceRiskTool;
