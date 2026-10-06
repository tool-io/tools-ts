import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly salinityText: string;
  readonly referenceScale: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    salinityText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceScale: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "salinityText", "referenceScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit waterbody salinity transcription and reference scale without converting scales. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, salinityText, referenceScale } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(salinityText.length > 0, "salinityText");
    H.domain(referenceScale.length > 0, "referenceScale");
    return { token: JSON.stringify([sampleId, salinityText, referenceScale]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    salinityText: "35",
    referenceScale: "practical salinity",
  },
  output: { token: '["S17","35","practical salinity"]' },
} satisfies ToolExample<Input, Output>;
export const waterbodySalinityReferenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/waterbody-salinity-reference-tag",
    title: "Waterbody Salinity Reference Tag",
    description:
      "Preserve an explicit waterbody salinity transcription and reference scale without converting scales.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        salinityText: { type: "string", maxLength: 8192, minLength: 1 },
        referenceScale: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "salinityText", "referenceScale"],
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
          id: "salinityText",
          label: "Salinity Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceScale",
          label: "Reference Scale",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = waterbodySalinityReferenceTagTool.execute;
export default waterbodySalinityReferenceTagTool;
