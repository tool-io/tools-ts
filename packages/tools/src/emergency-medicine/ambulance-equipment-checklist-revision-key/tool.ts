import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vehicleId: string;
  readonly checklistId: string;
  readonly revision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vehicleId: { type: "string", maxLength: 8192, minLength: 1 },
    checklistId: { type: "string", maxLength: 8192, minLength: 1 },
    revision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["vehicleId", "checklistId", "revision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicit ambulance checklist revision reference without verifying readiness or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vehicleId, checklistId, revision } = request;
  const compute = (): Output => {
    H.domain(vehicleId.length > 0, "vehicleId");
    H.domain(checklistId.length > 0, "checklistId");
    H.domain(revision.length > 0, "revision");
    return { token: JSON.stringify([vehicleId, checklistId, revision]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vehicleId: "V17", checklistId: "CL4", revision: "v2" },
  output: { token: '["V17","CL4","v2"]' },
} satisfies ToolExample<Input, Output>;
export const ambulanceEquipmentChecklistRevisionKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "emergency-medicine/ambulance-equipment-checklist-revision-key",
      title: "Ambulance Equipment Checklist Revision Key Tool",
      description:
        "Encode an explicit ambulance checklist revision reference without verifying readiness or compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          vehicleId: { type: "string", maxLength: 8192, minLength: 1 },
          checklistId: { type: "string", maxLength: 8192, minLength: 1 },
          revision: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["vehicleId", "checklistId", "revision"],
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
            id: "vehicleId",
            label: "Vehicle Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "checklistId",
            label: "Checklist Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "revision",
            label: "Revision",
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
export const run = ambulanceEquipmentChecklistRevisionKeyTool.execute;
export default ambulanceEquipmentChecklistRevisionKeyTool;
