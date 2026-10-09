import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly correctionId: string;
  readonly suppliedReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    correctionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "correctionId", "suppliedReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit home-health correction marker without changing or clinically interpreting the source record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, correctionId, suppliedReason } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(correctionId.length > 0, "correctionId");
    H.domain(suppliedReason.length > 0, "suppliedReason");
    return { token: JSON.stringify([entryId, correctionId, suppliedReason]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryId: "E17",
    correctionId: "COR2",
    suppliedReason: "transcription correction",
  },
  output: { token: '["E17","COR2","transcription correction"]' },
} satisfies ToolExample<Input, Output>;
export const homeHealthEntryCorrectionMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/home-health-entry-correction-marker",
    title: "Home Health Entry Correction Marker",
    description:
      "Preserve an explicit home-health correction marker without changing or clinically interpreting the source record.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        correctionId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entryId", "correctionId", "suppliedReason"],
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
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctionId",
          label: "Correction Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReason",
          label: "Supplied Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeHealthEntryCorrectionMarkerTool.execute;
export default homeHealthEntryCorrectionMarkerTool;
