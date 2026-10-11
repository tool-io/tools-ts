import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedVotes: number;
  readonly suppliedRetainedQuota: number;
};
export type Output = {
  readonly surplusVotes: number;
  readonly surplusTransferFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVotes: { type: "number", exclusiveMinimum: 0 },
    suppliedRetainedQuota: { type: "number", minimum: 0 },
  },
  required: ["recordedVotes", "suppliedRetainedQuota"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surplusVotes: { type: "number" },
    surplusTransferFactor: { type: "number" },
  },
  required: ["surplusVotes", "surplusTransferFactor"],
} as const;
/** Normalize an explicit positive vote surplus to recorded votes under a supplied retained quota without simulating an election. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedVotes, suppliedRetainedQuota } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(recordedVotes) && recordedVotes > 0,
      "recordedVotes",
    ),
      recordedVotes);
    H.domain(suppliedRetainedQuota >= 0, "suppliedRetainedQuota");
    return {
      surplusVotes: Math.max(0, recordedVotes - suppliedRetainedQuota),
      surplusTransferFactor:
        Math.max(0, recordedVotes - suppliedRetainedQuota) / recordedVotes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedVotes: 120, suppliedRetainedQuota: 100 },
  output: { surplusVotes: 20, surplusTransferFactor: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const partyListVoteTransferSurplusFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["political-science", "political science", "social sciences"],
      keywords: ["political science", "social sciences"],
    },
    id: "political-science/party-list-vote-transfer-surplus-factor",
    title: "Party List Vote Transfer Surplus Factor",
    description:
      "Normalize an explicit positive vote surplus to recorded votes under a supplied retained quota without simulating an election.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedVotes: { type: "number", exclusiveMinimum: 0 },
        suppliedRetainedQuota: { type: "number", minimum: 0 },
      },
      required: ["recordedVotes", "suppliedRetainedQuota"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surplusVotes: { type: "number" },
        surplusTransferFactor: { type: "number" },
      },
      required: ["surplusVotes", "surplusTransferFactor"],
    },
    ports: {
      inputs: [
        {
          id: "recordedVotes",
          label: "Recorded Votes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetainedQuota",
          label: "Supplied Retained Quota",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "surplusVotes",
          label: "Surplus Votes",
          valueType: { type: "number" },
        },
        {
          id: "surplusTransferFactor",
          label: "Surplus Transfer Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = partyListVoteTransferSurplusFactorTool.execute;
export default partyListVoteTransferSurplusFactorTool;
