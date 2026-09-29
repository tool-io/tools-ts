import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotIds: readonly string[];
  readonly consumed: readonly number[];
  readonly batchIds: readonly string[];
  readonly requestedBatch: string;
};
export type Output = {
  readonly lots: readonly string[];
  readonly batchMass: number;
  readonly lotMasses: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    consumed: { type: "array", maxItems: 256, items: { type: "number" } },
    batchIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedBatch: { type: "string", maxLength: 8192 },
  },
  required: ["lotIds", "consumed", "batchIds", "requestedBatch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lots: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    batchMass: { type: "number" },
    lotMasses: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["lots", "batchMass", "lotMasses"],
} as const;
/** Aggregate explicit component-lot use for one batch ID. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotIds, consumed, batchIds, requestedBatch } = request;
  const compute = (): Output => {
    H.sameLength(lotIds, consumed);
    H.sameLength(lotIds, batchIds);
    H.domain(consumed.every((x) => x >= 0));
    const lots = [
        ...new Set(lotIds.filter((_, i) => batchIds[i] === requestedBatch)),
      ],
      lotMasses = lots.map((id) =>
        consumed.reduce(
          (a, x, i) =>
            a + (batchIds[i] === requestedBatch && lotIds[i] === id ? x : 0),
          0,
        ),
      );
    return { lots, batchMass: lotMasses.reduce((a, b) => a + b, 0), lotMasses };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lotIds: ["L1", "L2", "L1"],
    consumed: [10, 20, 5],
    batchIds: ["B", "B", "C"],
    requestedBatch: "B",
  },
  output: { lots: ["L1", "L2"], batchMass: 30, lotMasses: [10, 20] },
} satisfies ToolExample<Input, Output>;
export const pharmaComponentLotUseAllocationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-pharmacy/pharma-component-lot-use-allocation-term",
      title: "Pharma Component Lot Use Allocation Term Tool",
      description: "Aggregate explicit component-lot use for one batch ID.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lotIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          consumed: { type: "array", maxItems: 256, items: { type: "number" } },
          batchIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          requestedBatch: { type: "string", maxLength: 8192 },
        },
        required: ["lotIds", "consumed", "batchIds", "requestedBatch"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lots: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          batchMass: { type: "number" },
          lotMasses: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["lots", "batchMass", "lotMasses"],
      },
      ports: {
        inputs: [
          {
            id: "lotIds",
            label: "Lot Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "consumed",
            label: "Consumed",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "batchIds",
            label: "Batch Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "requestedBatch",
            label: "Requested Batch",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lots",
            label: "Lots",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "batchMass",
            label: "Batch Mass",
            valueType: { type: "number" },
          },
          {
            id: "lotMasses",
            label: "Lot Masses",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaComponentLotUseAllocationTermTool.execute;
export default pharmaComponentLotUseAllocationTermTool;
