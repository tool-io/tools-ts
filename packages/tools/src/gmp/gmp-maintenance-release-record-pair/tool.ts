import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equipmentId: string;
  readonly releaseEquipmentId: string;
  readonly workOrder: string;
  readonly releaseWorkOrder: string;
  readonly maintenanceEnd: number;
  readonly releaseTime: number;
};
export type Output = {
  readonly equipmentMatches: boolean;
  readonly workOrderMatches: boolean;
  readonly ordered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentId: { type: "string", maxLength: 8192 },
    releaseEquipmentId: { type: "string", maxLength: 8192 },
    workOrder: { type: "string", maxLength: 8192 },
    releaseWorkOrder: { type: "string", maxLength: 8192 },
    maintenanceEnd: { type: "number" },
    releaseTime: { type: "number" },
  },
  required: [
    "equipmentId",
    "releaseEquipmentId",
    "workOrder",
    "releaseWorkOrder",
    "maintenanceEnd",
    "releaseTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentMatches: { type: "boolean" },
    workOrderMatches: { type: "boolean" },
    ordered: { type: "boolean" },
  },
  required: ["equipmentMatches", "workOrderMatches", "ordered"],
} as const;
/** Compare explicit maintenance/release record references and chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    equipmentId,
    releaseEquipmentId,
    workOrder,
    releaseWorkOrder,
    maintenanceEnd,
    releaseTime,
  } = request;
  const compute = (): Output => {
    return {
      equipmentMatches: equipmentId === releaseEquipmentId,
      workOrderMatches: workOrder === releaseWorkOrder,
      ordered: releaseTime >= maintenanceEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    equipmentId: "E1",
    releaseEquipmentId: "E1",
    workOrder: "W1",
    releaseWorkOrder: "W1",
    maintenanceEnd: 100,
    releaseTime: 105,
  },
  output: { equipmentMatches: true, workOrderMatches: true, ordered: true },
} satisfies ToolExample<Input, Output>;
export const gmpMaintenanceReleaseRecordPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-maintenance-release-record-pair",
    title: "GMP Maintenance Release Record Pair Tool",
    description:
      "Compare explicit maintenance/release record references and chronology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equipmentId: { type: "string", maxLength: 8192 },
        releaseEquipmentId: { type: "string", maxLength: 8192 },
        workOrder: { type: "string", maxLength: 8192 },
        releaseWorkOrder: { type: "string", maxLength: 8192 },
        maintenanceEnd: { type: "number" },
        releaseTime: { type: "number" },
      },
      required: [
        "equipmentId",
        "releaseEquipmentId",
        "workOrder",
        "releaseWorkOrder",
        "maintenanceEnd",
        "releaseTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equipmentMatches: { type: "boolean" },
        workOrderMatches: { type: "boolean" },
        ordered: { type: "boolean" },
      },
      required: ["equipmentMatches", "workOrderMatches", "ordered"],
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
          id: "releaseEquipmentId",
          label: "Release Equipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "workOrder",
          label: "Work Order",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "releaseWorkOrder",
          label: "Release Work Order",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maintenanceEnd",
          label: "Maintenance End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releaseTime",
          label: "Release Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equipmentMatches",
          label: "Equipment Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "workOrderMatches",
          label: "Work Order Matches",
          valueType: { type: "boolean" },
        },
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gmpMaintenanceReleaseRecordPairTool.execute;
export default gmpMaintenanceReleaseRecordPairTool;
