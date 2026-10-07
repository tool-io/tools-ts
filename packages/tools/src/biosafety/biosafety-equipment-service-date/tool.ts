import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equipmentId: string;
  readonly recordedServiceDate: string;
  readonly serviceRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedServiceDate: { type: "string", maxLength: 8192, minLength: 1 },
    serviceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["equipmentId", "recordedServiceDate", "serviceRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit equipment service-date record without specifying maintenance procedures or deciding readiness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equipmentId, recordedServiceDate, serviceRecordId } = request;
  const compute = (): Output => {
    H.domain(equipmentId.length > 0, "equipmentId");
    H.domain(recordedServiceDate.length > 0, "recordedServiceDate");
    H.domain(serviceRecordId.length > 0, "serviceRecordId");
    return {
      token: JSON.stringify([
        equipmentId,
        recordedServiceDate,
        serviceRecordId,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    equipmentId: "EQ17",
    recordedServiceDate: "2026-11-01",
    serviceRecordId: "SR2",
  },
  output: { token: '["EQ17","2026-11-01","SR2"]' },
} satisfies ToolExample<Input, Output>;
export const biosafetyEquipmentserviceDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosafety", "research and quality management"],
      keywords: ["biosafety", "research and quality management"],
    },
    id: "biosafety/biosafety-equipment-service-date",
    title: "Biosafety Equipment Service Date",
    description:
      "Preserve an explicit equipment service-date record without specifying maintenance procedures or deciding readiness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedServiceDate: { type: "string", maxLength: 8192, minLength: 1 },
        serviceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["equipmentId", "recordedServiceDate", "serviceRecordId"],
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
          id: "equipmentId",
          label: "Equipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedServiceDate",
          label: "Recorded Service Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "serviceRecordId",
          label: "Service Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosafetyEquipmentserviceDateTool.execute;
export default biosafetyEquipmentserviceDateTool;
