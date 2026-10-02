import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly unitCost: number;
  readonly fixedFee: number;
};
export type Output = { readonly variable: number; readonly total: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    unitCost: { type: "number", minimum: 0 },
    fixedFee: { type: "number" },
  },
  required: ["quantity", "unitCost", "fixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { variable: { type: "number" }, total: { type: "number" } },
  required: ["variable", "total"],
} as const;
/** Calculate proportional cost fixedfee base from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { quantity, unitCost, fixedFee } = input;
  const compute = (): Output => {
    H.domain(quantity >= 0 && unitCost >= 0);
    const variable = quantity * unitCost;
    return { variable, total: variable + fixedFee };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { quantity: 5, unitCost: 12, fixedFee: 8 },
  output: { variable: 60, total: 68 },
} satisfies ToolExample<Input, Output>;
export const proportionalCostFixedfeeBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/proportional-cost-fixedfee-base",
    title: "Proportional Cost Fixedfee Base Tool",
    description:
      "Calculate proportional cost fixedfee base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        unitCost: { type: "number", minimum: 0 },
        fixedFee: { type: "number" },
      },
      required: ["quantity", "unitCost", "fixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { variable: { type: "number" }, total: { type: "number" } },
      required: ["variable", "total"],
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
          id: "unitCost",
          label: "Unit Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "variable", label: "Variable", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proportionalCostFixedfeeBaseTool.execute;
export default proportionalCostFixedfeeBaseTool;
