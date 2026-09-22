import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly beta: number;
  readonly delta: number;
  readonly periods: number;
};
export type Output = {
  readonly discounted: number;
  readonly exponentialOnly: number;
  readonly presentBiasDiscount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    beta: { type: "number", minimum: 0, maximum: 1 },
    delta: { type: "number", minimum: 0, maximum: 1 },
    periods: { type: "integer", minimum: 0 },
  },
  required: ["amount", "beta", "delta", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discounted: { type: "number" },
    exponentialOnly: { type: "number" },
    presentBiasDiscount: { type: "number" },
  },
  required: ["discounted", "exponentialOnly", "presentBiasDiscount"],
} as const;
/** Beta-delta quasi-hyperbolic convention applies beta only to strictly future periods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, beta, delta, periods } = request;
  const compute = (): Output => {
    H.domain(amount >= 0);
    H.probability(beta);
    H.probability(delta);
    H.integer(periods, 0);
    return {
      discounted: periods === 0 ? amount : amount * beta * delta ** periods,
      exponentialOnly: amount * delta ** periods,
      presentBiasDiscount:
        periods === 0 ? 0 : amount * (1 - beta) * delta ** periods,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 100, beta: 0.8, delta: 0.5, periods: 2 },
  output: {
    discounted: 20,
    exponentialOnly: 25,
    presentBiasDiscount: 4.999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const quasiHyperbolicPresentPremiumTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/quasi-hyperbolic-present-premium-term",
    title: "Quasi Hyperbolic Present Premium Term Tool",
    description:
      "Beta-delta quasi-hyperbolic convention applies beta only to strictly future periods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        beta: { type: "number", minimum: 0, maximum: 1 },
        delta: { type: "number", minimum: 0, maximum: 1 },
        periods: { type: "integer", minimum: 0 },
      },
      required: ["amount", "beta", "delta", "periods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discounted: { type: "number" },
        exponentialOnly: { type: "number" },
        presentBiasDiscount: { type: "number" },
      },
      required: ["discounted", "exponentialOnly", "presentBiasDiscount"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beta",
          label: "Beta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delta",
          label: "Delta",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periods",
          label: "Periods",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "discounted",
          label: "Discounted",
          valueType: { type: "number" },
        },
        {
          id: "exponentialOnly",
          label: "Exponential Only",
          valueType: { type: "number" },
        },
        {
          id: "presentBiasDiscount",
          label: "Present Bias Discount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quasiHyperbolicPresentPremiumTermTool.execute;
export default quasiHyperbolicPresentPremiumTermTool;
