import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prepaidValue: number;
  readonly suppliedRefundFraction: number;
};
export type Output = {
  readonly refundReserve: number;
  readonly remainingPrepaidValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prepaidValue: { type: "number", minimum: 0 },
    suppliedRefundFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["prepaidValue", "suppliedRefundFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    refundReserve: { type: "number" },
    remainingPrepaidValue: { type: "number" },
  },
  required: ["refundReserve", "remainingPrepaidValue"],
} as const;
/** Apply an explicit assumed refund fraction to prepaid order value without predicting refunds or setting accounting reserves. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prepaidValue, suppliedRefundFraction } = request;
  const compute = (): Output => {
    H.domain(prepaidValue >= 0, "prepaidValue");
    (H.domain(
      suppliedRefundFraction >= 0 && suppliedRefundFraction <= 1,
      "suppliedRefundFraction",
    ),
      suppliedRefundFraction);
    return {
      refundReserve: prepaidValue * suppliedRefundFraction,
      remainingPrepaidValue: prepaidValue * (1 - suppliedRefundFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prepaidValue: 1000, suppliedRefundFraction: 0.2 },
  output: { refundReserve: 200, remainingPrepaidValue: 800 },
} satisfies ToolExample<Input, Output>;
export const startupPreorderRefundReserveTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-preorder-refund-reserve-term",
    title: "Startup Preorder Refund Reserve Term Tool",
    description:
      "Apply an explicit assumed refund fraction to prepaid order value without predicting refunds or setting accounting reserves.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prepaidValue: { type: "number", minimum: 0 },
        suppliedRefundFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["prepaidValue", "suppliedRefundFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        refundReserve: { type: "number" },
        remainingPrepaidValue: { type: "number" },
      },
      required: ["refundReserve", "remainingPrepaidValue"],
    },
    ports: {
      inputs: [
        {
          id: "prepaidValue",
          label: "Prepaid Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRefundFraction",
          label: "Supplied Refund Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "refundReserve",
          label: "Refund Reserve",
          valueType: { type: "number" },
        },
        {
          id: "remainingPrepaidValue",
          label: "Remaining Prepaid Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = startupPreorderRefundReserveTermTool.execute;
export default startupPreorderRefundReserveTermTool;
