import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPrice: number;
  readonly secondPrice: number;
  readonly firstTax: number;
  readonly secondTax: number;
};
export type Output = {
  readonly slope: number;
  readonly firstNetPrice: number;
  readonly secondNetPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPrice: { type: "number" },
    secondPrice: { type: "number" },
    firstTax: { type: "number" },
    secondTax: { type: "number" },
  },
  required: ["firstPrice", "secondPrice", "firstTax", "secondTax"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    firstNetPrice: { type: "number" },
    secondNetPrice: { type: "number" },
  },
  required: ["slope", "firstNetPrice", "secondNetPrice"],
} as const;
/** Compute a two-good budget-line slope from explicit per-unit taxes or subsidies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPrice, secondPrice, firstTax, secondTax } = request;
  const compute = (): Output => {
    H.domain(firstPrice + firstTax > 0 && secondPrice + secondTax > 0);
    return {
      slope: -(firstPrice + firstTax) / (secondPrice + secondTax),
      firstNetPrice: firstPrice + firstTax,
      secondNetPrice: secondPrice + secondTax,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPrice: 2, secondPrice: 4, firstTax: 1, secondTax: 2 },
  output: { slope: -0.5, firstNetPrice: 3, secondNetPrice: 6 },
} satisfies ToolExample<Input, Output>;
export const netTaxBudgetLineSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/net-tax-budget-line-slope",
    title: "Net Tax Budget Line Slope Tool",
    description:
      "Compute a two-good budget-line slope from explicit per-unit taxes or subsidies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPrice: { type: "number" },
        secondPrice: { type: "number" },
        firstTax: { type: "number" },
        secondTax: { type: "number" },
      },
      required: ["firstPrice", "secondPrice", "firstTax", "secondTax"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        firstNetPrice: { type: "number" },
        secondNetPrice: { type: "number" },
      },
      required: ["slope", "firstNetPrice", "secondNetPrice"],
    },
    ports: {
      inputs: [
        {
          id: "firstPrice",
          label: "First Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPrice",
          label: "Second Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstTax",
          label: "First Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTax",
          label: "Second Tax",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slope", label: "Slope", valueType: { type: "number" } },
        {
          id: "firstNetPrice",
          label: "First Net Price",
          valueType: { type: "number" },
        },
        {
          id: "secondNetPrice",
          label: "Second Net Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = netTaxBudgetLineSlopeTool.execute;
export default netTaxBudgetLineSlopeTool;
