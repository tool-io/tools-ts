import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly received: number;
  readonly used: number;
  readonly rejected: number;
};
export type Output = {
  readonly remainingDecimal: string;
  readonly deltaDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    used: { type: "integer", minimum: 0 },
    rejected: { type: "integer", minimum: 0 },
  },
  required: ["initial", "received", "used", "rejected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingDecimal: { type: "string", maxLength: 8192 },
    deltaDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["remainingDecimal", "deltaDecimal"],
} as const;
/** Audit explicit component ledgers exactly, retaining negative reconciliation discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, received, used, rejected } = request;
  const compute = (): Output => {
    H.integer(initial, 0);
    H.integer(received, 0);
    H.integer(used, 0);
    H.integer(rejected, 0);
    return {
      remainingDecimal: (
        BigInt(initial) +
        BigInt(received) -
        BigInt(used) -
        BigInt(rejected)
      ).toString(),
      deltaDecimal: (
        BigInt(received) -
        BigInt(used) -
        BigInt(rejected)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 100, received: 20, used: 80, rejected: 5 },
  output: { remainingDecimal: "35", deltaDecimal: "-65" },
} satisfies ToolExample<Input, Output>;
export const packagingComponentCountDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/packaging-component-count-delta",
    title: "Packaging Component Count Delta Tool",
    description:
      "Audit explicit component ledgers exactly, retaining negative reconciliation discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "integer", minimum: 0 },
        received: { type: "integer", minimum: 0 },
        used: { type: "integer", minimum: 0 },
        rejected: { type: "integer", minimum: 0 },
      },
      required: ["initial", "received", "used", "rejected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingDecimal: { type: "string", maxLength: 8192 },
        deltaDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["remainingDecimal", "deltaDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
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
          id: "used",
          label: "Used",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rejected",
          label: "Rejected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingDecimal",
          label: "Remaining Decimal",
          valueType: { type: "string" },
        },
        {
          id: "deltaDecimal",
          label: "Delta Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = packagingComponentCountDeltaTool.execute;
export default packagingComponentCountDeltaTool;
