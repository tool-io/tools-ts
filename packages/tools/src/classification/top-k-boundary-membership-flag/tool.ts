import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly candidateScore: number;
  readonly kthScore: number;
  readonly includeBoundaryTies: boolean;
  readonly higherIsBetter: boolean;
};
export type Output = { readonly includedByBoundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateScore: { type: "number" },
    kthScore: { type: "number" },
    includeBoundaryTies: { type: "boolean" },
    higherIsBetter: { type: "boolean" },
  },
  required: [
    "candidateScore",
    "kthScore",
    "includeBoundaryTies",
    "higherIsBetter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedByBoundary: { type: "boolean" } },
  required: ["includedByBoundary"],
} as const;
/** Compare an explicit score with a supplied kth-score boundary under explicit score direction and tie policies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { candidateScore, kthScore, includeBoundaryTies, higherIsBetter } =
    request;
  const compute = (): Output => {
    return {
      includedByBoundary: higherIsBetter
        ? includeBoundaryTies
          ? candidateScore >= kthScore
          : candidateScore > kthScore
        : includeBoundaryTies
          ? candidateScore <= kthScore
          : candidateScore < kthScore,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    candidateScore: 0.8,
    kthScore: 0.7,
    includeBoundaryTies: true,
    higherIsBetter: true,
  },
  output: { includedByBoundary: true },
} satisfies ToolExample<Input, Output>;
export const topKBoundaryMembershipFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["classification", "classification metrics", "computer science"],
      keywords: ["classification metrics", "computer science"],
    },
    id: "classification/top-k-boundary-membership-flag",
    title: "Top K Boundary Membership Flag",
    description:
      "Compare an explicit score with a supplied kth-score boundary under explicit score direction and tie policies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        candidateScore: { type: "number" },
        kthScore: { type: "number" },
        includeBoundaryTies: { type: "boolean" },
        higherIsBetter: { type: "boolean" },
      },
      required: [
        "candidateScore",
        "kthScore",
        "includeBoundaryTies",
        "higherIsBetter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { includedByBoundary: { type: "boolean" } },
      required: ["includedByBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "candidateScore",
          label: "Candidate Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "kthScore",
          label: "Kth Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeBoundaryTies",
          label: "Include Boundary Ties",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "higherIsBetter",
          label: "Higher Is Better",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "includedByBoundary",
          label: "Included By Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = topKBoundaryMembershipFlagTool.execute;
export default topKBoundaryMembershipFlagTool;
