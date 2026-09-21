import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseRate: number;
  readonly tierFactor: number;
  readonly eligibleIncrement: number;
};
export type Output = {
  readonly marginalRate: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseRate: { type: "number", minimum: 0 },
    tierFactor: { type: "number", minimum: 0 },
    eligibleIncrement: { type: "number", minimum: 0 },
  },
  required: ["baseRate", "tierFactor", "eligibleIncrement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginalRate: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["marginalRate", "contribution"],
} as const;
/** Calculate payment tier marginal factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseRate, tierFactor, eligibleIncrement } = request;
  const compute = (): Output => {
    H.domain(baseRate >= 0 && tierFactor >= 0 && eligibleIncrement >= 0);
    return {
      marginalRate: baseRate * tierFactor,
      contribution: baseRate * tierFactor * eligibleIncrement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseRate: 10, tierFactor: 0.5, eligibleIncrement: 3 },
  output: { marginalRate: 5, contribution: 15 },
} satisfies ToolExample<Input, Output>;
export const paymentTierMarginalFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/payment-tier-marginal-factor",
    title: "Payment Tier Marginal Factor Tool",
    description:
      "Calculate payment tier marginal factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseRate: { type: "number", minimum: 0 },
        tierFactor: { type: "number", minimum: 0 },
        eligibleIncrement: { type: "number", minimum: 0 },
      },
      required: ["baseRate", "tierFactor", "eligibleIncrement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginalRate: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["marginalRate", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "baseRate",
          label: "Base Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tierFactor",
          label: "Tier Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleIncrement",
          label: "Eligible Increment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginalRate",
          label: "Marginal Rate",
          valueType: { type: "number" },
        },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paymentTierMarginalFactorTool.execute;
export default paymentTierMarginalFactorTool;
