import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossBillings: number;
  readonly taxes: number;
  readonly refunds: number;
  readonly passThrough: number;
  readonly deferredIncrease: number;
};
export type Output = {
  readonly netBillings: number;
  readonly recognizedRevenue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossBillings: { type: "number", minimum: 0 },
    taxes: { type: "number", minimum: 0 },
    refunds: { type: "number", minimum: 0 },
    passThrough: { type: "number", minimum: 0 },
    deferredIncrease: { type: "number" },
  },
  required: [
    "grossBillings",
    "taxes",
    "refunds",
    "passThrough",
    "deferredIncrease",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netBillings: { type: "number" },
    recognizedRevenue: { type: "number" },
  },
  required: ["netBillings", "recognizedRevenue"],
} as const;
/** Explicit simplified reconciliation with signed deferred-balance increase; caller determines applicable accounting classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossBillings, taxes, refunds, passThrough, deferredIncrease } =
    request;
  const compute = (): Output => {
    H.domain(
      grossBillings >= 0 && taxes >= 0 && refunds >= 0 && passThrough >= 0,
    );
    return {
      netBillings: grossBillings - taxes - refunds - passThrough,
      recognizedRevenue:
        grossBillings - taxes - refunds - passThrough - deferredIncrease,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossBillings: 1000,
    taxes: 100,
    refunds: 50,
    passThrough: 100,
    deferredIncrease: 200,
  },
  output: { netBillings: 750, recognizedRevenue: 550 },
} satisfies ToolExample<Input, Output>;
export const grossNetRevenueRecognitionBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/gross-net-revenue-recognition-bridge",
    title: "Gross Net Revenue Recognition Bridge Tool",
    description:
      "Explicit simplified reconciliation with signed deferred-balance increase; caller determines applicable accounting classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossBillings: { type: "number", minimum: 0 },
        taxes: { type: "number", minimum: 0 },
        refunds: { type: "number", minimum: 0 },
        passThrough: { type: "number", minimum: 0 },
        deferredIncrease: { type: "number" },
      },
      required: [
        "grossBillings",
        "taxes",
        "refunds",
        "passThrough",
        "deferredIncrease",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netBillings: { type: "number" },
        recognizedRevenue: { type: "number" },
      },
      required: ["netBillings", "recognizedRevenue"],
    },
    ports: {
      inputs: [
        {
          id: "grossBillings",
          label: "Gross Billings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxes",
          label: "Taxes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refunds",
          label: "Refunds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passThrough",
          label: "Pass Through",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deferredIncrease",
          label: "Deferred Increase",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netBillings",
          label: "Net Billings",
          valueType: { type: "number" },
        },
        {
          id: "recognizedRevenue",
          label: "Recognized Revenue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grossNetRevenueRecognitionBridgeTool.execute;
export default grossNetRevenueRecognitionBridgeTool;
