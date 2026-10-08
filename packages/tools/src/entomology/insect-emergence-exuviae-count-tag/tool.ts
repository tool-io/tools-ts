import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly countText: string;
  readonly sourceMethod: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    countText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceMethod: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "countText", "sourceMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit insect emergence exuviae count transcription and source method without assigning individual emergence totals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, countText, sourceMethod } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(countText.length > 0, "countText");
    H.domain(sourceMethod.length > 0, "sourceMethod");
    return { token: JSON.stringify([sampleId, countText, sourceMethod]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", countText: "12", sourceMethod: "exuviae count" },
  output: { token: '["S17","12","exuviae count"]' },
} satisfies ToolExample<Input, Output>;
export const insectEmergenceExuviaeCountTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-emergence-exuviae-count-tag",
    title: "Insect Emergence Exuviae Count Tag Tool",
    description:
      "Preserve explicit insect emergence exuviae count transcription and source method without assigning individual emergence totals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        countText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceMethod: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "countText", "sourceMethod"],
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
          id: "countText",
          label: "Count Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceMethod",
          label: "Source Method",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = insectEmergenceExuviaeCountTagTool.execute;
export default insectEmergenceExuviaeCountTagTool;
