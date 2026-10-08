import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceToken: string;
  readonly proposedToken: string;
};
export type Output = {
  readonly exactMatch: boolean;
  readonly sameIgnoringCase: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceToken: { type: "string", maxLength: 8192 },
    proposedToken: { type: "string", maxLength: 8192 },
  },
  required: ["sourceToken", "proposedToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactMatch: { type: "boolean" },
    sameIgnoringCase: { type: "boolean" },
  },
  required: ["exactMatch", "sameIgnoringCase"],
} as const;
/** Compare exact and Unicode-default-lowercased supplied critical terms without normalizing the returned source text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceToken, proposedToken } = request;
  const compute = (): Output => {
    return {
      exactMatch: sourceToken === proposedToken,
      sameIgnoringCase:
        sourceToken.toLowerCase() === proposedToken.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceToken: "Other", proposedToken: "other" },
  output: { exactMatch: false, sameIgnoringCase: true },
} satisfies ToolExample<Input, Output>;
export const markerTermCapitalizationPreservationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["critical-theory", "critical theory", "humanities"],
        keywords: ["critical theory", "humanities"],
      },
      id: "critical-theory/marker-term-capitalization-preservation",
      title: "Marker Term Capitalization Preservation",
      description:
        "Compare exact and Unicode-default-lowercased supplied critical terms without normalizing the returned source text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceToken: { type: "string", maxLength: 8192 },
          proposedToken: { type: "string", maxLength: 8192 },
        },
        required: ["sourceToken", "proposedToken"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exactMatch: { type: "boolean" },
          sameIgnoringCase: { type: "boolean" },
        },
        required: ["exactMatch", "sameIgnoringCase"],
      },
      ports: {
        inputs: [
          {
            id: "sourceToken",
            label: "Source Token",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "proposedToken",
            label: "Proposed Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "exactMatch",
            label: "Exact Match",
            valueType: { type: "boolean" },
          },
          {
            id: "sameIgnoringCase",
            label: "Same Ignoring Case",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = markerTermCapitalizationPreservationTool.execute;
export default markerTermCapitalizationPreservationTool;
