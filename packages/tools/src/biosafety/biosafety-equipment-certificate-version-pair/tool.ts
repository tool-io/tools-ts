import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equipmentId: string;
  readonly certificateEquipment: string;
  readonly requiredVersion: string;
  readonly certificateVersion: string;
  readonly expiryDay: number;
  readonly observationDay: number;
};
export type Output = {
  readonly equipmentMatches: boolean;
  readonly versionMatches: boolean;
  readonly unexpired: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentId: { type: "string", maxLength: 8192 },
    certificateEquipment: { type: "string", maxLength: 8192 },
    requiredVersion: { type: "string", maxLength: 8192 },
    certificateVersion: { type: "string", maxLength: 8192 },
    expiryDay: { type: "integer" },
    observationDay: { type: "integer" },
  },
  required: [
    "equipmentId",
    "certificateEquipment",
    "requiredVersion",
    "certificateVersion",
    "expiryDay",
    "observationDay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentMatches: { type: "boolean" },
    versionMatches: { type: "boolean" },
    unexpired: { type: "boolean" },
  },
  required: ["equipmentMatches", "versionMatches", "unexpired"],
} as const;
/** Compare explicit certificate identity, version and expiry fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    equipmentId,
    certificateEquipment,
    requiredVersion,
    certificateVersion,
    expiryDay,
    observationDay,
  } = request;
  const compute = (): Output => {
    return {
      equipmentMatches: equipmentId === certificateEquipment,
      versionMatches: requiredVersion === certificateVersion,
      unexpired: observationDay <= expiryDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    equipmentId: "E1",
    certificateEquipment: "E1",
    requiredVersion: "v2",
    certificateVersion: "v1",
    expiryDay: 200,
    observationDay: 180,
  },
  output: { equipmentMatches: true, versionMatches: false, unexpired: true },
} satisfies ToolExample<Input, Output>;
export const biosafetyEquipmentCertificateVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-equipment-certificate-version-pair",
      title: "Biosafety Equipment Certificate Version Pair Tool",
      description:
        "Compare explicit certificate identity, version and expiry fields.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equipmentId: { type: "string", maxLength: 8192 },
          certificateEquipment: { type: "string", maxLength: 8192 },
          requiredVersion: { type: "string", maxLength: 8192 },
          certificateVersion: { type: "string", maxLength: 8192 },
          expiryDay: { type: "integer" },
          observationDay: { type: "integer" },
        },
        required: [
          "equipmentId",
          "certificateEquipment",
          "requiredVersion",
          "certificateVersion",
          "expiryDay",
          "observationDay",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equipmentMatches: { type: "boolean" },
          versionMatches: { type: "boolean" },
          unexpired: { type: "boolean" },
        },
        required: ["equipmentMatches", "versionMatches", "unexpired"],
      },
      ports: {
        inputs: [
          {
            id: "equipmentId",
            label: "Equipment Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "certificateEquipment",
            label: "Certificate Equipment",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "requiredVersion",
            label: "Required Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "certificateVersion",
            label: "Certificate Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expiryDay",
            label: "Expiry Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "observationDay",
            label: "Observation Day",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "equipmentMatches",
            label: "Equipment Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "versionMatches",
            label: "Version Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "unexpired",
            label: "Unexpired",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyEquipmentCertificateVersionPairTool.execute;
export default biosafetyEquipmentCertificateVersionPairTool;
