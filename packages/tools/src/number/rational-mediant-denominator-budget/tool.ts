import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDenominator: number;
  readonly secondDenominator: number;
  readonly budget: number;
};
export type Output = { readonly denominator: number; readonly fits: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDenominator: { type: "integer", minimum: 1 },
    secondDenominator: { type: "integer", minimum: 1 },
    budget: { type: "integer", minimum: 1 },
  },
  required: ["firstDenominator", "secondDenominator", "budget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "integer" }, fits: { type: "boolean" } },
  required: ["denominator", "fits"],
} as const;
/** Calculate rational mediant denominator budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDenominator, secondDenominator, budget } = request;
  const compute = (): Output => {
    H.integer(firstDenominator, 1);
    H.integer(secondDenominator, 1);
    H.integer(budget, 1);
    const denominator = firstDenominator + secondDenominator;
    return { denominator, fits: denominator <= budget };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDenominator: 3, secondDenominator: 5, budget: 10 },
  output: { denominator: 8, fits: true },
} satisfies ToolExample<Input, Output>;
export const rationalMediantDenominatorBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/rational-mediant-denominator-budget",
    title: "Rational Mediant Denominator Budget Tool",
    description:
      "Calculate rational mediant denominator budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDenominator: { type: "integer", minimum: 1 },
        secondDenominator: { type: "integer", minimum: 1 },
        budget: { type: "integer", minimum: 1 },
      },
      required: ["firstDenominator", "secondDenominator", "budget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["denominator", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "firstDenominator",
          label: "First Denominator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDenominator",
          label: "Second Denominator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = rationalMediantDenominatorBudgetTool.execute;
export default rationalMediantDenominatorBudgetTool;
