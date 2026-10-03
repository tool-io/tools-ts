import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly received: number;
  readonly tested: number;
  readonly reserved: number;
  readonly discarded: number;
  readonly evaporation: number;
};
export type Output = {
  readonly remaining: number;
  readonly unreserved: number;
  readonly consumedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    received: { type: "number", exclusiveMinimum: 0 },
    tested: { type: "number", minimum: 0 },
    reserved: { type: "number", minimum: 0 },
    discarded: { type: "number", minimum: 0 },
    evaporation: { type: "number", minimum: 0 },
  },
  required: ["received", "tested", "reserved", "discarded", "evaporation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    unreserved: { type: "number" },
    consumedFraction: { type: "number" },
  },
  required: ["remaining", "unreserved", "consumedFraction"],
} as const;
/** Calculate qc sample reserve consumed balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { received, tested, reserved, discarded, evaporation } = request;
  const compute = (): Output => {
    H.positive(received);
    H.domain(
      tested >= 0 &&
        reserved >= 0 &&
        discarded >= 0 &&
        evaporation >= 0 &&
        tested + discarded + evaporation <= received,
    );
    return {
      remaining: received - tested - discarded - evaporation,
      unreserved: received - tested - discarded - evaporation - reserved,
      consumedFraction: (tested + discarded + evaporation) / received,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    received: 100,
    tested: 30,
    reserved: 20,
    discarded: 5,
    evaporation: 2,
  },
  output: { remaining: 63, unreserved: 43, consumedFraction: 0.37 },
} satisfies ToolExample<Input, Output>;
export const qcSampleReserveConsumedBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-sample-reserve-consumed-balance",
    title: "QC Sample Reserve Consumed Balance Tool",
    description:
      "Calculate qc sample reserve consumed balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        received: { type: "number", exclusiveMinimum: 0 },
        tested: { type: "number", minimum: 0 },
        reserved: { type: "number", minimum: 0 },
        discarded: { type: "number", minimum: 0 },
        evaporation: { type: "number", minimum: 0 },
      },
      required: ["received", "tested", "reserved", "discarded", "evaporation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        unreserved: { type: "number" },
        consumedFraction: { type: "number" },
      },
      required: ["remaining", "unreserved", "consumedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tested",
          label: "Tested",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discarded",
          label: "Discarded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporation",
          label: "Evaporation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "unreserved",
          label: "Unreserved",
          valueType: { type: "number" },
        },
        {
          id: "consumedFraction",
          label: "Consumed Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcSampleReserveConsumedBalanceTool.execute;
export default qcSampleReserveConsumedBalanceTool;
