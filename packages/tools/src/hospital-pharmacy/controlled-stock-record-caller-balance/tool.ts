import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly received: number;
  readonly supplied: number;
  readonly returned: number;
  readonly destroyed: number;
  readonly recordedClosing: number;
};
export type Output = {
  readonly calculatedClosing: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    supplied: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    destroyed: { type: "integer", minimum: 0 },
    recordedClosing: { type: "integer", minimum: 0 },
  },
  required: [
    "opening",
    "received",
    "supplied",
    "returned",
    "destroyed",
    "recordedClosing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculatedClosing: { type: "integer" },
    discrepancy: { type: "integer" },
  },
  required: ["calculatedClosing", "discrepancy"],
} as const;
/** Reconcile supplied stock ledger counts without certifying a regulated register. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, received, supplied, returned, destroyed, recordedClosing } =
    request;
  const compute = (): Output => {
    H.integer(opening, 0);
    H.integer(received, 0);
    H.integer(supplied, 0);
    H.integer(returned, 0);
    H.integer(destroyed, 0);
    H.integer(recordedClosing, 0);
    return {
      calculatedClosing: opening + received - supplied + returned - destroyed,
      discrepancy:
        recordedClosing - opening - received + supplied - returned + destroyed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    received: 20,
    supplied: 30,
    returned: 2,
    destroyed: 5,
    recordedClosing: 86,
  },
  output: { calculatedClosing: 87, discrepancy: -1 },
} satisfies ToolExample<Input, Output>;
export const controlledStockRecordCallerBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/controlled-stock-record-caller-balance",
    title: "Controlled Stock Record Caller Balance Tool",
    description:
      "Reconcile supplied stock ledger counts without certifying a regulated register.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "integer", minimum: 0 },
        received: { type: "integer", minimum: 0 },
        supplied: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        destroyed: { type: "integer", minimum: 0 },
        recordedClosing: { type: "integer", minimum: 0 },
      },
      required: [
        "opening",
        "received",
        "supplied",
        "returned",
        "destroyed",
        "recordedClosing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calculatedClosing: { type: "integer" },
        discrepancy: { type: "integer" },
      },
      required: ["calculatedClosing", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "supplied",
          label: "Supplied",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destroyed",
          label: "Destroyed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedClosing",
          label: "Recorded Closing",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calculatedClosing",
          label: "Calculated Closing",
          valueType: { type: "integer" },
        },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = controlledStockRecordCallerBalanceTool.execute;
export default controlledStockRecordCallerBalanceTool;
