import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly originalNameText: string;
  readonly determinationRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    originalNameText: { type: "string", maxLength: 8192, minLength: 1 },
    determinationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "originalNameText", "determinationRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit original specimen determination by record source without revising identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, originalNameText, determinationRecordId } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(originalNameText.length > 0, "originalNameText");
    H.domain(determinationRecordId.length > 0, "determinationRecordId");
    return {
      token: JSON.stringify([
        specimenId,
        originalNameText,
        determinationRecordId,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "SP17",
    originalNameText: "Genus species",
    determinationRecordId: "DET2",
  },
  output: { token: '["SP17","Genus species","DET2"]' },
} satisfies ToolExample<Input, Output>;
export const specimenOriginalDeterminationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/specimen-original-determination-label",
    title: "Specimen Original Determination Label",
    description:
      "Qualify an explicit original specimen determination by record source without revising identification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        originalNameText: { type: "string", maxLength: 8192, minLength: 1 },
        determinationRecordId: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["specimenId", "originalNameText", "determinationRecordId"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalNameText",
          label: "Original Name Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "determinationRecordId",
          label: "Determination Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = specimenOriginalDeterminationLabelTool.execute;
export default specimenOriginalDeterminationLabelTool;
