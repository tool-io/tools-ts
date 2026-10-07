import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly calibrantCode: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    calibrantCode: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "calibrantCode", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit protein-assay calibrant reference by source version without choosing a calibrant or estimating concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, calibrantCode, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(calibrantCode.length > 0, "calibrantCode");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return { token: JSON.stringify([assayId, calibrantCode, sourceVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assayId: "A17", calibrantCode: "CAL2", sourceVersion: "v2" },
  output: { token: '["A17","CAL2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const proteinAssayCalibrantReferenceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/protein-assay-calibrant-reference-code",
    title: "Protein Assay Calibrant Reference Code",
    description:
      "Qualify an explicit protein-assay calibrant reference by source version without choosing a calibrant or estimating concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assayId: { type: "string", maxLength: 8192, minLength: 1 },
        calibrantCode: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["assayId", "calibrantCode", "sourceVersion"],
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
          id: "calibrantCode",
          label: "Calibrant Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = proteinAssayCalibrantReferenceCodeTool.execute;
export default proteinAssayCalibrantReferenceCodeTool;
