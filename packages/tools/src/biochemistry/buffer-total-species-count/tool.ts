import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acidAmount: number;
  readonly baseAmount: number;
  readonly otherConjugateAmount: number;
};
export type Output = {
  readonly totalAmount: number;
  readonly baseShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acidAmount: { type: "number", minimum: 0 },
    baseAmount: { type: "number", minimum: 0 },
    otherConjugateAmount: { type: "number", minimum: 0 },
  },
  required: ["acidAmount", "baseAmount", "otherConjugateAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAmount: { type: "number" },
    baseShare: { type: "number" },
  },
  required: ["totalAmount", "baseShare"],
} as const;
/** Inventory of supplied analytical species, without acid-base equilibrium or preparation instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { acidAmount, baseAmount, otherConjugateAmount } = request;
  const compute = (): Output => {
    H.domain(
      acidAmount >= 0 &&
        baseAmount >= 0 &&
        otherConjugateAmount >= 0 &&
        acidAmount + baseAmount + otherConjugateAmount > 0,
    );
    return {
      totalAmount: acidAmount + baseAmount + otherConjugateAmount,
      baseShare: baseAmount / (acidAmount + baseAmount + otherConjugateAmount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { acidAmount: 2, baseAmount: 3, otherConjugateAmount: 5 },
  output: { totalAmount: 10, baseShare: 0.3 },
} satisfies ToolExample<Input, Output>;
export const bufferTotalSpeciesCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/buffer-total-species-count",
    title: "Buffer Total Species Count Tool",
    description:
      "Inventory of supplied analytical species, without acid-base equilibrium or preparation instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acidAmount: { type: "number", minimum: 0 },
        baseAmount: { type: "number", minimum: 0 },
        otherConjugateAmount: { type: "number", minimum: 0 },
      },
      required: ["acidAmount", "baseAmount", "otherConjugateAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalAmount: { type: "number" },
        baseShare: { type: "number" },
      },
      required: ["totalAmount", "baseShare"],
    },
    ports: {
      inputs: [
        {
          id: "acidAmount",
          label: "Acid Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseAmount",
          label: "Base Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherConjugateAmount",
          label: "Other Conjugate Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalAmount",
          label: "Total Amount",
          valueType: { type: "number" },
        },
        {
          id: "baseShare",
          label: "Base Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = bufferTotalSpeciesCountTool.execute;
export default bufferTotalSpeciesCountTool;
