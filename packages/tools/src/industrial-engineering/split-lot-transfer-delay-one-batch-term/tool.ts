import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotUnits: number;
  readonly transferUnits: number;
  readonly processingMinutesPerUnit: number;
  readonly transferMinutes: number;
};
export type Output = {
  readonly firstTransferReadyMinutes: number;
  readonly totalTransfers: number;
  readonly transferTimeTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotUnits: { type: "integer", minimum: 1 },
    transferUnits: { type: "integer", minimum: 1 },
    processingMinutesPerUnit: { type: "number", minimum: 0 },
    transferMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "lotUnits",
    "transferUnits",
    "processingMinutesPerUnit",
    "transferMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTransferReadyMinutes: { type: "number" },
    totalTransfers: { type: "integer" },
    transferTimeTotal: { type: "number" },
  },
  required: [
    "firstTransferReadyMinutes",
    "totalTransfers",
    "transferTimeTotal",
  ],
} as const;
/** Transfer-batch readiness and count, excluding downstream blocking and overlapping transport schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotUnits, transferUnits, processingMinutesPerUnit, transferMinutes } =
    request;
  const compute = (): Output => {
    H.integer(lotUnits, 1);
    H.integer(transferUnits, 1);
    H.domain(processingMinutesPerUnit >= 0 && transferMinutes >= 0);
    return {
      firstTransferReadyMinutes:
        Math.min(lotUnits, transferUnits) * processingMinutesPerUnit,
      totalTransfers: Math.ceil(lotUnits / transferUnits),
      transferTimeTotal: Math.ceil(lotUnits / transferUnits) * transferMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lotUnits: 100,
    transferUnits: 20,
    processingMinutesPerUnit: 0.5,
    transferMinutes: 2,
  },
  output: {
    firstTransferReadyMinutes: 10,
    totalTransfers: 5,
    transferTimeTotal: 10,
  },
} satisfies ToolExample<Input, Output>;
export const splitLotTransferDelayOneBatchTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/split-lot-transfer-delay-one-batch-term",
    title: "Split Lot Transfer Delay One Batch Term Tool",
    description:
      "Transfer-batch readiness and count, excluding downstream blocking and overlapping transport schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotUnits: { type: "integer", minimum: 1 },
        transferUnits: { type: "integer", minimum: 1 },
        processingMinutesPerUnit: { type: "number", minimum: 0 },
        transferMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "lotUnits",
        "transferUnits",
        "processingMinutesPerUnit",
        "transferMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTransferReadyMinutes: { type: "number" },
        totalTransfers: { type: "integer" },
        transferTimeTotal: { type: "number" },
      },
      required: [
        "firstTransferReadyMinutes",
        "totalTransfers",
        "transferTimeTotal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "lotUnits",
          label: "Lot Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferUnits",
          label: "Transfer Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "processingMinutesPerUnit",
          label: "Processing Minutes Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferMinutes",
          label: "Transfer Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "firstTransferReadyMinutes",
          label: "First Transfer Ready Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "totalTransfers",
          label: "Total Transfers",
          valueType: { type: "integer" },
        },
        {
          id: "transferTimeTotal",
          label: "Transfer Time Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = splitLotTransferDelayOneBatchTermTool.execute;
export default splitLotTransferDelayOneBatchTermTool;
