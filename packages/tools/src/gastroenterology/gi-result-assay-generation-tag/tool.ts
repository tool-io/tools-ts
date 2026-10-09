import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly methodId: string;
  readonly assayGeneration: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    methodId: { type: "string", maxLength: 8192, minLength: 1 },
    assayGeneration: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "methodId", "assayGeneration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit GI result assay-method and generation metadata without harmonizing results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, methodId, assayGeneration } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(methodId.length > 0, "methodId");
    H.domain(assayGeneration.length > 0, "assayGeneration");
    return { token: JSON.stringify([resultId, methodId, assayGeneration]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", methodId: "M4", assayGeneration: "generation 2" },
  output: { token: '["R17","M4","generation 2"]' },
} satisfies ToolExample<Input, Output>;
export const giResultAssayGenerationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/gi-result-assay-generation-tag",
    title: "GI Result Assay Generation Tag Tool",
    description:
      "Preserve explicit GI result assay-method and generation metadata without harmonizing results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        methodId: { type: "string", maxLength: 8192, minLength: 1 },
        assayGeneration: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "methodId", "assayGeneration"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "methodId",
          label: "Method Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assayGeneration",
          label: "Assay Generation",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = giResultAssayGenerationTagTool.execute;
export default giResultAssayGenerationTagTool;
