import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly candidateVotes: number;
  readonly eligibleBase: number;
  readonly requiredFraction: number;
  readonly inclusive: boolean;
};
export type Output = { readonly gapVotes: number; readonly qualified: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    candidateVotes: { type: "integer", minimum: 0 },
    eligibleBase: { type: "integer", minimum: 1 },
    requiredFraction: { type: "number", minimum: 0, maximum: 1 },
    inclusive: { type: "boolean" },
  },
  required: ["candidateVotes", "eligibleBase", "requiredFraction", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gapVotes: { type: "number" }, qualified: { type: "boolean" } },
  required: ["gapVotes", "qualified"],
} as const;
/** One caller-supplied qualification condition, excluding rankings and any additional turnout condition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { candidateVotes, eligibleBase, requiredFraction, inclusive } = request;
  const compute = (): Output => {
    H.integer(eligibleBase, 1);
    H.integer(candidateVotes, 0, eligibleBase);
    H.probability(requiredFraction);
    return {
      gapVotes: candidateVotes - requiredFraction * eligibleBase,
      qualified: inclusive
        ? candidateVotes >= requiredFraction * eligibleBase
        : candidateVotes > requiredFraction * eligibleBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    candidateVotes: 501,
    eligibleBase: 1000,
    requiredFraction: 0.5,
    inclusive: false,
  },
  output: { gapVotes: 1, qualified: true },
} satisfies ToolExample<Input, Output>;
export const twoRoundRunoffQualificationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/two-round-runoff-qualification-gap",
    title: "Two Round Runoff Qualification Gap Tool",
    description:
      "One caller-supplied qualification condition, excluding rankings and any additional turnout condition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        candidateVotes: { type: "integer", minimum: 0 },
        eligibleBase: { type: "integer", minimum: 1 },
        requiredFraction: { type: "number", minimum: 0, maximum: 1 },
        inclusive: { type: "boolean" },
      },
      required: [
        "candidateVotes",
        "eligibleBase",
        "requiredFraction",
        "inclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapVotes: { type: "number" },
        qualified: { type: "boolean" },
      },
      required: ["gapVotes", "qualified"],
    },
    ports: {
      inputs: [
        {
          id: "candidateVotes",
          label: "Candidate Votes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eligibleBase",
          label: "Eligible Base",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredFraction",
          label: "Required Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gapVotes", label: "Gap Votes", valueType: { type: "number" } },
        { id: "qualified", label: "Qualified", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = twoRoundRunoffQualificationGapTool.execute;
export default twoRoundRunoffQualificationGapTool;
