import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly medicineId: string;
  readonly labelId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medicineId: { type: "string", maxLength: 8192, minLength: 1 },
    labelId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["medicineId", "labelId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit medication-label identifier by version without authenticating the label. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { medicineId, labelId, version } = request;
  const compute = (): Output => {
    H.domain(medicineId.length > 0, "medicineId");
    H.domain(labelId.length > 0, "labelId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([medicineId, labelId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { medicineId: "MED17", labelId: "LBL2", version: "v2" },
  output: { token: '["MED17","LBL2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const medicationLabelVersionReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/medication-label-version-reference",
    title: "Medication Label Version Reference",
    description:
      "Qualify an explicit medication-label identifier by version without authenticating the label.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        medicineId: { type: "string", maxLength: 8192, minLength: 1 },
        labelId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["medicineId", "labelId", "version"],
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
          id: "medicineId",
          label: "Medicine Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelId",
          label: "Label Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = medicationLabelVersionReferenceTool.execute;
export default medicationLabelVersionReferenceTool;
