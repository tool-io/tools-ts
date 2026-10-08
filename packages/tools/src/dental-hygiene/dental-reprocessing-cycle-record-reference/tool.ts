import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrumentBatchId: string;
  readonly cycleRecordId: string;
  readonly equipmentId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrumentBatchId: { type: "string", maxLength: 8192, minLength: 1 },
    cycleRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["instrumentBatchId", "cycleRecordId", "equipmentId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link an explicit dental instrument batch to a reprocessing-cycle record without certifying sterility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrumentBatchId, cycleRecordId, equipmentId } = request;
  const compute = (): Output => {
    H.domain(instrumentBatchId.length > 0, "instrumentBatchId");
    H.domain(cycleRecordId.length > 0, "cycleRecordId");
    H.domain(equipmentId.length > 0, "equipmentId");
    return {
      token: JSON.stringify([instrumentBatchId, cycleRecordId, equipmentId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { instrumentBatchId: "B17", cycleRecordId: "C4", equipmentId: "E2" },
  output: { token: '["B17","C4","E2"]' },
} satisfies ToolExample<Input, Output>;
export const dentalReprocessingCycleRecordReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dental-hygiene/dental-reprocessing-cycle-record-reference",
      title: "Dental Reprocessing Cycle Record Reference Tool",
      description:
        "Link an explicit dental instrument batch to a reprocessing-cycle record without certifying sterility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          instrumentBatchId: { type: "string", maxLength: 8192, minLength: 1 },
          cycleRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["instrumentBatchId", "cycleRecordId", "equipmentId"],
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
            id: "instrumentBatchId",
            label: "Instrument Batch Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "cycleRecordId",
            label: "Cycle Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "equipmentId",
            label: "Equipment Id",
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
export const run = dentalReprocessingCycleRecordReferenceTool.execute;
export default dentalReprocessingCycleRecordReferenceTool;
