import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly delimiter: string;
  readonly expectedParts: number;
};
export type Output = {
  readonly parts: readonly string[];
  readonly partCountMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    delimiter: { type: "string", maxLength: 8192 },
    expectedParts: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["token", "delimiter", "expectedParts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    partCountMatches: { type: "boolean" },
  },
  required: ["parts", "partCountMatches"],
} as const;
/** Split a supplied research lesion identifier under an explicit delimiter convention without characterizing lesions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, delimiter, expectedParts } = request;
  const compute = (): Output => {
    H.domain(delimiter.length > 0);
    H.integer(expectedParts, 1, 256);
    const parts = token.split(delimiter);
    return { parts, partCountMatches: parts.length === expectedParts };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "study:patient:L2", delimiter: ":", expectedParts: 3 },
  output: { parts: ["study", "patient", "L2"], partCountMatches: true },
} satisfies ToolExample<Input, Output>;
export const researchLesionIdSplitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/research-lesion-id-split-token",
    title: "Research Lesion ID Split Token Tool",
    description:
      "Split a supplied research lesion identifier under an explicit delimiter convention without characterizing lesions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        delimiter: { type: "string", maxLength: 8192 },
        expectedParts: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["token", "delimiter", "expectedParts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        partCountMatches: { type: "boolean" },
      },
      required: ["parts", "partCountMatches"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedParts",
          label: "Expected Parts",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "parts",
          label: "Parts",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "partCountMatches",
          label: "Part Count Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchLesionIdSplitTokenTool.execute;
export default researchLesionIdSplitTokenTool;
