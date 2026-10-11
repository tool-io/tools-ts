import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly originalLabelText: string;
};
export type Output = { readonly quotation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    originalLabelText: { type: "string", maxLength: 8192 },
  },
  required: ["specimenId", "originalLabelText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quotation: { type: "string", maxLength: 8192 } },
  required: ["quotation"],
} as const;
/** Quote original specimen-label text using JSON string escaping without correcting or normalizing transcription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, originalLabelText } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    return { quotation: specimenId + ": " + JSON.stringify(originalLabelText) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "Z17", originalLabelText: "Site A, 1900" },
  output: { quotation: 'Z17: "Site A, 1900"' },
} satisfies ToolExample<Input, Output>;
export const specimenOriginalLabelQuoteTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["zoology", "biology"],
      keywords: ["zoology", "biology"],
    },
    id: "zoology/specimen-original-label-quote",
    title: "Specimen Original Label Quote",
    description:
      "Quote original specimen-label text using JSON string escaping without correcting or normalizing transcription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        originalLabelText: { type: "string", maxLength: 8192 },
      },
      required: ["specimenId", "originalLabelText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quotation: { type: "string", maxLength: 8192 } },
      required: ["quotation"],
    },
    ports: {
      inputs: [
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalLabelText",
          label: "Original Label Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "quotation", label: "Quotation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = specimenOriginalLabelQuoteTool.execute;
export default specimenOriginalLabelQuoteTool;
