import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawPayment: number;
  readonly floorAmount: number;
  readonly capAmount: number;
};
export type Output = { readonly payment: number; readonly adjustment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawPayment: { type: "number" },
    floorAmount: { type: "number", minimum: 0 },
    capAmount: { type: "number" },
  },
  required: ["rawPayment", "floorAmount", "capAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { payment: { type: "number" }, adjustment: { type: "number" } },
  required: ["payment", "adjustment"],
} as const;
/** Clamp a supplied raw earnout payment to explicit inclusive floor/cap amounts without interpreting an acquisition agreement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawPayment, floorAmount, capAmount } = request;
  const compute = (): Output => {
    H.domain(floorAmount >= 0 && capAmount >= floorAmount, "floorAmount");
    return (() => {
      const payment = Math.max(floorAmount, Math.min(capAmount, rawPayment));
      return { payment, adjustment: payment - rawPayment };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawPayment: 120, floorAmount: 20, capAmount: 100 },
  output: { payment: 100, adjustment: -20 },
} satisfies ToolExample<Input, Output>;
export const earnoutPaymentCapFloorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/earnout-payment-cap-floor",
    title: "Earnout Payment Cap Floor",
    description:
      "Clamp a supplied raw earnout payment to explicit inclusive floor/cap amounts without interpreting an acquisition agreement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawPayment: { type: "number" },
        floorAmount: { type: "number", minimum: 0 },
        capAmount: { type: "number" },
      },
      required: ["rawPayment", "floorAmount", "capAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payment: { type: "number" },
        adjustment: { type: "number" },
      },
      required: ["payment", "adjustment"],
    },
    ports: {
      inputs: [
        {
          id: "rawPayment",
          label: "Raw Payment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorAmount",
          label: "Floor Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capAmount",
          label: "Cap Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "payment", label: "Payment", valueType: { type: "number" } },
        {
          id: "adjustment",
          label: "Adjustment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = earnoutPaymentCapFloorTool.execute;
export default earnoutPaymentCapFloorTool;
