import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly extractionStepId: string;
  readonly suppliedFractionName: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    extractionStepId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedFractionName: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "extractionStepId", "suppliedFractionName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit sediment extraction step and operational fraction label without assigning chemical speciation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, extractionStepId, suppliedFractionName } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(extractionStepId.length > 0, "extractionStepId");
    H.domain(suppliedFractionName.length > 0, "suppliedFractionName");
    return {
      token: JSON.stringify([sampleId, extractionStepId, suppliedFractionName]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    extractionStepId: "step 2",
    suppliedFractionName: "operational fraction B",
  },
  output: { token: '["S17","step 2","operational fraction B"]' },
} satisfies ToolExample<Input, Output>;
export const sedimentExtractionStepFractionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/sediment-extraction-step-fraction-label",
      title: "Sediment Extraction Step Fraction Label Tool",
      description:
        "Preserve an explicit sediment extraction step and operational fraction label without assigning chemical speciation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleId: { type: "string", maxLength: 8192, minLength: 1 },
          extractionStepId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedFractionName: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["sampleId", "extractionStepId", "suppliedFractionName"],
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
            id: "sampleId",
            label: "Sample Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "extractionStepId",
            label: "Extraction Step Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedFractionName",
            label: "Supplied Fraction Name",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = sedimentExtractionStepFractionLabelTool.execute;
export default sedimentExtractionStepFractionLabelTool;
