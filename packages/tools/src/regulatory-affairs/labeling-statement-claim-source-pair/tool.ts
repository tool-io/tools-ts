import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly statementId: string;
  readonly claimSourceId: string;
  readonly expectedSourceId: string;
  readonly sourceVersion: string;
  readonly expectedVersion: string;
};
export type Output = {
  readonly sourceMatches: boolean;
  readonly versionMatches: boolean;
  readonly linkedKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statementId: { type: "string", maxLength: 8192 },
    claimSourceId: { type: "string", maxLength: 8192 },
    expectedSourceId: { type: "string", maxLength: 8192 },
    sourceVersion: { type: "string", maxLength: 8192 },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: [
    "statementId",
    "claimSourceId",
    "expectedSourceId",
    "sourceVersion",
    "expectedVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    linkedKey: { type: "string", maxLength: 8192 },
  },
  required: ["sourceMatches", "versionMatches", "linkedKey"],
} as const;
/** Compare explicit statement/source attribution and versions without verifying a claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    statementId,
    claimSourceId,
    expectedSourceId,
    sourceVersion,
    expectedVersion,
  } = request;
  const compute = (): Output => {
    return {
      sourceMatches: claimSourceId === expectedSourceId,
      versionMatches: sourceVersion === expectedVersion,
      linkedKey: JSON.stringify([statementId, claimSourceId, sourceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    statementId: "S1",
    claimSourceId: "C1",
    expectedSourceId: "C1",
    sourceVersion: "v2",
    expectedVersion: "v1",
  },
  output: {
    sourceMatches: true,
    versionMatches: false,
    linkedKey: '["S1","C1","v2"]',
  },
} satisfies ToolExample<Input, Output>;
export const labelingStatementClaimSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/labeling-statement-claim-source-pair",
    title: "Labeling Statement Claim Source Pair Tool",
    description:
      "Compare explicit statement/source attribution and versions without verifying a claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statementId: { type: "string", maxLength: 8192 },
        claimSourceId: { type: "string", maxLength: 8192 },
        expectedSourceId: { type: "string", maxLength: 8192 },
        sourceVersion: { type: "string", maxLength: 8192 },
        expectedVersion: { type: "string", maxLength: 8192 },
      },
      required: [
        "statementId",
        "claimSourceId",
        "expectedSourceId",
        "sourceVersion",
        "expectedVersion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceMatches: { type: "boolean" },
        versionMatches: { type: "boolean" },
        linkedKey: { type: "string", maxLength: 8192 },
      },
      required: ["sourceMatches", "versionMatches", "linkedKey"],
    },
    ports: {
      inputs: [
        {
          id: "statementId",
          label: "Statement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "claimSourceId",
          label: "Claim Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSourceId",
          label: "Expected Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedVersion",
          label: "Expected Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sourceMatches",
          label: "Source Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        { id: "linkedKey", label: "Linked Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = labelingStatementClaimSourcePairTool.execute;
export default labelingStatementClaimSourcePairTool;
