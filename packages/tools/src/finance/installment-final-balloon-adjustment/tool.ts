import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly balance: number;
  readonly interest: number;
  readonly scheduledPayment: number;
};
export type Output = {
  readonly finalPayment: number;
  readonly adjustment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balance: { type: "number", minimum: 0 },
    interest: { type: "number" },
    scheduledPayment: { type: "number", minimum: 0 },
  },
  required: ["balance", "interest", "scheduledPayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalPayment: { type: "number" },
    adjustment: { type: "number" },
  },
  required: ["finalPayment", "adjustment"],
} as const;
/** Calculate installment final balloon adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { balance, interest, scheduledPayment } = request;
  const compute = (): Output => {
    H.domain(balance >= 0 && scheduledPayment >= 0);
    const finalPayment = balance + interest;
    H.domain(finalPayment >= 0);
    return { finalPayment, adjustment: finalPayment - scheduledPayment };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { balance: 500, interest: 10, scheduledPayment: 100 },
  output: { finalPayment: 510, adjustment: 410 },
} satisfies ToolExample<Input, Output>;
export const installmentFinalBalloonAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/installment-final-balloon-adjustment",
    title: "Installment Final Balloon Adjustment Tool",
    description:
      "Calculate installment final balloon adjustment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balance: { type: "number", minimum: 0 },
        interest: { type: "number" },
        scheduledPayment: { type: "number", minimum: 0 },
      },
      required: ["balance", "interest", "scheduledPayment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finalPayment: { type: "number" },
        adjustment: { type: "number" },
      },
      required: ["finalPayment", "adjustment"],
    },
    ports: {
      inputs: [
        {
          id: "balance",
          label: "Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interest",
          label: "Interest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scheduledPayment",
          label: "Scheduled Payment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finalPayment",
          label: "Final Payment",
          valueType: { type: "number" },
        },
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
export const run = installmentFinalBalloonAdjustmentTool.execute;
export default installmentFinalBalloonAdjustmentTool;
