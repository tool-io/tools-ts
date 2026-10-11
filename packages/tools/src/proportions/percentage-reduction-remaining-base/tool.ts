import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialAmount: number;
  readonly reductionPercent: number;
};
export type Output = {
  readonly remainingAmount: number;
  readonly removedAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialAmount: { type: "number", minimum: 0 },
    reductionPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["initialAmount", "reductionPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingAmount: { type: "number" },
    removedAmount: { type: "number" },
  },
  required: ["remainingAmount", "removedAmount"],
} as const;
/** Apply an explicit 0-to-100 percentage reduction to an explicit nonnegative base amount. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialAmount, reductionPercent } = request;
  const compute = (): Output => {
    H.domain(initialAmount >= 0, "initialAmount");
    H.domain(
      reductionPercent >= 0 && reductionPercent <= 100,
      "reductionPercent",
    );
    return {
      remainingAmount: initialAmount * (1 - reductionPercent / 100),
      removedAmount: (initialAmount * reductionPercent) / 100,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialAmount: 200, reductionPercent: 15 },
  output: { remainingAmount: 170, removedAmount: 30 },
} satisfies ToolExample<Input, Output>;
export const percentageReductionRemainingBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/percentage-reduction-remaining-base",
    title: "Percentage Reduction Remaining Base",
    description:
      "Apply an explicit 0-to-100 percentage reduction to an explicit nonnegative base amount.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialAmount: { type: "number", minimum: 0 },
        reductionPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["initialAmount", "reductionPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingAmount: { type: "number" },
        removedAmount: { type: "number" },
      },
      required: ["remainingAmount", "removedAmount"],
    },
    ports: {
      inputs: [
        {
          id: "initialAmount",
          label: "Initial Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reductionPercent",
          label: "Reduction Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingAmount",
          label: "Remaining Amount",
          valueType: { type: "number" },
        },
        {
          id: "removedAmount",
          label: "Removed Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = percentageReductionRemainingBaseTool.execute;
export default percentageReductionRemainingBaseTool;
