import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimTokens: readonly string[];
  readonly suppliedNegationTokens: readonly string[];
};
export type Output = {
  readonly negationPositions: readonly number[];
  readonly containsMarker: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedNegationTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["claimTokens", "suppliedNegationTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negationPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    containsMarker: { type: "boolean" },
  },
  required: ["negationPositions", "containsMarker"],
} as const;
/** Find exact supplied negation markers without deciding scope, truth or therapeutic efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimTokens, suppliedNegationTokens } = request;
  const compute = (): Output => {
    const negationPositions = claimTokens.flatMap((x, i) =>
      suppliedNegationTokens.includes(x) ? [i] : [],
    );
    return { negationPositions, containsMarker: negationPositions.length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimTokens: ["does", "not", "improve"],
    suppliedNegationTokens: ["not", "never"],
  },
  output: { negationPositions: [1], containsMarker: true },
} satisfies ToolExample<Input, Output>;
export const sourceClaimNegationMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/source-claim-negation-marker",
    title: "Source Claim Negation Marker Tool",
    description:
      "Find exact supplied negation markers without deciding scope, truth or therapeutic efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedNegationTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["claimTokens", "suppliedNegationTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negationPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        containsMarker: { type: "boolean" },
      },
      required: ["negationPositions", "containsMarker"],
    },
    ports: {
      inputs: [
        {
          id: "claimTokens",
          label: "Claim Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedNegationTokens",
          label: "Supplied Negation Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "negationPositions",
          label: "Negation Positions",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "containsMarker",
          label: "Contains Marker",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceClaimNegationMarkerTool.execute;
export default sourceClaimNegationMarkerTool;
