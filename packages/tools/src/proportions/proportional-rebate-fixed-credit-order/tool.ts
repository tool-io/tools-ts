import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly base: number;
  readonly rebate: number;
  readonly credit: number;
};
export type Output = {
  readonly rebateThenCredit: number;
  readonly creditThenRebate: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "number" },
    rebate: { type: "number", minimum: 0, maximum: 1 },
    credit: { type: "number" },
  },
  required: ["base", "rebate", "credit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rebateThenCredit: { type: "number" },
    creditThenRebate: { type: "number" },
    gap: { type: "number" },
  },
  required: ["rebateThenCredit", "creditThenRebate", "gap"],
} as const;
/** Calculate proportional rebate fixed credit order from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { base, rebate, credit } = request;
  const compute = (): Output => {
    H.probability(rebate);
    const a = base * (1 - rebate) - credit,
      b = (base - credit) * (1 - rebate);
    return { rebateThenCredit: a, creditThenRebate: b, gap: b - a };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { base: 100, rebate: 0.2, credit: 10 },
  output: { rebateThenCredit: 70, creditThenRebate: 72, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const proportionalRebateFixedCreditOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/proportional-rebate-fixed-credit-order",
    title: "Proportional Rebate Fixed Credit Order Tool",
    description:
      "Calculate proportional rebate fixed credit order from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "number" },
        rebate: { type: "number", minimum: 0, maximum: 1 },
        credit: { type: "number" },
      },
      required: ["base", "rebate", "credit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rebateThenCredit: { type: "number" },
        creditThenRebate: { type: "number" },
        gap: { type: "number" },
      },
      required: ["rebateThenCredit", "creditThenRebate", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rebate",
          label: "Rebate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "credit",
          label: "Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rebateThenCredit",
          label: "Rebate Then Credit",
          valueType: { type: "number" },
        },
        {
          id: "creditThenRebate",
          label: "Credit Then Rebate",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proportionalRebateFixedCreditOrderTool.execute;
export default proportionalRebateFixedCreditOrderTool;
