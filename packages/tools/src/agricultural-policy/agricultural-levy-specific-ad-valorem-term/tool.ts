import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly unitValue: number;
  readonly specificLevy: number;
  readonly valueRate: number;
};
export type Output = {
  readonly specificAmount: number;
  readonly valueAmount: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    unitValue: { type: "number", minimum: 0 },
    specificLevy: { type: "number", minimum: 0 },
    valueRate: { type: "number", minimum: 0 },
  },
  required: ["quantity", "unitValue", "specificLevy", "valueRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificAmount: { type: "number" },
    valueAmount: { type: "number" },
    total: { type: "number" },
  },
  required: ["specificAmount", "valueAmount", "total"],
} as const;
/** Combine explicitly supplied specific and ad valorem components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, unitValue, specificLevy, valueRate } = request;
  const compute = (): Output => {
    H.domain(
      quantity >= 0 && unitValue >= 0 && specificLevy >= 0 && valueRate >= 0,
    );
    return {
      specificAmount: quantity * specificLevy,
      valueAmount: quantity * unitValue * valueRate,
      total: quantity * specificLevy + quantity * unitValue * valueRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 10, unitValue: 100, specificLevy: 2, valueRate: 0.1 },
  output: { specificAmount: 20, valueAmount: 100, total: 120 },
} satisfies ToolExample<Input, Output>;
export const agriculturalLevySpecificAdValoremTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/agricultural-levy-specific-ad-valorem-term",
      title: "Agricultural Levy Specific Ad Valorem Term Tool",
      description:
        "Combine explicitly supplied specific and ad valorem components.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          quantity: { type: "number", minimum: 0 },
          unitValue: { type: "number", minimum: 0 },
          specificLevy: { type: "number", minimum: 0 },
          valueRate: { type: "number", minimum: 0 },
        },
        required: ["quantity", "unitValue", "specificLevy", "valueRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          specificAmount: { type: "number" },
          valueAmount: { type: "number" },
          total: { type: "number" },
        },
        required: ["specificAmount", "valueAmount", "total"],
      },
      ports: {
        inputs: [
          {
            id: "quantity",
            label: "Quantity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitValue",
            label: "Unit Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "specificLevy",
            label: "Specific Levy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "valueRate",
            label: "Value Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "specificAmount",
            label: "Specific Amount",
            valueType: { type: "number" },
          },
          {
            id: "valueAmount",
            label: "Value Amount",
            valueType: { type: "number" },
          },
          { id: "total", label: "Total", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalLevySpecificAdValoremTermTool.execute;
export default agriculturalLevySpecificAdValoremTermTool;
