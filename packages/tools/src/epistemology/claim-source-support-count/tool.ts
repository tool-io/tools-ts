import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claim: string;
  readonly claimTokens: readonly string[];
  readonly sourceIds: readonly string[];
  readonly supports: readonly boolean[];
};
export type Output = {
  readonly supportingSources: number;
  readonly opposingSources: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claim: { type: "string", maxLength: 8192 },
    claimTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supports: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["claim", "claimTokens", "sourceIds", "supports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportingSources: { type: "integer" },
    opposingSources: { type: "integer" },
  },
  required: ["supportingSources", "opposingSources"],
} as const;
/** Count distinct supplied source IDs under explicit support/opposition annotations; source independence is not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claim, claimTokens, sourceIds, supports } = request;
  const compute = (): Output => {
    H.sameLength(claimTokens, sourceIds);
    H.sameLength(claimTokens, supports);
    return {
      supportingSources: new Set(
        sourceIds.filter((x, i) => claimTokens[i] === claim && supports[i]),
      ).size,
      opposingSources: new Set(
        sourceIds.filter((x, i) => claimTokens[i] === claim && !supports[i]),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claim: "A",
    claimTokens: ["A", "A", "B"],
    sourceIds: ["s1", "s2", "s3"],
    supports: [true, false, true],
  },
  output: { supportingSources: 1, opposingSources: 1 },
} satisfies ToolExample<Input, Output>;
export const claimSourceSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/claim-source-support-count",
    title: "Claim Source Support Count Tool",
    description:
      "Count distinct supplied source IDs under explicit support/opposition annotations; source independence is not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claim: { type: "string", maxLength: 8192 },
        claimTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supports: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["claim", "claimTokens", "sourceIds", "supports"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportingSources: { type: "integer" },
        opposingSources: { type: "integer" },
      },
      required: ["supportingSources", "opposingSources"],
    },
    ports: {
      inputs: [
        {
          id: "claim",
          label: "Claim",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "claimTokens",
          label: "Claim Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supports",
          label: "Supports",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "supportingSources",
          label: "Supporting Sources",
          valueType: { type: "integer" },
        },
        {
          id: "opposingSources",
          label: "Opposing Sources",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = claimSourceSupportCountTool.execute;
export default claimSourceSupportCountTool;
