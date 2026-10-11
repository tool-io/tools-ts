import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equipmentRecordId: string;
  readonly inspectionId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    inspectionId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["equipmentRecordId", "inspectionId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit protective-equipment inspection reference by version without assessing protection or certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equipmentRecordId, inspectionId, version } = request;
  const compute = (): Output => {
    H.domain(equipmentRecordId.length > 0, "equipmentRecordId");
    H.domain(inspectionId.length > 0, "inspectionId");
    H.domain(version.length > 0, "version");
    return {
      token: JSON.stringify([equipmentRecordId, inspectionId, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { equipmentRecordId: "EQ17", inspectionId: "INS2", version: "v2" },
  output: { token: '["EQ17","INS2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const protectiveInspectionRecordVersionTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["security-studies", "security studies", "social sciences"],
        keywords: ["security studies", "social sciences"],
      },
      id: "security-studies/protective-inspection-record-version-token",
      title: "Protective Inspection Record Version Token",
      description:
        "Qualify an explicit protective-equipment inspection reference by version without assessing protection or certification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equipmentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          inspectionId: { type: "string", maxLength: 8192, minLength: 1 },
          version: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["equipmentRecordId", "inspectionId", "version"],
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
            id: "equipmentRecordId",
            label: "Equipment Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "inspectionId",
            label: "Inspection Id",
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
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = protectiveInspectionRecordVersionTokenTool.execute;
export default protectiveInspectionRecordVersionTokenTool;
