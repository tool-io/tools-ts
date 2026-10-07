import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchaseTimestampSeconds: number;
  readonly refundTimestampSeconds: number;
};
export type Output = {
  readonly lagSeconds: number;
  readonly refundPredatesPurchase: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchaseTimestampSeconds: { type: "number" },
    refundTimestampSeconds: { type: "number" },
  },
  required: ["purchaseTimestampSeconds", "refundTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagSeconds: { type: "number" },
    refundPredatesPurchase: { type: "boolean" },
  },
  required: ["lagSeconds", "refundPredatesPurchase"],
} as const;
/** Describe a signed purchase-to-refund interval on a common timestamp scale while retaining chronology anomalies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchaseTimestampSeconds, refundTimestampSeconds } = request;
  const compute = (): Output => {
    return {
      lagSeconds: refundTimestampSeconds - purchaseTimestampSeconds,
      refundPredatesPurchase: refundTimestampSeconds < purchaseTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { purchaseTimestampSeconds: 1000, refundTimestampSeconds: 4600 },
  output: { lagSeconds: 3600, refundPredatesPurchase: false },
} satisfies ToolExample<Input, Output>;
export const refundLagSignedDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/refund-lag-signed-duration",
    title: "Refund Lag Signed Duration",
    description:
      "Describe a signed purchase-to-refund interval on a common timestamp scale while retaining chronology anomalies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchaseTimestampSeconds: { type: "number" },
        refundTimestampSeconds: { type: "number" },
      },
      required: ["purchaseTimestampSeconds", "refundTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagSeconds: { type: "number" },
        refundPredatesPurchase: { type: "boolean" },
      },
      required: ["lagSeconds", "refundPredatesPurchase"],
    },
    ports: {
      inputs: [
        {
          id: "purchaseTimestampSeconds",
          label: "Purchase Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refundTimestampSeconds",
          label: "Refund Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lagSeconds",
          label: "Lag Seconds",
          valueType: { type: "number" },
        },
        {
          id: "refundPredatesPurchase",
          label: "Refund Predates Purchase",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = refundLagSignedDurationTool.execute;
export default refundLagSignedDurationTool;
