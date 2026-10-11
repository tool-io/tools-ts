import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly referenceCompoundId: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    referenceCompoundId: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "referenceCompoundId", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Tag an explicit assay reference-compound record without asserting identity or equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, referenceCompoundId, source } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(referenceCompoundId.length > 0, "referenceCompoundId");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([assayId, referenceCompoundId, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assayId: "A17", referenceCompoundId: "CMP2", source: "Protocol v2" },
  output: { token: '["A17","CMP2","Protocol v2"]' },
} satisfies ToolExample<Input, Output>;
export const pdReferenceCompoundTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacodynamics", "pharmacy"],
      keywords: ["pharmacodynamics", "pharmacy"],
    },
    id: "pharmacodynamics/pd-reference-compound-tag",
    title: "PD Reference Compound Tag",
    description:
      "Tag an explicit assay reference-compound record without asserting identity or equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assayId: { type: "string", maxLength: 8192, minLength: 1 },
        referenceCompoundId: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["assayId", "referenceCompoundId", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "assayId",
          label: "Assay Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceCompoundId",
          label: "Reference Compound Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pdReferenceCompoundTagTool.execute;
export default pdReferenceCompoundTagTool;
